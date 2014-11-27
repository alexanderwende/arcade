import Shape from '../components/shape';

class RenderSystem {

    constructor (options) {}

    update (entities, world) {

        var i, count, entity;

        for (i = 0, count = entities.length; i < length; i++) {

            entity = entities[i];

            if (entity.components.position && entity.components.shape) {


            }
        }
    }

    renderShape (position, shape) {

        switch (shape.type) {

            case Shape.TYPE.LINE:
                break;

            case Shape.TYPE.RECT:
                break;

            case Shape.TYPE.CIRCLE:
                break;

            case Shape.TYPE.TRIANGLE:
                break;
        }
    }
}

export default RenderSystem;
