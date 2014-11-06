class Renderer {

    constructor (options) {

        this.color = options.color || '#0f0';

        this.alpha = options.alpha !== undefined ? options.alpha : 1;

        this.showOrientation = options.showOrientation !== undefined ? options.showOrientation : false;

        this.enableSmoothing = options.enableSmoothing !== undefined ? options.enableSmoothing : true;
    }

    interpolatePosition (entity, adjust) {

        return {
            x: (entity.position.x - entity.previous.position.x) * adjust + entity.previous.position.x,
            y: (entity.position.y - entity.previous.position.y) * adjust + entity.previous.position.y
        };
    }

    render (context, entity, adjust) {

        var renderPosition = this.enableSmoothing ? this.interpolatePosition(entity, adjust) : entity.position;

        context.save();

        context.translate(position.x, position.y);
        context.rotate(entity.orientation.angle());

        context.globalAlpha = entity.alpha !== undefined ? entity.alpha : this.alpha;

        context.fillStyle = entity.color || this.color;

        context.fillRect(-2, -2, 5, 5);

        context.restore();
    }
}

export default Renderer;
