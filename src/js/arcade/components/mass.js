class Mass {

    constructor (options) {

        this.mass = options.mass !== undefined ? options.mass : 1;

        this.inverseMass = this.mass === 0 ? 0 : (1 / this.mass);
    }
}

Mass.id = 'mass';

export default Mass;
