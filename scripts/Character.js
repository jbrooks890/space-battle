import { $game, $player } from "./script.js";
import { Weapon } from "./Weapon.js";

/* ================================================ **
|| ** CHARACTER **
** ================================================ */

class Character {
  constructor(hull, firepower, accuracy, speed, name, isEnemy) {
    this.name = name;
    this.hull = hull;
    this.firepower = firepower;
    this.accuracy = accuracy;
    this.speed = speed;
    this.isEnemy = isEnemy;
    this.isAlive = true;
    this.energy = 0;
    this.shield = 0;
    this.element = this.create();
  }

  create() {
    let newActor = document.createElement("div");
    newActor.setAttribute("data-actor-name", this.name);
    newActor.setAttribute("data-target-callback", (a) => console.log(a));
    newActor.addEventListener("click", () => this.select());
    newActor.classList.add("actor");
    return newActor;
  }

  attack(target) {
    console.log(`${this.name} attacks ${target.name}!`);
    this.element.classList.add("attacking");
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
      console.log(`${this.name} missed!`);
    }
    // $game.currLevel.objective.run().next(); // NOT WORKING
    this.element.classList.remove("attacking");
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

  select() {
    // allowed selectable limit: ex: (2)
    const self = this.element;

    self.classList.toggle("selected");
  }
}

/* ================================================ **
|| ** HERO **
** ================================================ */

class Hero extends Character {
  // $player = new Hero(200, 60, 100, 8, "");
  constructor(hull, speed, name) {
    super(hull, 0, 0, speed, name, false);
    this.actions = [];
    this.inventory = [];
    this.arsenal = [new Weapon()];
    this.weapon = this.arsenal[0];
    this.firepower = this.weapon.power;
    this.accuracy = this.weapon.accuracy;
  }

  create() {
    let newHero = super.create();
    newHero.id = "heroActor";
    newHero.setAttribute("data-player-name", this.name);
    return newHero;
  }

  chooseAction() {
    // player chooses to: attack, repair, retreat
  }

  attack(targets) {
    // let target = this.aim();
    // console.log(this.weapon);
    targets.forEach((target) => {
      super.attack(target);
    });
    $game.currLevel.wave.fight.next();
    // super / apply?
    // choose weapon (if extra weapons available)
    // choose target via aim()
    // determine hit
    // calculate damage
  }

  chooseWeapon() {}

  prepareToFire() {
    if (this.arsenal.length < 1) {
      this.chooseWeapon;
    } else {
      this.weapon.arm();
    }
    // setup selection window
    // return selected weapon index
  }

  retreat() {
    console.log("retreating!");
  }
}

/* ================================================ **
|| ** ALIEN **
** ================================================ */

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
  constructor(
    hull,
    firepower,
    accuracy,
    speed,
    name,
    index = null,
    x = 0,
    y = 0,
    drops = []
  ) {
    super(hull, firepower, accuracy, speed, `${name} ${index}`, true);
    this.x = x;
    this.y = y;
    this.drops = drops; // dropped item
    // maybe speed?
  }

  create() {
    let newEnemy = super.create();
    newEnemy.id = this.name.toLowerCase().trim().replace(" ", "-");
    newEnemy.classList.add("enemyActor");
    newEnemy.setAttribute("data-enemy-name", this.name);
    return newEnemy;
  }

  destroy() {
    super.destroy();
    // process drops
    if (this.drops.length > 0) {
      this.drops.forEach((drop) => {
        console.log(drop);
        // switch (drop) {
        //     case energy:
        //         console.log(`Player received ${drop.energy} energy!`);
        //         break;
        // }
      });
    }
  }
}

export { Character, Hero, Alien };
