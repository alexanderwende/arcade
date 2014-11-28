class Shape {

    constructor (options) {

        this.type   = options.type !== undefined ? options.type : Shape.TYPE.RECT;

        switch (this.type) {

            case Shape.TYPE.RECT:
            case Shape.TYPE.TRIANGLE:
                this.width  = options.width !== undefined ? options.width : 0;
                this.height = options.height !== undefined ? options.height : 0;
                break;

            case Shape.TYPE.CIRCLE:
                this.radius = options.radius !== undefined ? options.radius : 0;
                break;
        }
    }
}

Shape.id = 'shape';

Shape.TYPE = {
    RECT: 1,
    CIRCLE: 2,
    TRIANGLE: 3
};

export default Shape;
