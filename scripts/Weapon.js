class Weapon {
    /**
     * 
     * @param {string} name 
     * @param {number} power 
     * @param {string} type 
     * @param {number} accuracy 
     */
    constructor(name, power, type, accuracy) {
        this.name = name;
        this.power = power;
        this.type = type; // eg projectile, beam, etc
        this.accuracy = accuracy;
        this.scope;
    }

    aim() { // choose target(s) based on type
        console.log('aiming at something!');
        // move cursor onto target
        // return target (enemy object)
    }
}