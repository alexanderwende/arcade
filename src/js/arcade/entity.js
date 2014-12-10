class Entity {

    constructor (options) {

        this.id = Entity.createUniqueId();

        this.components = {};
    }

    addComponent (component) {

        this.components[component.constructor.id] = component;

        return this;
    }

    getComponent (id) {

        return this.components[id];
    }

    removeComponent (component) {

        delete this.components[component.constructor.id];

        return this;
    }

    destroy () {}

    static createUniqueId () {

        return this._count++;
    }
}

Entity._count = 0;

export default Entity;
