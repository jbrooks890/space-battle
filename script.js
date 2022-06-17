class Space_Battle {
    constructor() {
        // score
        // runtime
        // turn order [hero, enemyA, enemyB, enemyC]
    }

    //start()

    //retreat?
}

// :::::::: CHARACTER ::::::::

class Character {
    constructor(hull, firepower, accuracy) {
        this.hull = hull;
        this.firepower = firepower;
        this.accuracy = accuracy;
    }

    attack() {
        console.log('attacking something!');
        // determine hit
        // calculate damage
    }
}

// :::::::: HERO ::::::::

class Hero extends Character {
    constructor(hull, firepower, accuracy, name) {
        super(hull, firepower, accuracy);
        this.name = name;
        this.weapons = ['Photon Gun'];
    }

    aim() {
        console.log('aiming at something!');
        // move cursor onto target
        // return target (enemy object)
    }

    attack() {
        // super / apply?
        // choose weapon
        // choose target via aim()
        // determine hit
        // calculate damage
    }

    retreat() {
        console.log('retreating!')
    }
}

// :::::::: ALIEN ::::::::

class Alien extends Character {
    constructor(hull, firepower, accuracy, x, y) {
        super(hull, firepower, accuracy);
        this.x = x;
        this.y = y;
        // maybe speed?
    }

    destroy() {
        console.log("This alien's ass is gras");
        // remove alien from the dom
        // award player points
    }
}

let test = new Hero(100, 100, 100, 'Julian');

console.log(test);
test.attack();

// :::::::: WEAPONS ::::::::

class Weapon {
    constructor(name, power, accuracy) {
        this.name = name;
        this.power = power;
        this.accuracy = accuracy;
    }
}