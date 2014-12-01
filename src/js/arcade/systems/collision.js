import Vector from '../components/vector';

class CollisionSystem {

    constructor (options) {

        this.positionCorrectionFactor = options.positionCorrectionFactor !== undefined ? options.positionCorrectionFactor : 0.2;
        this.positionCorrectionThreshold = options.positionCorrectionThreshold !== undefined ? options.positionCorrectionThreshold : 0.01;
    }

    update (entities, world) {

        var i, count;

        for (i = 0, count = entities.length; i < count; i++) {

            let entity = entities[i];
            let collision = entity.components.collision;

            if (collision) {

                let candidates = world.getCollisionCandidates(entity);
                let collisions = [];

                for (let k = 0, length = candidates.length; k < length; k++) {

                    let manifest = this.circleVsCircle(this.getBoundingCircle(entity), this.getBoundingCircle(candidates[k]));

                    if (manifest) {
                        manifest.a = entity;
                        manifest.b = candidates[k];
                        collisions.push(manifest);
                    }
                }

                collisions.forEach(function (collision) {

                    this.resolveCollision(collision);

                }.bind(this));
            }
        }
    }

    getBoundingBox (entity) {

        var position = entity.components.position;
        var collision = entity.components.collision;

        var width = collision.shape.width !== undefined ? collision.shape.width / 2 : collision.shape.radius;
        var height = collision.shape.height !== undefined ? collision.shape.height / 2 : collision.shape.radius;

        return { xmin: position.x - width, ymin: position.y - height, xmax: position.x + width, ymax: position.y + height };
    }

    getAABB (entity) {

        var position = entity.components.position;
        var collision = entity.components.collision;

        var width = collision.shape.width !== undefined ? collision.shape.width / 2 : collision.shape.radius;
        var height = collision.shape.height !== undefined ? collision.shape.height / 2 : collision.shape.radius;

        return {
            x: position.x,
            y: position.y,
            width: width * 2,
            height: height * 2,
            min: {
                x: position.x - width,
                y: position.y - height
            },
            max: {
                x: position.x + width,
                y: position.y + height
            }
        };
    }

    getBoundingCircle (entity) {

        var position = entity.components.position;
        var collision = entity.components.collision;

        var radius = collision.shape.radius !== undefined ?
            collision.shape.radius :
            Math.sqrt(Math.pow(collision.shape.width, 2) + Math.pow(collision.shape.height, 2)) / 2;

        return { x: position.x, y: position.y, radius: radius };
    }

    AABBvsAABB (box1, box2) {

        var normal = Vector.subtract(box2, box1);

        var xOverlap = (box1.width + box2.width) / 2 - Math.abs(normal.x);

        // SAT on x-axis
        if (xOverlap >= 0) {

            var yOverlap = (box1.height + box2.height) / 2 - Math.abs(normal.y);

            // SAT on y-axis
            if (yOverlap >= 0) {

                let manifold = {
                    a: box1,
                    b: box2
                };

                // least penetration
                if (xOverlap <= yOverlap) {

                    if (normal.x < 0) {
                        manifold.normal = new Vector({ x: -1, y: 0 });
                    }
                    else {
                        manifold.normal = new Vector({ x: 1, y: 0 });
                    }

                    manifold.penetration = xOverlap;
                }
                else {

                    if (normal.y < 0) {
                        manifold.normal = new Vector({ x: 0, y: -1 });
                    }
                    else {
                        manifold.normal = new Vector({ x: 0, y: 1 });
                    }

                    manifold.penetration = yOverlap;
                }

                return manifold;
            }
        }

        return undefined;
    }

    circleVsCircle (circle1, circle2) {

        var normal = Vector.subtract(circle2, circle1);

        var minDistance = circle1.radius + circle2.radius;

        var colliding = Math.pow(normal.x, 2) + Math.pow(normal.y, 2) <= Math.pow(minDistance, 2);

        if (colliding) {

            let manifold = {
                a: circle1,
                b: circle2
            };

            let distance = Vector.magnitude(normal);

            if (distance !== 0) {
                manifold.penetration = minDistance - distance;
                manifold.normal = { x: normal.x / distance, y: normal.y / distance };
            }
            else {
                manifold.penetration = circle1.radius;
                manifold.normal = { x: 1, y: 0 };
            }

            return manifold;
        }

        return undefined;
    }

    resolveCollision (manifold) {

        var entityA = manifold.a;
        var entityB = manifold.b;

        var relativeVelocity = Vector.subtract(entityB.components.velocity, entityA.components.velocity);

        var relativeVelocityProjection = Vector.dotProduct(relativeVelocity, manifold.normal);

        // velocities are separating, no resolution
        if (relativeVelocityProjection > 0) { return; }

        // TODO: calculate correct restitution
        var restitution = 0.5;

        var impulseScalar = -(1 + restitution) * relativeVelocityProjection;
        impulseScalar /= (entityA.components.mass.inverseMass + entityB.components.mass.inverseMass);

        var impulse = Vector.scale(manifold.normal, impulseScalar);

        entityA.components.velocity.subtract(Vector.scale(impulse, entityA.components.mass.inverseMass));
        entityB.components.velocity.add(Vector.scale(impulse, entityB.components.mass.inverseMass));

        this.correctPosition(manifold);
    }

    correctPosition (manifold) {

        var penetration = manifold.penetration - this.positionCorrectionThreshold;

        if (penetration > 0) {

            let a = manifold.a;
            let b = manifold.b;

            let correctionScalar = (penetration / (a.components.mass.inverseMass + b.components.mass.inverseMass)) * this.positionCorrectionFactor;
            let correctionVector = Vector.scale(manifold.normal, correctionScalar);

            a.components.position.subtract(Vector.scale(correctionVector, a.components.mass.inverseMass));
            b.components.position.add(Vector.scale(correctionVector, b.components.mass.inverseMass));
        }
    }
}

export default CollisionSystem;
