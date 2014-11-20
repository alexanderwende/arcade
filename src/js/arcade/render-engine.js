import Canvas from './utils/canvas';
import Shape from './shape';

class RenderEngine {

    constructor (options) {

        this.canvas = options.canvas;
        this.context = options.context;

        this.isEmpty = true;

        this.enableBuffering = options.enableBuffering || true;
        this.enableAntialias = options.enableAntialias || true;
        this.enableSmoothing = options.enableSmoothing || true;
        this.enableMotionBlur = options.enableMotionBlur || true;

        if (this.enableBuffering) {

            this.bufferCanvas = new Canvas(this.context.width, this.context.height);
        }

        if (this.enableMotionBlur) {

            this.motionBlur = options.motionBlur || 3;
            this.motionBlurAlpha = 1 - 1 / this.motionBlur;
            this.motionBlurCanvas = new Canvas(this.context.width, this.context.height);
        }
    }

    interpolatePosition (entity, adjust) {

        return {
            x: (entity.position.x - entity.previous.position.x) * adjust + entity.previous.position.x,
            y: (entity.position.y - entity.previous.position.y) * adjust + entity.previous.position.y
        };
    }

    render (scene, adjust) {

        var context = this.enableBuffering ? this.bufferCanvas.context : this.canvas.context;
        var width   = this.canvas.width;
        var height  = this.canvas.height;

        context.clearRect(0, 0, width, height);

        scene.layers.forEach(function (layer) {

            layer.entities.forEach(function (entity) {

                if (!entity.isHidden) {

                    let renderer = entity.getRenderer() || this.getRenderer(entity);

                    if (renderer) {

                        renderer.render(context, entity, adjust);
                    }
                }

            }.bind(this));

        }.bind(this));

        if (this.enableBuffering) {

            this.canvas.context.clearRect(0, 0, width, height);
            this.canvas.context.drawImage(this.bufferCanvas.element, 0, 0);
        }

        this.isEmpty = false;
    }

    render (context, entity, adjust) {

        // transform the global coordinate system
        // translate and rotate into entity position
        // interpolate correct position with adjust param (if smoothing enabled)
        // round positions to pixels (if antialias disabled)
        // check if entity has a custom renderer attached and call it
        // otherwise detect proper renderer
        // render children of entity?

        if (entity.isHidden) {

            return;
        }

        var renderer = entity.getRenderer() || this.getRenderer(entity);

        if (renderer) {

            renderer.render(context, entity, adjust);
        }
    }

    getRenderer (entity) {

        switch (entity.shape.type) {

            case Shape.TYPE.RECT:
                break;

            default:
                break;
        }
    }
}

export default RenderEngine;
