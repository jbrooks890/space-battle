import { enemySide } from "./script.js";

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
    scope = "single",
    effect = "damage",
    graphic = "",
    disabled = false,
    reticle = ""
  ) {
    this.name = name;
    this.power = power;
    this.type = type; // eg projectile, beam, etc
    this.accuracy = accuracy;
    this.scope = scope; // single, row, all
    this.effect = effect;
    this.graphic = graphic;
    this.disabled = disabled;
    this.reticle = reticle;
    // this.aiming = false;
  }

  aim(targets) {
    console.log("aiming!");
    // this.aiming = true;
    enemySide.classList.add("aiming");
    let selected = [];
    targets.forEach((enemy) => {
      enemy.element.onclick = () => {
        enemySide.classList.remove("aiming");
        selected.push(enemy);
        console.log("aiming at", enemy.name);
        targets.forEach((enemy) => (enemy.element.onclick = ""));
        return selected;
      };
    });
  }
}
