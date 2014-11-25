class Component {

    /**
     * Plug a component into a target object by replacing or adding methods on the target object
     * from the component's adapters list. A previously plugged method will be lost.
     */
    static plug (target) {

        for (let adapter in this.adapters) {

            // if a property has been plugged already, we try retrieving the originally plugged
            // version of the property, not the current one
            let plugged = (target[adapter] && target[adapter]._plugged) || target[adapter];

            target[adapter] = this.adapters[adapter](target);

            target[adapter]._plugged = plugged;
        }
    }

    /**
     * Unplug a component from a target object by restoring the original properties on the target object.
     */
    static unplug (target) {

        for (let adapter in this.adapters) {

            let plugged = (target[adapter] && target[adapter]._plugged) || target[adapter];

            target[adapter] = plugged;
        }
    }
}

Component.adapters = {};

export default Component;
