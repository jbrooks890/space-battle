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
    this.field = document.getElementById("enemySide");
    this.fieldWidth = this.field.clientWidth;
    this.fieldHeight = this.field.clientHeight;
    this.fieldVcenter = this.fieldHeight / 2;
    this.fieldHcenter = this.fieldWidth / 2;
    this.center = [this.fieldHcenter, this.fieldVcenter]; // (x,y)
  }

  setFormation(battlers, formation) {
    // this.formationWidth;
    // this.formationHeight;
    let battlerWidths = battlers.map((battler) => battler.element.clientWidth);
    let battlerHeights = battlers.map(
      (battler) => battler.element.clientHeight
    );

    // let formationWidth = 0;
    // let formationHeight = 0;
    // let formHCenter;
    // let formVCenter;
    // let leftStart;

    switch (formation) {
      // TRIANGLE ===========================================
      case "tri":
        // TRIANGULAR NUMBER FORMULA: (N^2 + N)/2 = N(N + 1)/2
        // ↳ SOLVE FOR N: N = √(2Y + .25) - .5
        let formation = [];

        let count = 0;

        // GET FORMATION WIDTH & HEIGHT (FOR CENTERING)
        while (count < battlers.length) {
          let col = Math.ceil(Math.sqrt(2 * (count + 1) + 0.25) - 0.5) - 1;

          if (!formation[col]) formation[col] = [];
          formation[col].push(battlers[count]);
          count++;
        }

        let formElements = formation.map((sets) =>
          sets.map((battler) => battler.element)
        );

        let colWidths = formElements.map((set) =>
          Math.max(...set.map((element) => element.clientWidth))
        );

        let colHeights = formElements.map((set) =>
          set.map((element) => element.clientHeight).reduce((a, b) => a + b)
        );

        this.formationWidth = colWidths.reduce((a, b) => a + b);
        this.formationHeight = Math.max(...colHeights);

        let triHCtr = this.formationWidth / 2;

        formElements.forEach((col, index) => {
          let leftStart =
            this.fieldHcenter - triHCtr + colWidths[index] * index;
          let topStart = this.fieldVcenter - colHeights[index] / 2;

          col.forEach((battler) => {
            battler.style.left = leftStart + "px";
            battler.style.top = topStart + "px";
            topStart += battler.clientHeight;
          });
          // leftStart += colWidths[index];
        });

        break;
      // ROW ===========================================
      case "row":
        this.formationWidth = battlerWidths.reduce((a, b) => a + b);
        this.formationHeight = Math.max(...battlerHeights);

        let formHCenter = Math.round(this.formationWidth / 2);
        let leftStart = this.fieldHcenter - formHCenter;

        battlers.forEach((battler) => {
          battler = battler.element;
          battler.style.left = leftStart + "px";
          battler.style.top =
            this.fieldVcenter - battler.clientHeight / 2 + "px";
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
const $battle = new BattleUIManager();

export { $display, $battle };
