const AIR_DENSITY = 1.2992;

const DRAG_COEFFICIENTS = {
    SPHERE: 0.47,
    CUBE: 1.05,
    CONE: 0.5,
    CYLINDER: 0.82,
    STREAMLINED: 0.04
};

const GRAVITY = 9.81;

class Physics {

    constructor (options) {}

    getDragForce (velocity, area, shape, density) {

        var velocity = velocity,
            density = density || AIR_DENSITY,
            area = area,
            drag = shape ? DRAG_COEFFICIENTS[shape] : DRAG_COEFFICIENTS.CUBE;

        return 0.5 * density * Math.pow(velocity, 2) * drag * area;
    }

    update (entity, step) {

        entity.position.x += entity.direction.x * (entity.velocity / 1000) * step;
        entity.position.y += entity.direction.y * (entity.velocity / 1000) * step;

        entity.velocity += (entity.acceleration / 1000) * step;

        if (entity.velocity < 0) {
            entity.velocity = 0;
        }
    }
}

export default Physics;
