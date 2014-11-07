import Command from './command';

class Input {

    constructor (options) {

        this._states            = {};

        this._commands          = options && options.commands || {};

        this._keyDownHandler    = this._onKeyDown.bind(this);
        this._keyUpHandler      = this._onKeyUp.bind(this);
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

    hasCommand (keyCode) {

        return this._commands[keyCode] instanceof Command;
    }

    assignCommand (keyCode, command) {

        this._commands[keyCode] = command;
    }

    handleInput () {

        var commands = [];

        for (let key in this._states) {
            if (this.isPressed(key) && this.hasCommand(key)) {
                commands.push(this._commands[key]);
            }
        }

        return commands;
    }

    start () {

        window.addEventListener('keydown', this._keyDownHandler, false);
        window.addEventListener('keyup', this._keyUpHandler, false);
    }

    stop () {

        window.removeEventListener('keydown', this._keyDownHandler, false);
        window.removeEventListener('keyup', this._keyUpHandler, false);
    }
}

Input.KEYS = {
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    SPACE: 32,
    ENTER: 13
};

export default Input;
