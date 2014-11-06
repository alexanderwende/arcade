class Canvas {

    constructor (width, height) {

        this.width = width;
        this.height = height;

        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;

        this.context = this.canvas.getContext('2d');
    }
}

export default Canvas;
