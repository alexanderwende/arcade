class Material {

    constructor (options) {

        this.restitution = options.restitution;
        this.density = options.density;
        this.type = options.type;
    }

    getStaticFriction (material) {

        return this.constructor.FRICTION[this.type][material.type].STATIC;
    }

    getKineticFriction (material) {

        return this.constructor.FRICTION[this.type][material.type].KINETIC;
    }

    static getStaticFriction (a, b) {

        return this.FRICTION[a.type][b.type].STATIC;
    }

    static getKineticFriction (a, b) {

        return this.FRICTION[a.type][b.type].KINETIC;
    }
}

Material.id = 'material';

Material.TYPE = {
    STEEL: 'STEEL',
    WOOD: 'WOOD',
    RUBBER: 'RUBBER',
    GLASS: 'GLASS',
    CONCRETE: 'CONCRETE'
};

Material.FRICTION = {
    STEEL: {
        STEEL: {
            STATIC: 0.78,
            KINETIC: 0.42
        }
    },
    WOOD: {
        WOOD: {
            STATIC: 0.5,
            KINETIC: 0.2
        },
        CONCRETE: {
            STATIC: 0.62
        }
    },
    RUBBER: {
        CONCRETE: {
            STATIC: 1.0,
            KINETIC: 0.8
        }
    },
    GLASS: {
        GLASS: {
            STATIC: 0.94,
            KINETIC: 0.4
        }
    }
}

export default Material;
