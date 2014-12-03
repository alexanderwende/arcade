import Vector from '../components/vector';
import Shape from '../components/shape';

class CollisionSystem {

    constructor (options) {

        this.positionCorrectionFactor = options.positionCorrectionFactor !== undefined ? options.positionCorrectionFactor : 0.2;
        this.positionCorrectionThreshold = options.positionCorrectionThreshold !== undefined ? options.positionCorrectionThreshold : 0.01;
    }

    update (entities, world) {

        var collisions = [];

        // collect all collision
        for (let entity of entities) {

            if (entity.components.collision) {

                let candidates = world.getCollisionCandidates(entity);

                for (let candidate of candidates) {

                    let collision = {
                        a: entity,
                        b: candidate
                    };

                    if (this.checkCollision(entity, candidate, collision)) {

                        collisions.push(collision);
                    }
                }
            }
        }

        // resolve all collisions
        for (let collision of collisions) {

            this.resolveCollision(collision);
        }
    }

    checkCollision (entityA, entityB, collision) {

        var shapeA = this.getBoundingShape(entityA);
        var shapeB = this.getBoundingShape(entityB);

        var algorithm = this.getCollisionAlgorithm(shapeA, shapeB);

        if (algorithm) {

            return algorithm(shapeA, shapeB, collision);
        }

        return false;
    }

    /**
     * Get the bounding shape for an entity based on its collision shape
     *
     * @param {Entity} entity
     * @returns {object|undefined}
     */
    getBoundingShape (entity) {

        var position    = entity.components.position;
        var orientation = entity.components.orientation;
        var shape       = entity.components.collision.shape;

        switch (shape.type) {

            case Shape.TYPE.RECT:
                return (orientation) ? this.getOBB(position, orientation, shape) : this.getAABB(position, shape);
                break;

            case Shape.TYPE.CIRCLE:
                return this.getBC(position, shape);
                break;
        }
    }

    /**
     * Get the collision algorithm for two bounding shapes
     *
     * @param {object} shapeA
     * @param {object} shapeB
     * @returns {function|undefined}
     */
    getCollisionAlgorithm (shapeA, shapeB) {

        var algorithm = shapeA.type + 'vs' + shapeB.type;

        return this[algorithm].bind(this) || undefined;
    }

    getAABB (position, shape) {

        var aabb = position.clone();

        aabb.extend = new Vector({ x: shape.width / 2, y: shape.height / 2 });
        aabb.min    = new Vector({ x: position.x - aabb.extend.x, y: position.y - aabb.extend.y });
        aabb.max    = new Vector({ x: position.x + aabb.extend.x, y: position.y + aabb.extend.y });
        aabb.type   = 'AABB';

        return aabb;
    }

    getOBB (position, orientation, shape) {

        var obb = position.clone();

        obb.extend = new Vector({ x: shape.width / 2, y: shape.height / 2 });
        obb.min    = new Vector({ x: position.x - obb.extend.x, y: position.y - obb.extend.y });
        obb.max    = new Vector({ x: position.x + obb.extend.x, y: position.y + obb.extend.y });
        obb.type   = 'OBB';

        return obb;
    }

    getBC (position, shape) {

        var bc = position.clone();

        bc.radius   = shape.radius;
        bc.type     = 'BC';

        return bc;
    }

    /**
     * Test two AABBs for collision
     *
     * @param {object} a
     * @param {object} b
     * @param {object} collision
     * @returns {boolean}
     */
    AABBvsAABB (a, b, collision) {

        var normal = Vector.subtract(b, a);

        var xOverlap = (a.extend.x + b.extend.x) - Math.abs(normal.x);

        // SAT on x-axis
        if (xOverlap >= 0) {

            var yOverlap = (a.extend.y + b.extend.y) - Math.abs(normal.y);

            // SAT on y-axis
            if (yOverlap >= 0) {

                // least penetration
                if (xOverlap <= yOverlap) {

                    if (normal.x < 0) {
                        collision.normal = new Vector({ x: -1, y: 0 });
                    }
                    else {
                        collision.normal = new Vector({ x: 1, y: 0 });
                    }

                    collision.penetration = xOverlap;
                }
                else {

                    if (normal.y < 0) {
                        collision.normal = new Vector({ x: 0, y: -1 });
                    }
                    else {
                        collision.normal = new Vector({ x: 0, y: 1 });
                    }

                    collision.penetration = yOverlap;
                }

                return true;
            }
        }

        return false;
    }

    AABBvsBC (a, b, collision) {

        var normal = Vector.subtract(b, a);

        var xOverlap = (a.extend.x + b.radius) - Math.abs(normal.x);

        // SAT on x-axis
        if (xOverlap >= 0) {

            var yOverlap = (a.extend.y + b.radius) - Math.abs(normal.y);

            // SAT on y-axis
            if (yOverlap >= 0) {

                // Now find voronoi region of the circle's center to get the closest point of the AABB to the circle's center
                // Then project the AABB's center and closest point on the vector as well as radius and test for overlap

                // aabb right of bc
                if (a.min.x > b.x) {
                    // aabb below bc
                    if (a.min.y > b.y) {
                        normal = Vector.subtract(b, a.min);
                    }
                    // aabb above bc
                    else if (a.max.y < b.y) {
                        normal = Vector.subtract(b, {x: a.min.x, y: a.max.y});
                    }
                    // aabb aligned with bc
                    else {
                        collision.normal = new Vector(-1, 0);
                        collision.penetration = a.extend.x + b.radius - Math.abs(normal.x);
                    }
                }
                // aabb left of bc
                else if (a.max.x < b.x) {
                    // aabb below bc
                    if (a.min.y > b.y) {
                        normal = Vector.subtract(b, {x: a.max.x, y: a.min.y});
                    }
                    // aabb above bc
                    else if (a.max.y < b.y) {
                        normal = Vector.subtract(b, a.max);
                    }
                    // aabb aligned with bc
                    else {
                        collision.normal = new Vector(1, 0);
                        collision.penetration = a.extend.x + b.radius - Math.abs(normal.x);
                    }
                }
                else {
                    // aabb below bc
                    if (a.min.y > b.y) {
                        collision.normal = new Vector(0, -1);
                        collision.penetration = a.extend.y + b.radius - Math.abs(normal.y);
                    }
                    // aabb above bc
                    else {
                        collision.normal = new Vector(0, 1);
                        collision.penetration = a.extend.y + b.radius - Math.abs(normal.y);
                    }
                }

                return true;
            }
        }

        return false;
    }

    BCvsAABB (a, b, collision) {

        var result = this.AABBvsBC(b, a, collision);

        if (result) {
            collision.normal.scale(-1);
        }

        return result;
    }

    /**
     * Test two BCs for collision
     *
     * @param {object} a
     * @param {object} b
     * @param {object} collision
     * @returns {boolean}
     */
    BCvsBC (a, b, collision) {

        var normal = Vector.subtract(b, a);

        var minDistance = a.radius + b.radius;
        var distance    = Math.pow(normal.x, 2) + Math.pow(normal.y, 2);

        // square root is expensive, so we check collision with the square of the distances
        if (distance <= Math.pow(minDistance, 2)) {

            // now that we know the circles are colliding, we calculate the square root
            distance = Math.sqrt(distance);

            if (distance !== 0) {
                collision.penetration = minDistance - distance;
                collision.normal = normal.scale(1 / distance);
            }
            else {
                collision.penetration = a.radius;
                // in this case we have to simply pick a normal and stay consistent
                collision.normal = new Vector({ x: 1, y: 0 });
            }

            return true;
        }

        return false;
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
