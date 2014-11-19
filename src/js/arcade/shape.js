class Shape {

    constructor (options) {

        this.type = options.type;
        this.entity = options.entity;
    }

    getBoundingBox () {}

    getBoundingSphere () {}
}

Shape.TYPE = {

    NONE: 0,
    LINE: 1,
    RECT: 2,
    CIRCLE: 3,
    TRIANGLE: 4,
    PATH: 5
};

export default Shape;
