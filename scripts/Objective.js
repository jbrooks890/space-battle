import { $game, $player } from "./script.js";
import { Character, Hero, Alien } from "./Character.js";
import { Message, Prompt } from "./Message.js";

/* ================================================ **
|| ** OBJECTIVE **
** ================================================ */

export class Objective {
  constructor(tasks) {
    this.tasks = tasks;
    this.line = 0;
    this.complete = this.run().done;
  }

  *run() {
    console.log("running line!");
    // run tasks while there are tasks remaining
    while (this.line < this.tasks.length) {
      // execute each task one at a time
      yield this.execute(this.tasks[this.line++]);
    }
    // code to run when all tasks (eg script lines) are finished
    // this.complete = true;
  }

  // when to proceed to next script command?
  // ^^ once the previous one is resolved
  // ^^ resolved once designated task is completed
  // ^^ messages are always resolved once text is read and cursor is clicked

  execute(command) {
    console.log(`%cRunning line ${this.line}`, "color: gray");
    const type = Object.keys(command)[0];
    const output = command[type];

    switch (type) {
      case "message":
        // console.log("Message:", output);
        let message = new Message(output);
        message.init();
        // this.checkDone.call($msg, "active");
        break;
      case "prompt":
        console.log("Prompt", output);
        let prompt = new Prompt(output, command.destination);
        prompt.init();
        break;
      case "wave":
        console.log("%c>>> BATTLE TIME <<<", "color: magenta");
        // $game.battle().next();
        $game.currLevel.wave = $game.currLevel.waves[output];
        $game.currLevel.waves[output].start();
        break;
      case "proceed":
        console.log("executing code");
        output();
        this.execute(this.tasks[this.line++]);
        break;
      default:
        console.log("It's broken!");
    }
  }

  checkDone(targetBoolProperty) {
    return this[targetBoolProperty] === true;
  }
}
