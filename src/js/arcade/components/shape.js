class Shape {

    constructor (options) {

        this.width  = options.width !== undefined ? options.width : 0;
        this.height = options.height !== undefined ? options.height : 0;
        this.type   = options.type !== undefined ? options.type : Shape.TYPE.RECT;
    }
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
