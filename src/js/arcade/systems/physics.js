class PhysicsSystem {

    constructor (options) {

        this.timeStep = options.timeStep !== undefined ? options.timeStep : (1 / 60);

        this.gravity = options.gravity !== undefined ? options.gravity : { x: 0, y: 9.81 };
    }

    update (entities, world) {

        var i, count;

        for (i = 0, count = entities.length; i < count; i++) {

            let entity = entities[i];
            let position = entity.components.position;
            let velocity = entity.components.velocity;
            let gravity = entity.components.gravity;
            let force = entity.components.force;
            let mass = entity.components.mass;

            if (position) {

                position.previous.x = position.x;
                position.previous.y = position.y;
            }

            if (gravity && velocity) {

                velocity.x += gravity.gravityScale * this.gravity.x * this.timeStep;
                velocity.y += gravity.gravityScale * this.gravity.y * this.timeStep;
            }

            if (force && velocity) {

                velocity.x += (mass ? mass.inverseMass : 1) * force.x * this.timeStep;
                velocity.y += (mass ? mass.inverseMass : 1) * force.y * this.timeStep;

                force.x = 0;
                force.y = 0;
            }

            if (position && velocity) {

                position.x += velocity.x * this.timeStep;
                position.y += velocity.y * this.timeStep;
            }
        }
    }
}

export default PhysicsSystem;
