import Vector from '../components/vector';
import Shape from '../components/shape';
import Material from '../components/material';

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
            this.correctPosition(collision);
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

    /**
     * Test an AABB and a BC for collision
     *
     * @param {object} a
     * @param {object} b
     * @param {object} collision
     * @returns {boolean}
     */
    AABBvsBC (a, b, collision) {

        var ab = Vector.subtract(b, a);

        // we can now determine the closest point on the AABB to the BC by projecting
        // the vector ab on the edges of the AABB and limiting it (clamping it) to the AABB
        // as ab originates in the AABB's center, min and max are the negative and positive extend of the AABB
        var closest = Vector.clamp(ab, Vector.scale(a.extend, -1), a.extend);

        // the collision normal is then simply the vector from the closest point on the AABB to the BC center
        var normal = Vector.subtract(ab, closest);

        var minDistance = b.radius;
        var distance    = Math.pow(normal.x, 2) + Math.pow(normal.y, 2);

        // square root is expensive, so we check collision with the square of the distances
        if (distance <= Math.pow(minDistance, 2)) {

            // now that we know there's a collision, we calculate the square root
            distance = Math.sqrt(distance);

            collision.normal = normal.scale(1 / distance);
            collision.penetration = minDistance - distance;

            return true;
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

    resolveCollision (manifold) {

        var entityA = manifold.a;
        var entityB = manifold.b;

        var velocityA = entityA.components.velocity;
        var velocityB = entityB.components.velocity;

        var materialA = entityA.components.material;
        var materialB = entityB.components.material;

        var massA = entityA.components.mass;
        var massB = entityB.components.mass;

        var relativeVelocity    = Vector.subtract(velocityB, velocityA);
        var velocityProjection  = Vector.dotProduct(relativeVelocity, manifold.normal);

        // velocities are separating, no resolution
        if (velocityProjection > 0) { return; }

        var restitution         = Material.getRestitution(materialA, materialB);
        var totalInverseMass    = massA.inverseMass + massB.inverseMass;

        // in a collision, the objects velocity gets reflected along the collision normal
        // due to the normal force excerted on it by the colliding object
        // as the collision time is very short, we can express this normal force as an impulse
        // which represents the normal force over the collision time and apply the impulse to the objects

        var normalImpulseScalar = (-(1 + restitution) * velocityProjection) / totalInverseMass;

        var normalImpulse = Vector.scale(manifold.normal, normalImpulseScalar);

        // apply the normal impulse
        velocityA.subtract(Vector.scale(normalImpulse, massA.inverseMass));
        velocityB.add(Vector.scale(normalImpulse, massB.inverseMass));

        // the friction forces during a collision depend on the normal force
        // the normal impulse represents the integral of the normal force during the collision
        // and we can derive the friction impulse from the normal impulse
        // the friction impulse will point along the collision tangent in negative direction

        var tangent = new Vector(-manifold.normal.y, manifold.normal.x);

        velocityProjection = relativeVelocity.dotProduct(tangent);

        if (velocityProjection === 0) { return; }
        if (velocityProjection < 0) { tangent.scale(-1); }

        var frictionImpulseScalar = (velocityProjection < 0 ? velocityProjection : -velocityProjection) / totalInverseMass;

        var frictionImpulse;

        var staticFriction = Material.getStaticFriction(materialA, materialB);
        var dynamicFriction = Material.getDynamicFriction(materialA, materialB);

        // TODO: When should we use static vs dynamic friction? Do we need to affect forces?
        if (Math.abs(frictionImpulseScalar) < normalImpulseScalar * staticFriction) {
            frictionImpulse = Vector.scale(tangent, frictionImpulseScalar);
        }
        else {
            frictionImpulse = Vector.scale(tangent, -normalImpulseScalar * dynamicFriction);
        }

        velocityA.subtract(Vector.scale(frictionImpulse, massA.inverseMass));
        velocityB.add(Vector.scale(frictionImpulse, massB.inverseMass));
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
