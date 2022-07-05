import { $game, $player } from "./script.js";
import { Weapon } from "./Weapon.js";
import { $display } from "./UIManager.js";

/* ================================================ **
|| ** CHARACTER **
** ================================================ */

class Character {
  constructor(maxHealth, firepower, accuracy, speed, name, isEnemy) {
    this.name = name;
    this.health = maxHealth;
    this.maxHealth = maxHealth;
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
    const newActor = document.createElement("div");
    newActor.setAttribute("data-actor-name", this.name);
    newActor.setAttribute("data-target-callback", (a) => console.log(a));
    newActor.addEventListener("click", () => this.select());
    newActor.classList.add("actor");
    const newActorInfo = document.createElement("div");
    newActorInfo.classList.add("info");
    newActor.appendChild(newActorInfo);
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
      target.hit(damage);
    } else {
      target.miss(this);
    }
    // $game.currLevel.objective.run().next(); // NOT WORKING
    this.turnToken.classList.remove("active");
    this.element.classList.remove("attacking");
    // calculate damage
  }

  hasShield() {
    return this.shield > 0;
  }

  destroy() {
    console.log(`${this.name} was destroyed`);
    this.isAlive = false;
    this.turnToken.classList.remove("active");
    // remove alien from the dom
    this.element.remove();
    // award player points
  }

  select() {
    // allowed selectable limit: ex: (2)
    const self = this.element;
    self.classList.toggle("selected");
  }

  hit(damage) {
    // PLAY HIT ANIM
    this.element.classList.remove("hit");
    this.element.querySelector(".info").setAttribute("data-input", damage);
    this.element.classList.add("hit");
    // this.element.onanimationend = () => this.element.classList.remove("hit");

    if (this.health - damage <= 0) {
      this.health -= this.health;
      this.destroy();
    } else {
      this.health -= damage;
      if (this.health <= this.maxHealth / 5) this.element.classList.add("weak");
    }
    $display.showCharInfo(this);
  }

  miss(attacker) {
    // PLAY MISS ANIM
    this.element.classList.remove("miss");
    this.element.querySelector(".info").setAttribute("data-input", "miss");
    this.element.classList.add("miss");
    // this.element.onanimationend = () => this.element.classList.remove("miss");
    console.log(`${attacker.name} missed!`);
  }
}

/* ================================================ **
|| ** HERO **
** ================================================ */

class Hero extends Character {
  // $player = new Hero(200, 60, 100, 8, "");
  constructor(maxHealth, speed, name) {
    super(maxHealth, 0, 0, speed, name, false);
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
  constructor(
    maxHealth,
    firepower,
    accuracy,
    speed,
    name,
    index = null,
    x = 0,
    y = 0,
    drops = []
  ) {
    super(maxHealth, firepower, accuracy, speed, `${name} ${index}`, true);
    this.index = index;
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
    newEnemy.addEventListener("click", () => $display.showCharInfo(this));
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

  updateEnemyDisplay() {
    const enemyInfo = document.getElementById("enemy-info");
    const enemyName = enemyInfo.querySelector(".info-box-name");
    const enemyHealthText = enemyInfo.querySelector(".info-box-health-text");
    const enemyHealthFill = enemyInfo.querySelector(
      ".info-box-health-bar-fill"
    );

    enemyInfo.classList.add("active");
    enemyName.innerText = this.name;
    enemyHealthText.innerText = `${this.health}/${this.maxHealth}`;
    enemyHealthFill.style.width = `${Math.round(
      (this.health / this.maxHealth) * 100
    )}%`;
  }
}

export { Character, Hero, Alien };
