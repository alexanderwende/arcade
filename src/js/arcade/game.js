import Canvas from './utils/canvas';

class Game {

    constructor (options) {

        this.element = options.element;

        this.width = options.width || this.element.clientWidth;
        this.height = options.height || this.element.clientHeight;

        this.canvas = new Canvas(this.width, this.height);

        this.state = Game.STATE.INITIAL;

        this.requestId = 0;

        this.time = 0;
        this.delta = 0;
        this.accumulator = 0;
        this.step = options.step || (1000 / 60);

        this.enableSmoothing = options.enableSmoothing !== undefined ? options.enableSmoothing : true;

        this._debug = {
            fidelity: 0.1,
            upf: 0,
            fps: 0,
            updateTime: 0,
            renderTime: 0,
            frameTime: 0
        };
    }

    init () {

        // initialize the game, create scenes, objects, whatever
    }

    loop (time) {

        this.delta  = time - this.time;
        this.time   = time;

        this._debug.upf = 0;

        this.accumulator += this.delta;

        while (this.accumulator >= this.step) {

            this.update(this.step);
            this.accumulator -= this.step;
            this._debug.upf++;
        }

        this._debug.updateTime = window.performance.now() - time;

        this.render(this.enableSmoothing ? (this.accumulator / this.step) : 0);

        this._debug.renderTime = window.performance.now() - time - this._debug.updateTime;

        this._debug.frameTime = window.performance.now() - time;

        this.requestId = window.requestAnimationFrame(this.loop.bind(this));
    }

    update (step) {

        // update the game logic
    }

    render (adjust) {

        // render the game
    }

    renderDebug (adjust) {

        var time = Math.round(this.time / 1000);
        var fps = Math.round(10000 / this.delta) / 10;

        this._debug.fps = Math.round((this._debug.fps * (1 - this._debug.fidelity) + fps * this._debug.fidelity) * 10) / 10;

        this.context.save();

        this.context.font       = '10px Arial';
        this.context.textAlign  = 'left';
        this.context.fillStyle  = '#aaa';

        this.context.fillText('time: ' + time + ' s', 5, 15);
        this.context.fillText('delta: ' + this.delta + ' ms', 5, 25);
        this.context.fillText('fps: ' + this._debug.fps, 5, 35);
        this.context.fillText('upf: ' + this._debug.upf, 5, 45);
        this.context.fillText('adjust: ' + adjust, 5, 55);
        this.context.fillText('updateTime: ' + this._debug.updateTime + ' ms', 5, 65);
        this.context.fillText('renderTime: ' + this._debug.renderTime + ' ms', 5, 75);
        this.context.fillText('frameTime: ' + this._debug.frameTime + ' ms', 5, 85);
        this.context.fillText('smoothing: ' + this.enableSmoothing, 5, 95);

        this.context.restore();
    }

    start () {

        if (this.state === Game.STATE.STARTED) {
            return;
        }

        if (this.state !== Game.STATE.PAUSED) {
            this.init();
        }

        this.time = window.performance.now();
        this.delta = 0;
        this.accumulator = 0;

        this.state = Game.STATE.STARTED;

        this.requestId = window.requestAnimationFrame(this.loop.bind(this));
    }

    pause () {

        window.cancelAnimationFrame(this.requestId);

        this.state = Game.STATE.PAUSED;
    }

    stop () {

        window.cancelAnimationFrame(this.requestId);

        this.state = Game.STATE.STOPPED;
    }
}

Game.STATE = {
    INITIAL: 'INITIAL',
    STARTED: 'STARTED',
    PAUSED: 'PAUSED',
    STOPPED: 'STOPPED'
};

export default Game;
