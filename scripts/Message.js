import { $game, $player } from "./script.js";
import { Objective } from "./Objective.js";

/* ================================================ **
|| ** MESSAGE **
|| Handles everything that takes place in the
|| message box!
** ================================================ */

class Message {
  constructor(content, type = "message") {
    this.content = content.split("\n"); //array;
    // this.objective = new Objective(this.content);
    this.type = type;
    this.display = "";
    this.active = false;
    this.page = 0;
    this.printing = false;
    this.element = document.querySelector("#messageBox-inner");
    this.container = document.querySelector("#messageBox");
    this.cursor = document.querySelector("#cursorNext");
    // this.cursor.addEventListener("click", () => this.toNext());
    this.activate();
    // this.initialize();
    this.toNext_ = this.toNext.bind(this);
  }

  init() {
    this.cursor.addEventListener("click", this.toNext_);
    this.turnToPage(this.page);
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
    this.showMessage(this.content[target]);
  }

  showMessage(msg) {
    // console.log('running showMessage');
    console.log("Message:", msg);
    this.clearMessageBox();
    const printMsg = document.createElement("p");
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

  clearMessageBox() {
    // this.element.classList.add('active');
    this.element.innerHTML = ""; //clear messageBox;
  }

  dispose() {
    this.display = "";
    this.active = false;
    this.container.classList.remove("active");
    this.cursor.removeEventListener("click", this.toNext_);
    // $game.currLevel.stage.next();
    $game.currLevel.script.runNext();
  }
}

/* ================================================ **
|| ** PROMPT **
** ================================================ */

class Prompt extends Message {
  constructor(question, destination, type = "prompt", options = []) {
    super(question, type);
    this.input;
    this.options = options;
    this.result;
    this.destination = destination;
    this.collectPrompt_ = this.collectPrompt.bind(this);
  }

  init() {
    this.container.classList.add("prompt");
    this.cursor.addEventListener("click", this.collectPrompt_);
    this.showPrompt();
  }

  dispose() {
    this.container.classList.remove("prompt");
    this.cursor.removeEventListener("click", this.collectPrompt_);
    super.dispose();
  }

  showPrompt() {
    // console.log("running showPrompt()");
    this.clearMessageBox();
    const printQuestion = document.createElement("p");
    printQuestion.innerHTML = this.content;

    this.input = document.createElement("input");

    this.input.setAttribute("type", "text");
    this.element.appendChild(printQuestion);
    this.element.appendChild(this.input);

    const collectPrompt = this.collectPrompt.bind(this);
  }

  collectPrompt() {
    if (this.input.value.length > 0) {
      this.result = this.input.value.trim().toUpperCase();
      this.destination(this.result);
      this.dispose();
    }
  }
}

export { Message, Prompt };
