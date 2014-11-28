class InputSystem {

    constructor (options) {

        this._states            = {};

        this._keyDownHandler    = this._onKeyDown.bind(this);
        this._keyUpHandler      = this._onKeyUp.bind(this);

        this.start();
    }

    _onKeyDown (event) {

        event.preventDefault();

        this._states[event.keyCode] = true;
    }

    _onKeyUp (event) {

        event.preventDefault();

        this._states[event.keyCode] = false;
    }

    isPressed (keyCode) {

        return this._states[keyCode];
    }

    start () {

        window.addEventListener('keydown', this._keyDownHandler, false);
        window.addEventListener('keyup', this._keyUpHandler, false);
    }

    stop () {

        window.removeEventListener('keydown', this._keyDownHandler, false);
        window.removeEventListener('keyup', this._keyUpHandler, false);
    }

    update (entities, world) {

        var i, count;

        for (i = 0, count = entities.length; i < count; i++) {

            let entity = entities[i];
            let input = entity.components.input;

            if (input) {

                for (let key in input.keys) {

                    if (this.isPressed(key)) {

                        input.keys[key](entity, world);
                    }
                }
            }
        }
    }
}

InputSystem.KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13
};

export default InputSystem;
