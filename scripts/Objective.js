import {$game, $player} from './script.js'
import { Message } from './Message.js';

export class Objective {
    constructor(tasks){
        this.tasks = tasks;
        this.line = 0;
        this.complete = false;
    }

    *run() {
        console.log('running line!')
        while(!this.line < this.tasks.length){
         yield this.execute(this.tasks[this.line++]);
        }
        this.complete = true;
     }
 
     // when to proceed to next script command?
     // ^^ once the previous one is resolved
     // ^^ resolved once designated task is completed
     // ^^ messages are always resolved once text is read and cursor is clicked
 
     execute(command) {
         const type = Object.keys(command)[0];
         const output = command[type];
 
         this.complete = false;
 
         console.log(command);
         console.log(type);
 
         switch (type) {
             case 'message':
                 console.log('Message:', output);
                 const message = new Message(output);
                 this.checkDone.call(message, 'active');
                 message.initialize();
                 break;
             case 'prompt':
                 console.log('Prompt', output);
                 $game.showPrompt(output);
                 break;
             case 'wave':
                 console.log('fight enemies!');
                 break;
             case 'proceed':
                 console.log('executing code');
                 break;
             default:
                 console.log('This shit broke');
         }
     }

     checkDone(targetBoolProperty){
         // let status = new Promise;
         // console.log('This object:', this);
         console.log(this.hasOwnProperty(targetBoolProperty));
         // let status = targetBoolProperty;
     }

}