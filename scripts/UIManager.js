export class UIManager {
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

export let $display = new UIManager();
