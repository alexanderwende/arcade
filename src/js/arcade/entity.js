import Vector from './vector';
import Shape from './shape';
import Material from './material';

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

        this.force = new Vector({ x: 0, y: 0 });

        this.mass = options.mass || 1;
        this.shape = options.shape;
        this.material = options.material;

        this._input = options.input;

        if (options.physics) {
            options.physics.plug(this);
        }

        if (options.renderer) {
            options.renderer.plug(this);
        }

        this.isHidden = options.isHidden || false;

        this.previous = {};

        this.capturePrevious();
    }

    capturePrevious () {

        this.previous.position = this.position.clone();
        this.previous.orientation = this.orientation.clone();
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

    translate (x, y) {

        this.x += x;
        this.y += y;

        return this;
    }

    update (step) {

        this.capturePrevious();

        if (this._input) {

            this._input.handleInput().forEach(function (command) {
                command.execute(this);
            }.bind(this));
        }
    }

    render (context, adjust) {}

    plug (component) {

        component.plug(this);
    }

    unplug (component) {

        component.unplug(this);
    }

    destroy () {


    }
}

export default Entity;
