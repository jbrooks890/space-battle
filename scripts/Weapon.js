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
    }
}