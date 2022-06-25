import { enemySide } from "./script.js";
import { $game, $player } from "./script.js";

export class Weapon {
  /**
   *
   * @param {string} name name of weapon
   * @param {number} power weapon's power
   * @param {string} type visual: projectile, beam
   * @param {number} accuracy weapon's accuracy
   * @param {string} scope
   * @param {string} effect
   * @param {string} graphic
   * @param {boolean} disabled weapon can be used or not
   * @param {image file path} reticle visual: aiming graphic
   */
  constructor(
    name = "Photon Blaster",
    power = 60,
    type = "projectile",
    accuracy = 100,
    scopeNum = 1,
    scopeTarget = "enemy",
    effect = "damage",
    graphic = "",
    disabled = false,
    reticle = ""
  ) {
    this.name = name;
    this.power = power;
    this.type = type; // eg projectile, beam, etc
    this.accuracy = accuracy;
    this.scopeNum = scopeNum; // single, row, all
    this.scopeTarget = scopeTarget;
    this.effect = effect;
    this.graphic = graphic;
    this.disabled = disabled;
    this.reticle = reticle;
    // this.aiming = false;
    this.targets = [];
  }

  /* --------------------------------------------- **
  || ARM
  || when a weapon is clicked, attach aim callback to all valid target html elements
  ** --------------------------------------------- */

  arm() {
    let selection;
    let multiple = false;
    switch (this.scopeTarget) {
      case "enemy":
        selection = $game.remaining();
        multiple = true;
        break;
      case "self":
        selection = $player;
        break;
      case "any":
        selection = document.querySelectorAll(".actor");
        multiple = true;
        break;
      case "all":
        //just attack everyone
        break;
    }

    if (multiple) {
      selection.forEach((target) => {
        target.element.onclick = () => {
          this.aim(target);
        };
      });
    } else {
      selection.element.onclick = () => {
        this.aim(target);
      };
    }
  }

  /* --------------------------------------------- **
  || AIM
  ** --------------------------------------------- */
  aim(target) {
    // this.aim.bind($player.weapon);
    // console.log("aim, this =", this);
    // console.log(target);
    // console.log("aiming!");

    // if recorded targets already contains target, remove that target
    if (this.targets.includes(target)) {
      // console.log(`%cRemove: ${target.name}`, "color: cyan");
      this.targets.splice(this.targets.indexOf(target), 1);
    } else {
      // if target is valid, add it to list of targets
      if (this.validTarget(target, this.scopeTarget)) {
        // if new target is going to create too many targets
        if (this.targets.length + 1 > this.scopeNum) {
          // console.log("Too many!");
          let deselected = this.targets.shift();
          deselected.element.classList.remove("selected");
          // console.log(
          //   `%ccurrent targets: ${this.targets
          //     .map((target) => target.name)
          //     .join(", ")}`,
          //   "color: magenta"
          // );
        }
        // console.log(`%cNew target: ${target.name}`, "color: lime");
        this.targets.push(target);
        // console.log(`%ctotal targets: ${this.targets.length}`, "color: orange");
      }
    }

    // if less than or equal targets are selected, proceed to attack <== wait for confirmation?
    if (this.targets.length > 0 && this.targets.length <= this.scopeNum) {
      console.log(
        `%cPreparing to attack ${this.targets
          .map((target) => target.name)
          .join(", ")}!`,
        "color: lime"
      );
      // clear target selection
      // gone head and attack
    }

    // this.aiming = true;
    // enemySide.classList.add("aiming");
  }

  /* --------------------------------------------- **
  || VALID TARGET
  ** --------------------------------------------- */
  validTarget(target, scope) {
    switch (scope) {
      case "enemy":
        return target.isEnemy;
        break;
      case "self":
        return !target.isEnemy;
        break;
    }
  }

  /* --------------------------------------------- **
  || CONFIRM TARGET
  ** --------------------------------------------- */
  confirmTarget() {}
}
