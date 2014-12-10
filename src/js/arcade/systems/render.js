import Shape from '../components/shape';

const PI_DOUBLE = Math.PI * 2;
const PI_HALF = Math.PI / 2;
const PI = Math.PI;

class RenderSystem {

    constructor (options) {

        this.context = options.context;

        this.viewport = {
            width: this.context.canvas.width,
            height: this.context.canvas.height,
            x: 0,
            y: 0,
            scaleX: 20,
            scaleY: 20
        }

        this.isEmpty = true;

        this.enableBuffering = options.enableBuffering || true;
        this.enableAntialias = options.enableAntialias || true;
        this.enableSmoothing = options.enableSmoothing || true;
    }

    update (entities, world) {

        var i, count;

        this.context.clearRect(0, 0, this.viewport.width, this.viewport.height);

        this.context.globalAlpha = 1;
        this.context.fillStyle = '#000';
        this.context.strokeStyle = '#000';
        this.context.lineWidth = 1;

        for (i = 0, count = entities.length; i < count; i++) {

            let entity = entities[i];

            if (entity.components.position && entity.components.shape) {

                this.renderShape(this.context, entity.components.position, entity.components.shape);
            }
            else if (entity.components.position && entity.components.sprite) {}
        }
    }

    renderShape (context, position, shape) {

        context.save();

//        context.globalAlpha = entity.alpha || this.alpha;
//        context.fillStyle = entity.color || this.color;
//        context.strokeStyle = entity.color || this.color;
//        context.lineWidth = 1;

        //context.transform(cos, sin, -sin, cos, x, y);

        context.transform(1, 0, 0, 1, position.x * this.viewport.scaleX, position.y * this.viewport.scaleY);

        switch (shape.type) {

            case Shape.TYPE.RECT:

                let width = shape.width * this.viewport.scaleX;
                let height = shape.height * this.viewport.scaleY;

                context.fillRect(-width / 2, -height / 2, width, height);

                break;

            case Shape.TYPE.CIRCLE:

                let radius = shape.radius * this.viewport.scaleX;

                context.beginPath();

                context.arc(0, 0, radius, 0, PI_DOUBLE);

                context.fill();

                break;

            case Shape.TYPE.TRIANGLE:

                let x = shape.width * this.viewport.scaleX / 2;
                let y = shape.height * this.viewport.scaleY / 2;

                context.beginPath();

                context.moveTo(0, -y);
                context.lineTo(-x, y);
                context.lineTo(x, y);
                context.lineTo(0, -y);

                context.fill();

                break;
        }

        context.restore();
    }
}

export default RenderSystem;
