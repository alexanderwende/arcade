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

            if (position) {

                position.previous.x = position.x;
                position.previous.y = position.y;
            }

            if (gravity && velocity) {

                velocity.x += gravity.gravityScale * this.gravity.x * this.timeStep;
                velocity.y += gravity.gravityScale * this.gravity.y * this.timeStep;
            }

            if (position && velocity) {

                position.x += velocity.x * this.timeStep;
                position.y += velocity.y * this.timeStep;
            }
        }
    }
}

export default PhysicsSystem;
