import Game from './arcade/game';
import Scene from './arcade/scene';
import Entity from './arcade/entity';
import Physics from './arcade/components/physics';
import Renderer from './arcade/components/renderer';

import Input from './arcade/components/input';
import Command from './arcade/components/command';

class RotateLeftCommand extends Command {

    execute (entity) {

        entity.rotate(0.01);
    }
}

class RotateRightCommand extends Command {

    execute (entity) {

        entity.rotate(-0.01);
    }
}



class TestScene extends Scene {

    init () {

        this.input = new Input();

        this.input.assignCommand(Input.KEYS.LEFT, new RotateLeftCommand());
        this.input.assignCommand(Input.KEYS.RIGHT, new RotateRightCommand());

        this.addEntity(new Entity({
            position: {
                x: this.width / 2,
                y: this.height / 2
            },
            orientation: {
                x: 0,
                y: 1
            },
            physics: new Physics({
                enableGravity: true
            }),
            renderer: new Renderer({
                showOrientation: true
            }),
            input: this.input
        }));
    }
}

export default class TestGame extends Game {

    init () {

        super();

        this.scene = new TestScene({
            game: this
        });

        this.scene.init();

        this.context = this.canvas.context;
    }

    update (step) {

        this.scene.update(step);
    }

    render (adjust) {

        this.context.clearRect(0, 0, this.width, this.height);

        this.context.setTransform(1, 0, 0, -1, 0, this.height);

        this.scene.render(this.context, adjust);
    }

    start () {

        super();

        this.scene.input.start();
    }

    stop () {

        super();

        this.scene.input.stop();
    }
};
