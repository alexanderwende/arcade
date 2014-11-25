//class Renderer {
//
//    constructor (options) {
//
//        this.color = options.color || '#0f0';
//
//        this.alpha = options.alpha !== undefined ? options.alpha : 1;
//
//        this.showOrientation = options.showOrientation !== undefined ? options.showOrientation : false;
//
//        this.enableSmoothing = options.enableSmoothing !== undefined ? options.enableSmoothing : true;
//    }
//
//    interpolatePosition (entity, adjust) {
//
//        return {
//            x: (entity.position.x - entity.previous.position.x) * adjust + entity.previous.position.x,
//            y: (entity.position.y - entity.previous.position.y) * adjust + entity.previous.position.y
//        };
//    }
//
//    render (context, entity, adjust) {
//
//        var renderPosition = this.enableSmoothing ? this.interpolatePosition(entity, adjust) : entity.position;
//
//        context.save();
//
//        context.translate(renderPosition.x, renderPosition.y);
//        context.rotate(entity.orientation.orientation());
//
//        context.globalAlpha = entity.alpha !== undefined ? entity.alpha : this.alpha;
//
//        context.fillStyle = entity.color || this.color;
//
//        context.fillRect(-2, -2, 5, 5);
//
//        if (this.showOrientation) {
//
//            context.strokeStyle = this.color;
//            context.lineWidth = 1;
//
//            context.beginPath();
//            context.moveTo(0, 0);
//            context.lineTo(0, 10);
//
//            context.stroke();
//        }
//
//        context.restore();
//    }
//}

import Component from './component';

class RenderComponent extends Component {

    static interpolate (previous, current, adjust) {

        return previous + (current - previous) * adjust;
    }

    static render (entity, context, adjust) {

        let x = this.interpolate(entity.previous.position.x, entity.position.x, adjust);
        let y = this.interpolate(entity.previous.position.y, entity.position.y, adjust);
        let a = this.interpolate(entity.previous.orientation.orientation(), entity.orientation.orientation(), adjust);
        let sin = Math.sin(a);
        let cos = Math.cos(a);

        context.save();

        context.globalAlpha = entity.alpha || this.alpha;
        context.fillStyle = entity.color || this.color;
        context.strokeStyle = entity.color || this.color;
        context.lineWidth = 1;

        context.transform(cos, sin, -sin, cos, x, y);

        context.fillRect(-2, -2, 5, 5);

        context.beginPath();
        context.moveTo(0, 0);
        context.lineTo(0, 10);
        context.stroke();

        context.restore();
    }
}

RenderComponent.alpha = 1;
RenderComponent.color = '#0a0';

RenderComponent.adapters = {

    render: function (target) {
        return function (context, adjust) {
            RenderComponent.render(target, context, adjust);
        }
    }
};

export default RenderComponent;
