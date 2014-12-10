import Vector from '../components/vector';

class PhysicsSystem {

    constructor (options) {

        this.timeStep = options.timeStep !== undefined ? options.timeStep : (1 / 60);

        this.gravity = options.gravity !== undefined ? options.gravity : { x: 0, y: 9.81 };
    }

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
