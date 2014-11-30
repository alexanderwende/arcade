class Vector {

    static add (...vectors) {

        let x = vectors[0].x,
            y = vectors[0].y;

        for (let i = 1, length = vectors.length; i < length; i++) {
            x += vectors[i].x;
            y += vectors[i].y;
        }

        return {x: x, y: y};
    }

    static subtract (...vectors) {

        let x = vectors[0].x,
            y = vectors[0].y;

        for (let i = 1, length = vectors.length; i < length; i++) {
            x -= vectors[i].x;
            y -= vectors[i].y;
        }

        return {x: x, y: y};
    }

    static multiply (...vectors) {

        let x = vectors[0].x,
            y = vectors[0].y;

        for (let i = 1, length = vectors.length; i < length; i++) {
            x *= vectors[i].x;
            y *= vectors[i].y;
        }

        return {x: x, y: y};
    }

    static dotProduct (vector1, vector2) {

        return vector1.x * vector2.x + vector1.y * vector2.y;
    }

    static scale (vector, factor) {

        return { x: vector.x * factor, y: vector.y * factor };
    }

    static magnitude (vector) {

        return Math.sqrt(Math.pow(vector.x, 2) + Math.pow(vector.y, 2));
    }

    static distance (vector1, vector2) {

        return Math.sqrt(Math.pow(vector1.x - vector2.x, 2) + Math.pow(vector1.y - vector2.y, 2));
    }

    static normalize (vector) {

        let length = Vector.length(vector);

        return { x: vector.x / length, y: vector.y / length };
    }
}

class CollisionSystem {

    constructor (options) {}

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

    getBoundingCircle (entity) {

        var position = entity.components.position;
        var collision = entity.components.collision;

        var radius = collision.shape.radius !== undefined ?
            collision.shape.radius :
            Math.sqrt(Math.pow(collision.shape.width, 2) + Math.pow(collision.shape.height, 2)) / 2;

        return { x: position.x, y: position.y, radius: radius };
    }

    boxVsBox (box1, box2) {

        var colliding = box1.xmax >= box2.xmin &&
                        box1.xmin <= box2.xmax &&
                        box1.ymax >= box2.ymin &&
                        box1.ymin <= box2.ymax;

        return colliding;
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
        var restitution = 1;

        var impulseScalar = -(1 + restitution) * relativeVelocityProjection;
        impulseScalar /= (entityA.components.mass.inverseMass + entityB.components.mass.inverseMass);

        var impulse = Vector.scale(manifold.normal, impulseScalar);

        entityA.components.velocity.subtract(Vector.scale(impulse, entityA.components.mass.inverseMass));
        entityB.components.velocity.add(Vector.scale(impulse, entityB.components.mass.inverseMass));
    }
}

export default CollisionSystem;
