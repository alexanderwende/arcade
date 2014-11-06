import Game from './arcade/game';
import Scene from './arcade/scene';
import Entity from './arcade/entity';
import Renderer from './arcade/components/renderer';

class TestScene extends Scene {

    init () {

        this.addEntity(new Entity({
            position: {
                x: this.width / 2,
                y: this.height / 2
            },
            renderer: new Renderer({
                showOrientation: true
            })
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

        this.scene.render(this.context, adjust);
    }
};
