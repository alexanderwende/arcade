class Material {

    constructor (options) {

        this.color = options.color || '#000';
        this.alpha = options.alpha || 1;
        this.density = options.density;
        this.restitution = options.restitution;
    }
}

export default Material;
