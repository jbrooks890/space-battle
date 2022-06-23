import { $msg, $game, $player } from "./script.js";
import { Character, Hero, Alien } from "./Character.js";
import { Message } from "./Message.js";

export class Objective {
  constructor(tasks) {
    this.tasks = tasks;
    this.line = 0;
    this.complete = false;
  }

  *run() {
    console.log("running line!");
    // run tasks while there are tasks remaining
    while (!this.line < this.tasks.length) {
      // execute each task one at a time
      yield this.execute(this.tasks[this.line++]);
    }
    // code to run when all tasks (eg script lines) are finished
    this.complete = true;
  }

  // when to proceed to next script command?
  // ^^ once the previous one is resolved
  // ^^ resolved once designated task is completed
  // ^^ messages are always resolved once text is read and cursor is clicked

  execute(command) {
    const type = Object.keys(command)[0];
    const output = command[type];

    switch (type) {
      case "message":
        // console.log("Message:", output);
        $msg.init(output);
        this.checkDone.call($msg, "active");
        break;
      case "prompt":
        console.log("Prompt", output);
        $msg.init(output, "prompt");
        this.checkDone.call($msg, "active");
        // const prompt = new Message(output, 'prompt')
        // $game.showPrompt(output);
        break;
      case "wave":
        console.log("fight enemies!");
        break;
      case "proceed":
        console.log("executing code");
        output();
        $game.currLevel.objective.run().next();
        break;
      default:
        console.log("This shit broke");
    }
  }

  checkDone(targetBoolProperty) {
    return this[targetBoolProperty] === true;
  }
}
