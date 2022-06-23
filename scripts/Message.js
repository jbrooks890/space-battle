import { $game, $player } from "./script.js";
import { Objective } from "./Objective.js";

/* ================================================ **
|| ** MESSAGE **
|| Handles everything that takes place in the
|| message box!
** ================================================ */

class Message {
  constructor() {
    this.content = "";
    // this.objective = new Objective(this.content);
    this.type = "message";
    this.display = "";
    this.active = false;
    this.page = 0;
    this.printing = false;
    this.element = document.querySelector("#messageBox-inner");
    this.container = document.querySelector("#messageBox");
    this.cursor = document.querySelector("#cursorNext");
    this.cursor.addEventListener("click", () => this.toNext());
    // this.initialize();
  }

  init(content, type = "message", options = []) {
    this.content = content.split("\n"); //array
    this.active = true;
    this.container.classList.add("active");

    this.turnToPage(this.page);
    // this.loadCursor(this.turnToPage);
    // this.loadCursor();
    // console.log(this.running('active'));
  }

  activate() {
    this.active = true;
    this.container.classList.add("active");
  }

  toNext() {
    if (this.page >= this.content.length - 1) {
      console.log("Last item!");
      this.dispose();
    } else {
      this.turnToPage();
    }
  }

  turnToPage(target = (this.page += 1)) {
    // console.log('running turn page');
    // if (this.page >= this.content.length - 1){
    //     this.dispose()
    // } else {
    //     this.showMessage(this.content[target]);
    // }
    this.showMessage(this.content[target]);
  }

  showMessage(msg) {
    // console.log('running showMessage');
    console.log("Message:", msg);
    this.clearMessageBox();
    const printMsg = document.createElement("p");
    // for (let i = 0; i<msg.length; i++){
    //     printMsg.
    // }
    // printMsg.innerHTML = msg;
    this.element.appendChild(printMsg);
    // printMsg.innerText = msg;
    this.animateText(msg, printMsg, 0);
  }

  animateText(text, element, index, interval = 30) {
    this.printing = true;
    if (index < text.length) {
      //   let letter = document.createTextNode(text[index++]);
      //   element.appendChild(letter);
      element.textContent += text[index++];
      setTimeout(() => this.animateText(text, element, index), interval);
    }
    this.printing = false;
  }

  showPrompt(question, type = "text", options = []) {
    console.log("running showPrompt()");
    this.clearMessageBox();
    const printQuestion = document.createElement("p");
    printQuestion.innerHTML = question;

    const newPrompt = document.createElement("input");

    newPrompt.setAttribute("type", "text");
    this.element.appendChild(printQuestion);
    this.element.appendChild(newPrompt);
  }

  clearMessageBox() {
    // this.element.classList.add('active');
    this.element.innerHTML = ""; //clear messageBox;
  }

  collectPrompt(prompt) {
    console.log("running collectPrompt()");
    if (`${prompt.value}`.length > 0) {
      return prompt.value.toUpperCase();
    }
  }

  dispose() {
    this.display = "";
    this.active = false;
    this.container.classList.remove("active");
    $game.currLevel.objective.run().next();
  }
}

export { Message };
