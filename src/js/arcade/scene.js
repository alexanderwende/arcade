class Scene {

    constructor (options) {

        this.game = options.game;

        this.width = options.width || options.game.width;
        this.height = options.height || options.game.height;

        this._backgrounds = [];

        this._foregrounds = [];

        this._entities = [];
    }

    init () {}

    addBackground (background) {

        this._backgrounds.push(background);
    }

    removeBackground (background) {

        var index = this._backgrounds.indexOf(background);

        if (index !== -1) {
            this._backgrounds.splice(index, 1);
        }
    }

    addForeground (foreground) {

        this._foregrounds.push(foreground);
    }

    removeForeground (foreground) {

        var index = this._foregrounds.indexOf(foreground);

        if (index !== -1) {
            this._foregrounds.splice(index, 1);
        }
    }

    addEntity (entity) {

        this._entities.push(entity);
    }

    removeEntity (entity) {

        var index = this._entities.indexOf(entity);

        if (index !== -1) {
            this._entities.splice(index, 1);
        }
    }

//    getCloseBodies (entity) {
//
//        return this._hash.retrieve(entity);
//    }

//    getCollidingBodies (entity) {
//
//        var bodies = [];
//
//        var targets = this._hash.retrieve(entity);
//
//        for (let target of targets) {
//            if (Utils.isColliding(entity, target)) {
//                bodies.push(target);
//            }
//        }
//    }

    update (step) {

        this._backgrounds.forEach(function (background) {
            background.update(step);
        }.bind(this));

        this._entities.forEach(function (entity) {
            entity.update(step);
        }.bind(this));

        this._foregrounds.forEach(function (foreground) {
            foreground.update(step);
        }.bind(this));
    }

    render (context, adjust) {

        this._backgrounds.forEach(function (background) {
            background.render(context, adjust);
        }.bind(this));

        this._entities.forEach(function (entity) {
            entity.render(context, adjust);
        }.bind(this));

        this._foregrounds.forEach(function (foreground) {
            foreground.render(context, adjust);
        }.bind(this));
    }
}

export default Scene;
