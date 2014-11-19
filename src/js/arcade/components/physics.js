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

    constructor (options) {

        this.gravity = options.gravity !== undefined ? options.gravity : GRAVITY;

        this.enableGravity = options.enableGravity !== undefined ? options.enableGravity : false;
    }

//    integrateVerlet (x, v, a, dt) {
//
//        a = {x, y}
//
//        f = m * a;
//
//        a = f / m;
//
//        v = s / t;
//
//        a = dv / dt = (ds / dt) / dt = ds / dt^2;
//    }

//    getDragForce (velocity, area, shape, density) {
//
//        var velocity = velocity,
//            density = density || AIR_DENSITY,
//            area = area,
//            drag = shape ? DRAG_COEFFICIENTS[shape] : DRAG_COEFFICIENTS.CUBE;
//
//        return 0.5 * density * Math.pow(velocity, 2) * drag * area;
//    }

//    applyForce (entity, force, step) {
//
//        var acceleration = force.scale(1 / entity.mass);
//
//        //
//
//        entity.velocity.scale(acceleration.x * step / 1000, acceleration.y * step / 1000);
//    }

//    applyImpulse (entity, impulse, step) {}

    update (entity, step) {

        entity.position.x += (entity.velocity.x / 1000) * step;
        entity.position.y += (entity.velocity.y / 1000) * step;

        entity.velocity.x += (entity.acceleration.x / 1000) * step;
        entity.velocity.y += (entity.acceleration.y / 1000) * step;
    }
}

export default Physics;
