import { $player, enemySide, $confirmBtn, $game } from "./script.js";
import { Alien } from "./Character.js";
import { Objective } from "./Objective.js";
import { Message } from "./Message.js";
import { $battle } from "./UIManager.js";

/* ================================================ **
|| ** GAME **
** ================================================ */

class Game {
  constructor(score = 0, runtime = 0, gameState = 0) {
    this.score = score; // <== TODO: should be attached to PLAYER
    this.runtime = runtime; // <== TODO: should be attached to PLAYER
    this.gameState = gameState;
    this.player = "";
    this.enemies = []; // <== TODO: should be attached to WAVE
    this.currLevel;
  }

  /* --------------------------------------------- **
  || START
  ** --------------------------------------------- */

  start() {
    this.currLevel = new Level("Game Start", [], [], "", [
      {
        message: () =>
          "Hey! You're that new hotshot pilot!\nThey call you, er... I forgot.\nRemind me again.",
      },
      {
        prompt: () => "What's your name or call sign?",
        destination: (e) => {
          $player.name = e;
          $player.element.setAttribute("data-player-name", e);
        },
      },
      {
        message: () =>
          `Welcome aboard, ${$player.name}! Let's get you ready to go.\nWe've got incoming.`,
      },
      {
        proceed: () => {
          this.gameState = 1;
          heroSide.appendChild($player.element);
          const creature = {
            number: 3,
            health: 50,
            firepower: 10,
            accuracy: 90,
            speed: 9,
            name: "Scout",
          };

          let horde = [];
          for (let i = 0; i < creature.number; i++) {
            let alien = new Alien(
              creature.health,
              creature.firepower,
              creature.accuracy,
              creature.speed,
              creature.name,
              i + 1,
              0,
              0,
              [{ energy: 20 }]
            );

            horde.push(alien);
          }
          let wave = new Wave(
            "Shroomian Scouts",
            { type: "defeat", targets: "all" },
            horde,
            "tri"
          );
          this.currLevel.waves.push(wave);
        },
      },
      // {
      //   message: () =>
      //     "Looks like the SHROOMIANS sent a scout ahead.\nPrepare to engage!",
      // },
      { wave: 0 },
      {
        message: () =>
          `Excellent work, ${$player.name}!\nMaybe you are everything they claim!\nHere! Take this.`,
      },
    ]);

    // begin game loop (based on order)
    // <><><><><><> START GAME <><><><><><>
    // this.battle();
    this.currLevel.start();
  }

  /* --------------------------------------------- **
  || NEW
  || - Start a brand new game
  || - New player
  || - Level 0
  ** --------------------------------------------- */

  /* --------------------------------------------- **
  || SELECT LEVEL
  ** --------------------------------------------- */

  /* --------------------------------------------- **
  || CONTINUE
  || - Continue existing game from [somewhere]
  ** --------------------------------------------- */

  /* --------------------------------------------- **
  || SAVE
  || - Save the current game
  ** --------------------------------------------- */

  /* --------------------------------------------- **
  || GAME OVER
  || - when an objective is FAILED 
  || - (e.g. player is defeated in battle)
  ** --------------------------------------------- */
  over() {
    console.log("YOU LOST!");
    // prompt to RESTART or QUIT
    // RESTART:
    // - reset level to default config
    // - reset player to default config
    // - start current level from beginning
    // QUIT:
    // - remove stuff
    // - return to main menu
    // - change game state
  }

  /* --------------------------------------------- **
  || END
  || - End the current game
  ** --------------------------------------------- */

  /* --------------------------------------------- **
  || RESTART
  || - Restart the current game (e.g. in GAME OVER)
  ** --------------------------------------------- */
}

/* ================================================ **
|| ** LEVEL **
|| - Level can have multiple waves
|| - Level will have story 
** ================================================ */

class Level {
  /**
   *
   * @param {string} name for display purposes
   * @param {Array of Wave objects} waves arr of objs, fixed waves (exact design) vs varying stats
   * @param {Array of Reward objects} rewards array of objects: rewards: exp, weapons, etc
   * @param {string} background file path for background image
   * @param {Array of Objects} script
   */
  constructor(name, waves = [], rewards = [], background, script = []) {
    this.name = name;
    this.waves = waves; // method to get waves from JSON files?
    this.totalWaves = this.waves.length;
    this.rewards = rewards;
    this.background = background;
    this.script = new Objective(script);
    this.stage = this.script.run();
    this.successful = false;
    this.wave;
  }

  start() {
    // this.stage.next();
    this.script.runNext();
  }

  checkDone() {
    // task has to be evaluated?
    // objective has to keep track of whether task succeeded
    // needs to evaluate whether all tasks have been completed;
  }

  // check
  // objectiveFullfilled() {}

  giveRewards() {}
}

/* ================================================ **
|| ** WAVE **
|| Keeps track of the current battle
** ================================================ */
class Wave {
  constructor(name, mission, enemies, formation) {
    this.name = name;
    this.mission = mission;
    this.enemies = enemies;
    this.formation = formation;
    this.round = 1;
    this.turns = [];
    // this.complete = false;
    this.fight = this.battle(); //keeps track of generator iterator!
    this.success = false;
  }

  /* --------------------------------------------- **
  || START
  ** --------------------------------------------- */
  start() {
    // TODO Display the task, eg: "DEFEAT ALL ENEMIES!"
    // this.evalMission();
    this.loadEnemyBattlers();
    $battle.setFormation(this.enemies, this.formation);
    this.fight.next();
  }

  /* --------------------------------------------- **
  || LOAD ENEMY BATTLERS
  ** --------------------------------------------- */
  loadEnemyBattlers() {
    // Loads battlers IN FORMATION!!!!!
    this.enemies.forEach((alien) => enemySide.appendChild(alien.element));
  }

  /* --------------------------------------------- **
  || EVALUATE FORMATION
  || - helper fn
  || - row, column, triangle, diamond, chain, custom
  ** --------------------------------------------- */

  /* --------------------------------------------- **
  || BATTLE
  ** --------------------------------------------- */

  *battle() {
    this.gameState = 2;
    let opponents = this.remaining();

    while ($player.health > 0 && opponents.length > 0) {
      console.log(
        `%c\n>>>>>>>>>> Round: ${this.round} <<<<<<<<<<\n`,
        "color: cyan"
      );
      let turnOrder = this.getTurnOrder(opponents);
      console.log(
        "%cOrder:",
        "color: orange",
        turnOrder.map((char) => char.name).join(", ")
      );

      for (let attacker of turnOrder) {
        if (attacker.isAlive) {
          if (attacker === $player) {
            console.log(
              "%cYOUR TURN",
              "background-color: green; padding: 2px;"
            );
            yield $player.prepareToFire();
            console.log("Remaining:", this.remaining());
          } else {
            attacker.attack($player);
          }
        }
      }
      console.log(
        `%c \n------- Results | Round: ${this.round} -------\n`,
        "color: lime"
      );
      console.log(`${$player.name} health: ${$player.health}`);
      opponents.forEach((enemy) =>
        console.log(`${enemy.name} health: ${enemy.health}`)
      );
      opponents = this.remaining();
      this.round++;
    }
    // <<<<<<<<<<< BATTLE OUTCOME >>>>>>>>>>>
    let outcome = $player.isAlive ? "Victory" : "Defeat";
    this.round -= 1;
    console.log(
      `${outcome} in ${this.round} round${this.round > 1 ? "s" : ""}!`
    );
    // this.complete = true;
    // CHECK IF OBJECTIVE IS FULFILLED
    if ($player.isAlive && this.evalMission()) {
      // RESET TURN CACHE
      this.success = true;
      $game.currLevel.stage.next();
    } else {
      $game.over();
    }
  }

  /* --------------------------------------------- **
  || GET TURN ORDER
  ** --------------------------------------------- */

  getTurnOrder(battlers) {
    // console.log(`getTurnOrder ${battlers.map(x => x.name).join(", ")}`);
    let sorted = [
      {
        char: $player,
        speed: Math.ceil(Math.random() * $player.speed),
      },
    ];

    battlers.forEach((battler) => {
      let speed_ = Math.ceil(Math.random() * battler.speed);
      sorted.push({ char: battler, speed: speed_ });
    });

    // console.log(sorted.sort((a, b) => b.speed - a.speed));
    let order = sorted.sort((a, b) => b.speed - a.speed).map((x) => x.char);
    this.turns.push(order);
    document.querySelectorAll(".token");
    // .forEach((token) => token.classList.remove("active"));
    order.forEach((battler) => this.popTurnCache(battler, battler === $player));
    return order;
  }

  /* --------------------------------------------- **
  || POPULATE TURN CACHE
  ** --------------------------------------------- */
  popTurnCache(char, isHero) {
    const turnCache = document.getElementById("battle-turn-cache");
    const newToken = document.createElement("li");
    const tokenClass = isHero ? "hero" : "enemy";
    if (!isHero) newToken.setAttribute("data-enemy-index", char.index);

    newToken.classList.add(tokenClass, "token", "active");
    turnCache.appendChild(newToken);
    char.turnToken = newToken;
  }

  /* --------------------------------------------- **
  || REMAINING
  ** --------------------------------------------- */

  remaining() {
    return this.enemies.filter((enemy) => enemy.isAlive);
  }

  /* --------------------------------------------- **
  || EVALUATE MISSION
  || - determines the condtion that needs to be met
  || -- that will determine whether the wave is
  || -- successful
  ** --------------------------------------------- */

  // object {type: defeat | target: all/key, timed: false}

  evalMission() {
    let target;
    let timeLimit;
    let conditions = Object.keys(this.mission); //BACKWARDS AF?

    // EVALUATE EACH OBJ
    let result = !conditions
      .map((param) => {
        // const condition = this.mission[conditionParam];
        const condition = this.mission[param];
        const targets = this.mission.targets;
        console.log(condition);

        switch (condition) {
          case "defeat":
            // if there is a target
            // if target = all or NO TARGETs specified
            if (!targets || targets === "all") {
              return this.remaining().length === 0;
            } else {
              // if remaining enemies does not include specified targets
              // targets.forEach((target) => !this.remaining().includes(target));
              for (let target of targets) {
                if (!this.remaining().includes(target) === false) return false;
              }
              return true;
            }
            break;
          case "survive":
            break;
          case "score":
            break;
        }
      })
      .includes(false);

    console.log({ result });
    return result;
  }
}

export { Game, Level, Wave };
