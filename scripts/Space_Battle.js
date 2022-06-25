import { $player } from "./script.js";
import { Alien } from "./Character.js";
import { Objective } from "./Objective.js";
import { Message } from "./Message.js";

/* ================================================ **
|| ** GAME **
|| - Main class
** ================================================ */

class Game {
  constructor(score = 0, runtime = 0, gameState = 0) {
    this.score = score;
    this.runtime = runtime;
    this.gameState = gameState;
    this.player = "";
    this.enemies = [];
    this.currLevel;
  }

  /* --------------------------------------------- **
  || START
  ** --------------------------------------------- */

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

  /* --------------------------------------------- **
  || BATTLE
  ** --------------------------------------------- */

  *battle() {
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

      console.log("battle test!!");

      for (let attacker of turnOrder) {
        // let target =
        //   attacker === $player
        //     ? opponents[Math.floor(Math.random() * opponents.length)]
        //     : $player;
        // console.log(target);
        // if (attacker.isAlive && target.isAlive) attacker.attack(target);

        if (attacker === $player) {
          yield $player.prepareToFire();
        } else {
          attacker.attack($player);
        }
      }
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

  /* --------------------------------------------- **
  || GET TURN ORDER
  ** --------------------------------------------- */

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

  /* --------------------------------------------- **
  || REMAINING
  ** --------------------------------------------- */

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
  openMenu() {}
}

/* ================================================ **
|| ** LEVEL **
|| - Level can have multiple waves
|| - Level will have story 
** ================================================ */

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
