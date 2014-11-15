class Simulation {

    constructor (options) {

        this.game = options && options.game;

        this._entities = [];
    }

    addEntity (entity) {

        this._entities.push(entity);
    }

    removeEntity (entity) {

        var index = this._entities.indexOf(entity);

        if (index > -1) {
            this._entities.splice(index, 1);
        }
    }

    update (step) {

        this._entities.forEach(function (entity) {
            entity.update(step);
        }.bind(this));

        this.detectCollisions();
    }

    detectCollisions (entities) {

        var collisions = [];

        // TODO: detect collisions! either of passed in entities, or of all

        this.resolveCollisions(collisions);
    }

    resolveCollisions (collisions) {

        collisions.forEach(function (collision) {
            // TODO: update collided entities with collision data, apply forces, update position
            // TODO: for updated entities check for collision again and resolve them
        });
    }
}

export default Simulation;
