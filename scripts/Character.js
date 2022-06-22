import {$game, $player} from './script.js'

class Character {
    constructor(hull, firepower, accuracy, speed, name) {
        this.hull = hull;
        this.firepower = firepower;
        this.accuracy = accuracy;
        this.speed = speed;
        this.name = name;
        this.isAlive = true;
        this.shield = 0;
        this.element = this.create();
    }

    create() {
        let newActor = document.createElement('div');
        return newActor;
    }

    attack(target) {
        console.log(`${this.name} attacks ${target.name}!`);
        const min = 10;
        let roll = Math.ceil(Math.random() * this.accuracy);
        // let damage = Math.ceil(Math.random() * this.firepower);
        let damage = Math.floor(Math.random() * min) + this.firepower - min;
        // if accuracy roll is greater than 3/4 of itself, hit!
        console.log({ roll }, { damage });
        // determine hit
        if (roll >= Math.round(this.accuracy / 2)) {
            if (target.hull - damage <= 0) {
                target.hull -= target.hull;
                target.destroy();
            } else {
                target.hull -= damage;
            }
        } else {
            console.log(`${this.name} missed!`)
        }

        // calculate damage
    }

    hasShield() {
        return this.shield > 0;
    }

    destroy() {
        console.log(`${this.name} was destroyed`);
        this.isAlive = false;
        // remove alien from the dom
        this.element.remove();
        // award player points
    }
}

// :::::::: HERO ::::::::

class Hero extends Character {
    constructor(hull, firepower, accuracy, speed, name) {
        super(hull, firepower, accuracy, speed, name);
        this.actions = [];
        this.specialWeapons = [];
    }

    create() {
        let newHero = super.create();
        newHero.id = 'heroActor';
        newHero.setAttribute('data-player-name', this.name);
        return newHero;
    }

    chooseAction() {
        // player chooses to: attack, repair, retreat
    }

    // attack() {
    // super / apply?
    // choose weapon (if extra weapons available)
    // choose target via aim()
    // determine hit
    // calculate damage
    // }

    aim() {
        console.log('aiming at something!');
        // move cursor onto target
        // return target (enemy object)
    }

    retreat() {
        console.log('retreating!')
    }
}

// :::::::: ALIEN ::::::::

class Alien extends Character {
    /**
     * 
     * @param {integer} hull 
     * @param {integer} firepower 
     * @param {integer} accuracy 
     * @param {string} name 
     * @param {integer} index 
     * @param {integer} x 
     * @param {integer} y 
     * @param {Array of Objects} drops 
     */
    constructor(hull, firepower, accuracy, speed, name, index = null, x = 0, y = 0, drops = []) {
        super(hull, firepower, accuracy, speed, `${name} ${index}`);
        this.x = x;
        this.y = y;
        this.drops = drops; // dropped item
        // maybe speed?
    }

    create() {
        let newEnemy = super.create();
        newEnemy.id = this.name.toLowerCase().trim().replace(' ', '-');
        newEnemy.classList.add('enemyActor');
        newEnemy.setAttribute('data-enemy-name', this.name);
        return newEnemy;
    }

    destroy() {
        super.destroy();
        // process drops
        if (this.drops.length > 0) {
            this.drops.forEach(drop => {
                console.log(drop);
                // switch (drop) {
                //     case energy:
                //         console.log(`Player received ${drop.energy} energy!`);
                //         break;
                // }
            })
        }
    }

}

export { Character, Hero, Alien }
