class Mass {

    /**
     * @constructor
     *
     * @param {number|object} mass      The mass or an object containing the mass
     */
    constructor (mass) {

        if (typeof mass === 'object') {
            this.mass = mass.mass !== undefined ? mass.mass : 1;
        }
        else {
            this.mass = mass !== undefined ? mass : 1;
        }



        this.inverseMass = this.mass === 0 ? 0 : (1 / this.mass);
    }
}

Mass.id = 'mass';

export default Mass;
