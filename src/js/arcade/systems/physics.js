class PhysicsSystem {

    constructor (options) {}



    update (entities, world) {

        var id = 0,
            count = entities.length;

        for (id; id < count; id++) {

            let entity = entities[id];

            if (entity.components.position) {}
        }
    }
}

export default PhysicsSystem;
