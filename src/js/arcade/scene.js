import Vector from './vector';
import SpatialHash from './utils//spatial-hash';
import * as Utils from './utils';

/**
 * @class Scene
 */
class Scene {

    constructor (options) {

        this.game = options.game;
        this.context = options.game.context;

        this.width = options.width || options.game.width;
        this.height = options.height || options.game.height;

        this.position = new Vector({
            x: options.position && options.position.x || 0,
            y: options.position && options.position.y || 0
        });

        this._backgrounds = [];

        this._foregrounds = [];

        this._bodies = [];

        this._hash = new SpatialHash({
            size: { x: options.game.width, y: options.game.height },
            grid: { x: options.grid.x, y: options.grid.y }
        });
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

    addBody (body) {

        this._bodies.push(body);
        this._hash.insert(body);
    }

    removeBody (body) {

        var index = this._bodies.indexOf(body);

        if (index !== -1) {
            this._bodies.splice(index, 1);
            this._hash.remove(body);
        }
    }

    getCloseBodies (body) {

        return this._hash.retrieve(body);
    }

    getCollidingBodies (body) {

        var bodies = [];

        var targets = this._hash.retrieve(body);

        for (let target of targets) {
            if (Utils.isColliding(body, target)) {
                bodies.push(target);
            }
        }
    }

    update (step) {

        this._backgrounds.forEach(function (background) {
            background.update(step);
        }.bind(this));

        this._bodies.forEach(function (body) {

            body.update(step);

            if (body.position.x !== body.previous.position.x || body.position.y !== body.previous.position.y) {
                // if the body has moved, we have to update the spatial hash
                this._hash.remove(body, this._hash.hashKey(body.previous));
                this._hash.insert(body);
            }

        }.bind(this));

        this._foregrounds.forEach(function (foreground) {
            foreground.update(step);
        }.bind(this));
    }

    render (adjust) {

        this._backgrounds.forEach(function (background) {
            background.render(adjust);
        }.bind(this));

        this._bodies.forEach(function (body) {
            body.render(adjust);
        }.bind(this));

        this._foregrounds.forEach(function (foreground) {
            foreground.render(adjust);
        }.bind(this));
    }
}

export default Scene;
