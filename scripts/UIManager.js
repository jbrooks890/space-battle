/* ================================================ **
|| ** UI MANAGER **
** ================================================ */

class UIManager {
  showCharInfo(char) {
    const { isEnemy } = char;
    const target = isEnemy ? "enemy" : "hero";
    const info = document.getElementById(`${target}-info`);
    const name = info.querySelector(".info-box-name");
    const healthText = info.querySelector(".info-box-health-text");
    const healthFill = info.querySelector(".info-box-health-bar-fill");

    info.classList.add("active");
    name.innerText = char.name;
    healthText.innerText = `${char.health}/${char.maxHealth}`;
    healthFill.style.width = `${Math.round(
      (char.health / char.maxHealth) * 100
    )}%`;
  }

  updateCharInfo(char) {
    // animate info changes
  }

  changeHealth(char, change) {}
}

/* ================================================ **
|| ** BATTLE UI MANAGER **
|| ------------------------------------------------
|| For handling battler positioning n such...
** ================================================ */

class BattleUIManager {
  constructor() {
    this.field = document.getElementById("#game-board");
    this.fieldWidth = this.field.clientWidth;
    this.fieldHeight = this.field.clientHeight;
    this.fieldVcenter = this.fieldHeight / 2;
    this.fieldHcenter = this.fieldWidth / 2;
    this.center = [this.fieldHcenter, this.fieldVcenter]; // (x,y)
  }

  setFormation(battlers, formation) {
    this.formationWidth;
    this.formationHeight;
    let battlerWidths = battlers.map((battler) => battler.element.clientWidth);
    let battlerHeights = battlers.map(
      (battler) => battler.element.clientHeight
    );

    switch (formation) {
      // TRIANGLE ===========================================
      case "tri":
        let triWidth = 0;
        let triHeight = 0;
        for (let x = 0; x < battlers.length; x++) {
          let colHeight = 0;
          let colWidth = 0;
          for (let y = 0; y < x + 1; y++) {
            colHeight += battlerHeights[x];
            if (battlerWidths[x] > colWidth) colWidth = battlerWidths[x];
          }
          triWidth += colWidth;
          if (colHeight > triHeight) triHeight = colHeight;
        }
        this.formationWidth = triWidth;
        this.formationHeight = triHeight;
        break;
      // ROW ===========================================
      case "row":
        this.formationWidth = battlerWidths.reduce((a, b) => a + b);
        this.formationHeight = Math.max(...battlerHeights);

        formHCenter = Math.round(this.formationWidth / 2);
        formVCenter = Math.round(this.formationHeight / 2);

        leftStart = this.fieldHcenter - this.formationWidth;
        battlers.forEach((battler) => {
          battler.style.left = leftStart;
          battler.style.top = this.fieldVcenter - battler.clientHeight / 2;
          leftStart += battler.clientWidth;
        });

        break;
      // COLUMN ===========================================
      case "col":
        this.formationWidth = Math.max(...battlerWidths);
        this.formationHeight = battlerHeights.reduce((a, b) => a + b);
        break;
      // DIAMOND (TODO) ===========================================
      case "diamond":
        // FIND MIDDLE OF THE FORMATION
        // PARABOLIC FORMULA?
        // let midPoint = Math.ceil(battlers.length / 2);
        // for (let x = 0; x < battlers.length; x++){
        //   for (let y = 0; y < x + 1; y++){

        //   }
        // }
        break;
    }
  }

  centerFormation(formW, formH) {}

  setPos(battler) {}

  getBattlerCoord(battler) {}

  moveTo(battler, destination) {}

  alignWith(battler, target) {}

  isBehind(battler, ally) {}

  isAbove(battler, ally) {}
}

const $display = new UIManager();

export { $display };
