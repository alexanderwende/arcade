import Vector from '../components/vector';

class PhysicsSystem {

    constructor (options) {

        this.timeStep = options.timeStep !== undefined ? options.timeStep : (1 / 60);

        this.gravity = options.gravity !== undefined ? options.gravity : { x: 0, y: 9.81 };
    }

//    updateOld (entities, world) {
//
//        var i, count;
//
//        for (i = 0, count = entities.length; i < count; i++) {
//
//            let entity = entities[i];
//            let position = entity.components.position;
//            let velocity = entity.components.velocity;
//            let gravity = entity.components.gravity;
//            let force = entity.components.force;
//            let mass = entity.components.mass;
//
//            if (position) {
//
//                position.previous.x = position.x;
//                position.previous.y = position.y;
//            }
//
//            if (gravity && velocity) {
//
//                velocity.x += gravity.gravityScale * this.gravity.x * this.timeStep;
//                velocity.y += gravity.gravityScale * this.gravity.y * this.timeStep;
//            }
//
//            if (force && velocity) {
//
//                velocity.x += (mass ? mass.inverseMass : 1) * force.x * this.timeStep;
//                velocity.y += (mass ? mass.inverseMass : 1) * force.y * this.timeStep;
//
//                force.x = 0;
//                force.y = 0;
//            }
//
//            if (position && velocity) {
//
//                position.x += velocity.x * this.timeStep;
//                position.y += velocity.y * this.timeStep;
//            }
//        }
//    }

    update (entities, world) {

        for (var i = 0, length = entities.length; i < length; i++) {

            let entity = entities[i];

            let position    = entity.components.position;
            let velocity    = entity.components.velocity;
            let gravity     = entity.components.gravity;
            let force       = entity.components.force;

            let totalForce  = new Vector(0, 0);

            let mass        = entity.components.mass ? entity.components.mass.mass : 0;
            let inverseMass = entity.components.mass ? entity.components.mass.inverseMass : 0;

            // store previous position for smoothing interpolation
            if (position) {

                position.previous.x = position.x;
                position.previous.y = position.y;
            }

            // only objects with mass will be affected by forces
            if (mass !== 0) {

                if (gravity) {

                    totalForce.add(Vector.scale(this.gravity, gravity.gravityScale).scale(mass));
                }

                if (force) {

                    totalForce.add(force);

                    force.x = 0;
                    force.y = 0;
                }
            }

            // now we can integrate the new state (position and velocity)
            this.integrateSymplecticAverage(position, velocity, totalForce, inverseMass, this.timeStep);
        }
    }

    /**
     * @param {Vector} position
     * @param {Vector} velocity
     * @param {Vector} force
     * @param {number} inverseMass
     * @param {number} dt
     */
    integrateSymplectic (position, velocity, force, inverseMass, dt) {

        velocity.add(Vector.scale(force, inverseMass).scale(dt));
        position.add(Vector.scale(velocity, dt));
    }

    /**
     * @param {Vector} position
     * @param {Vector} velocity
     * @param {Vector} force
     * @param {number} inverseMass
     * @param {number} dt
     */
    integrateSymplecticAverage (position, velocity, force, inverseMass, dt) {

        let acceleration = Vector.scale(force, inverseMass).scale(dt);

        position.add(Vector.add(velocity, acceleration.scale(0.5)).scale(dt));
        velocity.add(acceleration);
    }
}

export default PhysicsSystem;
