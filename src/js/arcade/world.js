class World {

    constructor (options) {

        this._systems = [];
        this._entities = [];
        this._collidables = [];
    }

    addSystem (system) {

        this._systems.push(system);
    }

    removeSystem (system) {

        let index = this._systems.indexOf(system);

        if (index > -1) {

            this._systems.splice(index, 1);
        }
    }

    addEntity (entity) {

        this._entities[entity.id] = entity;

        if (entity.components.collision) {
            this._collidables.push(entity);
        }
    }

    removeEntity (entity) {

        this._entities.splice(entity.id, 1);

        if (entity.components.collision) {
            this._collidables.splice(this._collidables.indexOf(entity), 1);
        }
    }

    getCollisionCandidates (entity) {

        return this._collidables.filter(function (collidable) {
            return collidable !== entity;
        });
    }

    update () {

        this._systems.forEach(function (system) {

            system.update(this._entities, this);

        }.bind(this));
    }
}

export default World;
