class World {

    constructor (options) {

        this._systems = [];
        this._entities = [];
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

    createEntity () {

        let id = this._entities.length;

        return id;
    }

    update () {

        this._systems.forEach(function (system) {

            system.update(this._entities, this);

        }.bind(this));
    }
}

export default World;
