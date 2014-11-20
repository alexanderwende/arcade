import Shape from './shape';

class RenderEngine {

    constructor (options) {

        this.context = options.context;
        this.buffer = options.buffer;

        this.enableAntialias = options.enableAntialias || true;
        this.enableSmoothing = options.enableSmoothing || true;
        this.enableMotionBlur = options.enableMotionBlur || true;
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
