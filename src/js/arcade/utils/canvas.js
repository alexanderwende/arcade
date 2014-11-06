class Canvas {

    constructor (width, height) {

        this.width = width;
        this.height = height;

        this.element = document.createElement('canvas');
        this.element.width = width;
        this.element.height = height;

        this.context = this.element.getContext('2d');
    }
}

export default Canvas;
