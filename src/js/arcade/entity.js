import Vector from './vector';

class Entity {

    constructor (options) {

        this.position = new Vector({
            x: options.position && options.position.x || 0,
            y: options.position && options.position.y || 0
        });

        this.orientation = new Vector({
            x: options.orientation && options.orientation.x || 0,
            y: options.orientation && options.orientation.y || 1
        });

        this.orientation.normalize();

        this.velocity = new Vector({
            x: options.velocity && options.velocity.x || 0,
            y: options.velocity && options.velocity.y || 0
        });

        this.acceleration = new Vector({
            x: options.acceleration && options.acceleration.x || 0,
            y: options.acceleration && options.acceleration.y || 0
        });

        this.mass = options.mass || 1:

        this.previous = {};

        this.capturePrevious();
    }

    capturePrevious () {

        this.previous.position = this.position.clone();
        this.previous.direction = this.direction.clone();
        this.previous.velocity = this.velocity.clone();
        this.previous.acceleration = this.acceleration.clone();
    }

    get x () {

        return this.position.x;
    }

    get y () {

        return this.position.y;
    }

    set x (x) {

        this.position.x = x;
    }

    set y (y) {

        this.position.y = y;
    }

    rotate (angle) {

        this.orientation.rotate(angle);

        return this;
    }

    moveTo (x, y) {

        this.x = x;
        this.y = y;

        return this;
    }

    update (step) {

        this.capturePrevious();

        if (this._input) {

            this._input.handleInput().forEach(function (command) {
                command.execute(this);
            }.bind(this));
        }

        if (this._physics) {

            this._physics.update(this, step);
        }
    }

    render (adjust) {

        if (this._graphics) {

            this._graphics.render(this, adjust);
        }
    }

    destroy () {


    }
}

export default Entity;
