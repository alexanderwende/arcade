import Shape from '../components/shape';

const PI_DOUBLE = Math.PI * 2;
const PI_HALF = Math.PI / 2;
const PI = Math.PI;

class RenderSystem {

    constructor (options) {

        this.context = options.context;

        this.isEmpty = true;

        this.enableBuffering = options.enableBuffering || true;
        this.enableAntialias = options.enableAntialias || true;
        this.enableSmoothing = options.enableSmoothing || true;
    }

    update (entities, world) {

        var i, count;

        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);

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

        context.transform(1, 0, 0, 1, position.x, position.y);

        switch (shape.type) {

//            case Shape.TYPE.LINE:
//                context.beginPath();
//                context.moveTo(0, 0);
//                context.lineTo(0, 10);
//                context.stroke();
//                break;

            case Shape.TYPE.RECT:

                context.fillRect(-shape.width / 2, -shape.height / 2, shape.width, shape.height);

                break;

            case Shape.TYPE.CIRCLE:

                context.beginPath();

                context.arc(0, 0, shape.radius, 0, PI_DOUBLE);

                context.fill();

                break;

            case Shape.TYPE.TRIANGLE:

                let x = shape.width / 2;
                let y = shape.height / 2;

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
