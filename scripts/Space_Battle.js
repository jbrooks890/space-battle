import { $player } from "./script.js";
import { Character, Hero, Alien } from "./Character.js";
import { Objective } from "./Objective.js";
import { Message } from "./Message.js";

class Game {
  constructor(score = 0, runtime = 0, gameState = 0) {
    this.score = score;
    this.runtime = runtime;
    this.gameState = gameState;
    this.player = "";
    this.enemies = [];
    this.currLevel;
  }

  start() {
    this.currLevel = new Level("Game Start", [], [], "", 0, [
      //   {
      //     message:
      //       "Hey! You're that new hotshot pilot!\nThey call you, er... I forgot.\nRemind me again.",
      //   },
      //   { prompt: "What's your name or call sign?" },
      //   {
      //     message: `Welcome aboard, <NAME>! Let's get you ready to go.\nWe've got incoming.`,
      //   },
      {
        proceed: () => {
          //   $player = new Hero(200, 60, 100, 8, name);
          //   console.log($player);
          this.gameState = 1;
          heroSide.appendChild($player.element);
          const wave = {
            number: 3,
            hull: 50,
            firepower: 30,
            accuracy: 90,
            speed: 9,
            name: "Scout",
          };
          for (let i = 0; i < wave.number; i++) {
            let alien = new Alien(
              wave.hull,
              wave.firepower,
              wave.accuracy,
              wave.speed,
              wave.name,
              i + 1,
              0,
              0,
              [{ energy: 20 }]
            );
            this.enemies.push(alien);
            enemySide.appendChild(alien.element);
          }
        },
      },
      //   {
      //     message:
      //       "Looks like the SHROOMIANS sent a scout ahead.\nPrepare to engage!",
      //   },
      { wave: 0 },
      {
        message: `Excellent work <NAME>!\nMaybe you are everything they claim!\nHere! Take this.`,
      },
    ]);

    // begin game loop (based on order)
    // <><><><><><> START GAME <><><><><><>
    // this.battle();
    this.currLevel.start();
  }

  battle() {
    this.gameState = 2;
    console.log(
      `${$player.name} vs. ${this.enemies.map((opp) => opp.name).join(", ")}!`
    );
    let opponents = this.remaining();
    let round = 1;

    while ($player.hull > 0 && opponents.length > 0) {
      console.log(`%c\n>>>>>>>>>> Round: ${round} <<<<<<<<<<\n`, "color: cyan");
      // get order in which each combatant (player or alien) will attack
      let turnOrder = this.getTurnOrder(opponents); // returns sorted array of Char objs
      console.log(
        "%cOrder:",
        "color: orange",
        turnOrder.map((char) => char.name).join(", ")
      );
      // attack in order
      turnOrder.forEach((attacker) => {
        let target =
          attacker === $player
            ? opponents[Math.floor(Math.random() * opponents.length)]
            : $player;
        // console.log(target);
        if (attacker.isAlive && target.isAlive) attacker.attack(target);
      });
      console.log("%c \n------- Results -------\n", "color: lime");
      console.log(`${$player.name} health: ${$player.hull}`);
      opponents.forEach((enemy) =>
        console.log(`${enemy.name} health: ${enemy.hull}`)
      );
      opponents = this.remaining();
      round++;
    }

    let outcome = $player.isAlive ? "Victory" : "Defeat";
    round -= 1;
    console.log(`${outcome} in ${round} round${round > 1 ? "s" : ""}!`);
    // let turnOrder = this.getTurnOrder(opponents);
    // console.log(turnOrder);
  }

  getTurnOrder(opponents) {
    // console.log(`getTurnOrder ${opponents.map(x => x.name).join(", ")}`);
    let sorted = [
      {
        char: $player,
        speed: Math.ceil(Math.random() * $player.speed),
      },
    ];

    opponents.forEach((opponent) => {
      let _speed = Math.ceil(Math.random() * opponent.speed);
      sorted.push({ char: opponent, speed: _speed });
    });

    // console.log(sorted.sort((a, b) => b.speed - a.speed));
    return sorted.sort((a, b) => b.speed - a.speed).map((x) => x.char);
  }

  remaining() {
    console.log(
      "Remaining:",
      this.enemies.filter((enemy) => enemy.hull > 0)
    );
    return this.enemies.filter((enemy) => enemy.hull > 0);
  }

  runScript() {
    // while there are still incomplete tasks...
    // run Level.execute()
  }

  //retreat?
}

// :::::::: LEVEL ::::::::
// Level can have multiple waves
// Level will have story chain

class Level {
  constructor(
    name,
    waves = [],
    rewards = [],
    background,
    stage = 0,
    script = []
  ) {
    // name: eg 'Those Meddlesome Shroomians'
    // super(script);
    this.name = name;
    // waves: arr of objs, fixed waves (exact design) vs varying stats
    this.waves = waves; // method to get waves from JSON files?
    // total waves
    this.totalWaves = this.waves.length;
    // rewards: exp, weapons, etc
    this.rewards = rewards; // array of objects
    // background graphic
    this.background = background;
    // Awaiting input?
    this.objective = new Objective(script);
    // this.script = script // list of story items in chronological order
    // this.stage = stage; // current index pos of script (where player is in the script)
    // this.objectiveFullfilled = false;
    this.successful = false;
  }

  start() {
    // console.log('starting Level');
    console.log(this.objective);
    this.objective.run().next();
    // this.execute(this.tasks[0]);
  }

  /* *run() {
       while(this.objectiveFullfilled){
        yield this.execute(this.script[this.stage]);
       }
    }

    // when to proceed to next script command?
    // ^^ once the previous one is resolved
    // ^^ resolved once designated task is completed
    // ^^ messages are always resolved once text is read and cursor is clicked

    execute(command) {
        const type = Object.keys(command)[0];
        const output = command[type];

        this.objectiveFullfilled = false;

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

    resolve() {
        if (this.stage != this.script.length - 1) {
            this.stage++;
        } else {
            if (this.successful) {
                // give results
            } else {
                // GAME OVER
                console.log('stuff');
            }
        }
    }

    checkDone(targetBoolProperty){
        // let status = new Promise;
        // console.log('This object:', this);
        console.log(this.hasOwnProperty(targetBoolProperty));
        // let status = targetBoolProperty;
    }

    nextLine(){

    } */

  // check
  // objectiveFullfilled() {}

  giveRewards() {}
}

// :::::::: Wave ::::::::
class Wave extends Level {
  constructor(objective) {
    super();
    // objective: defeat all foes, defeat key foe
    this.objective = objective; // object {type: defeat, target: all/key, timed: false}
    // enemies
    // story stuff
    // parent level <== necessary?
  }
}

export { Game, Level, Wave };
