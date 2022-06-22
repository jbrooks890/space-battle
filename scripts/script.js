    import { Space_Battle } from '/scripts/Space_Battle.js'
    // import { Character, Hero, Alien } from 'script/Character.js'
    
    
    const gameBoard = document.querySelector('#game-board');
    const msgBox = document.querySelector('#messageBox');
    const msgContent = document.querySelector('#messageBox-inner');
    const msgCursor = document.querySelector('#cursorNext');
    const heroSide = document.querySelector('#heroSide');
    const enemySide = document.querySelector('#enemySide');
    const gameStates = ['New', 'Start', 'Battle', 'End', 'Message', 'Awaiting'];

    /* class Space_Battle {

        constructor(score = 0, runtime = 0, gameState = 0) {
            this.score = score;
            this.runtime = runtime;
            this.gameState = gameState;
            this.player = '';
            this.enemies = [];
            this.currLevel;
            // difficulty?
            // $game = this;
        }

        start() {
            // // load previous game
            // $player = new Hero(200, 60, 100, 8, 'Angel');
            // console.log($player)
            // this.gameState = 1;
            // heroSide.appendChild($player.element);
            // // // create enemies
            // console.log("Looks like the SHROOMIANS sent a scout ahead. Prepare to engage!");
            // const wave = {
            //     number: 3,
            //     hull: 50,
            //     firepower: 30,
            //     accuracy: 90,
            //     speed: 9,
            //     name: 'Scout'
            // }
            // for (let i = 0; i < wave.number; i++) {
            //     let alien = new Alien(wave.hull, wave.firepower, wave.accuracy, wave.speed, wave.name, i + 1, 0, 0, [{ energy: 20 }]);
            //     this.enemies.push(alien);
            //     enemySide.appendChild(alien.element);
            // }

            this.currLevel = new Level('Game Start', [], [], '', 0, [
                { message: "Hey! You're that new hotshot pilot!\nThey call you, er... I forgot. Remind me again." },
                { prompt: "What's your name or call sign?" },
                { message: `Welcome aboard, <NAME>! Let's get you ready to go.\nWe've got incoming.` },
                {
                    proceed: function() {
                        $player = new Hero(200, 60, 100, 8, name);
                        console.log($player)
                        this.gameState = 1;
                        heroSide.appendChild($player.element);
                        const wave = {
                            number: 3,
                            hull: 50,
                            firepower: 30,
                            accuracy: 90,
                            speed: 9,
                            name: 'Scout'
                        }
                        for (let i = 0; i < wave.number; i++) {
                            let alien = new Alien(wave.hull, wave.firepower, wave.accuracy, wave.speed, wave.name, i + 1, 0, 0, [{ energy: 20 }]);
                            this.enemies.push(alien);
                            enemySide.appendChild(alien.element);
                        }
                    }
                },
                { message: "Looks like the SHROOMIANS sent a scout ahead. Prepare to engage!" },
                { wave: 0 },
                { message: `Excellent work <NAME>!\nMaybe you are everything they claim!\nHere! Take this.` }
            ])

            // begin game loop (based on order)
            // <><><><><><> START GAME <><><><><><>
            // this.battle();
            this.currLevel.start();
        }

        battle() {
            this.gameState = 2;
            console.log(`${$player.name} vs. ${this.enemies.map(opp => opp.name).join(", ")}!`);
            let opponents = this.remaining();
            let round = 1;

            while ($player.hull > 0 && opponents.length > 0) {
                console.log(`%c\n>>>>>>>>>> Round: ${round} <<<<<<<<<<\n`, 'color: cyan');
                // get order in which each combatant (player or alien) will attack
                let turnOrder = this.getTurnOrder(opponents); // returns sorted array of Char objs
                console.log('%cOrder:', 'color: orange', turnOrder.map(char => char.name).join(", "));
                // attack in order
                turnOrder.forEach(attacker => {
                    let target = attacker === $player ?
                        opponents[Math.floor(Math.random() * opponents.length)] :
                        $player;
                    // console.log(target);
                    if (attacker.isAlive && target.isAlive) attacker.attack(target);
                })
                console.log('%c \n------- Results -------\n', 'color: lime')
                console.log(`${$player.name} health: ${$player.hull}`);
                opponents.forEach(enemy => console.log(`${enemy.name} health: ${enemy.hull}`));
                opponents = this.remaining();
                round++;
            }

            let outcome = $player.isAlive ? 'Victory' : 'Defeat';
            round -= 1;
            console.log(`${outcome} in ${round} round${round > 1 ? 's' : ''}!`);
            // let turnOrder = this.getTurnOrder(opponents);
            // console.log(turnOrder);
        }

        getTurnOrder(opponents) {
            // console.log(`getTurnOrder ${opponents.map(x => x.name).join(", ")}`);
            let sorted = [{
                char: $player,
                speed: Math.ceil(Math.random() * $player.speed)
            }];

            opponents.forEach(opponent => {
                let _speed = Math.ceil(Math.random() * opponent.speed);
                sorted.push({
                    char: opponent,
                    speed: _speed
                });
            })

            // console.log(sorted.sort((a, b) => b.speed - a.speed));
            return sorted.sort((a, b) => b.speed - a.speed).map(x => x.char);
        }

        showMessage(msg) {
            this.clearMessageBox();
            const printMsg = document.createElement('p');
            printMsg.innerHTML = msg;
            msgContent.appendChild(printMsg);
        }

        showPrompt(question) {
            console.log('running showPrompt()');
            this.clearMessageBox();
            const printQuestion = document.createElement('p');
            printQuestion.innerHTML = question;

            const newPrompt = document.createElement('input');

            newPrompt.setAttribute('type', 'text');
            msgContent.appendChild(printQuestion);
            msgContent.appendChild(newPrompt);
            // msgContent.addEventListener('keyup', e => {
            //         // console.log(e)
            //         if (e.key === 'Enter') {
            //             return this.collectPrompt(newPrompt);
            //         }
            //     })
            // return user's feedback;
        }

        clearMessageBox() {
            msgBox.classList.add('active')
            msgContent.innerHTML = ''; //clear messageBox;
        }

        collectPrompt(prompt) {
            console.log('running collectPrompt()');
            if (`${prompt.value}`.length > 0) {
                return prompt.value.toUpperCase();
            }
        }

        remaining() {
            console.log('Remaining:', this.enemies.filter(enemy => enemy.hull > 0));
            return this.enemies.filter(enemy => enemy.hull > 0);
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
        constructor(name, waves = [], rewards = [], background, stage = 0, script = []) {
            // name: eg 'Those Meddlesome Shroomians'
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
            this.script = script // list of story items in chronological order
            this.stage = stage; // current index pos of script (where player is in the script)
            this.objectiveFullfilled = false;
            this.successful = false;
        }

        start() {
            this.run();
            this.execute(this.script[0]);
        }

        *run() {
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
                    $game.showMessage(output);
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
    } */

    // :::::::: OBJECTIVE ::::::::
    // tasks = list of items that need to be resolved
    // all tasks complete?

   /*  // :::::::: CHARACTER ::::::::

    class Character {
        constructor(hull, firepower, accuracy, speed, name) {
            this.hull = hull;
            this.firepower = firepower;
            this.accuracy = accuracy;
            this.speed = speed;
            this.name = name;
            this.isAlive = true;
            this.shield = 0;
            this.element = this.create();
        }

        create() {
            let newActor = document.createElement('div');
            return newActor;
        }

        attack(target) {
            console.log(`${this.name} attacks ${target.name}!`);
            const min = 10;
            let roll = Math.ceil(Math.random() * this.accuracy);
            // let damage = Math.ceil(Math.random() * this.firepower);
            let damage = Math.floor(Math.random() * min) + this.firepower - min;
            // if accuracy roll is greater than 3/4 of itself, hit!
            console.log({ roll }, { damage });
            // determine hit
            if (roll >= Math.round(this.accuracy / 2)) {
                if (target.hull - damage <= 0) {
                    target.hull -= target.hull;
                    target.destroy();
                } else {
                    target.hull -= damage;
                }
            } else {
                console.log(`${this.name} missed!`)
            }

            // calculate damage
        }

        hasShield() {
            return this.shield > 0;
        }

        destroy() {
            console.log(`${this.name} was destroyed`);
            this.isAlive = false;
            // remove alien from the dom
            this.element.remove();
            // award player points
        }
    }

    // :::::::: HERO ::::::::

    class Hero extends Character {
        constructor(hull, firepower, accuracy, speed, name) {
            super(hull, firepower, accuracy, speed, name);
            this.actions = [];
            this.specialWeapons = [];
        }

        create() {
            let newHero = super.create();
            newHero.id = 'heroActor';
            newHero.setAttribute('data-player-name', this.name);
            return newHero;
        }

        chooseAction() {
            // player chooses to: attack, repair, retreat
        }

        // attack() {
        // super / apply?
        // choose weapon (if extra weapons available)
        // choose target via aim()
        // determine hit
        // calculate damage
        // }

        aim() {
            console.log('aiming at something!');
            // move cursor onto target
            // return target (enemy object)
        }

        retreat() {
            console.log('retreating!')
        }
    }

    // :::::::: ALIEN ::::::::

    class Alien extends Character {

        constructor(hull, firepower, accuracy, speed, name, index = null, x = 0, y = 0, drops = []) {
            super(hull, firepower, accuracy, speed, `${name} ${index}`);
            this.x = x;
            this.y = y;
            this.drops = drops; // dropped item
            // maybe speed?
        }

        create() {
            let newEnemy = super.create();
            newEnemy.id = this.name.toLowerCase().trim().replace(' ', '-');
            newEnemy.classList.add('enemyActor');
            newEnemy.setAttribute('data-enemy-name', this.name);
            return newEnemy;
        }

        destroy() {
            super.destroy();
            // process drops
            if (this.drops.length > 0) {
                this.drops.forEach(drop => {
                    console.log(drop);
                    // switch (drop) {
                    //     case energy:
                    //         console.log(`Player received ${drop.energy} energy!`);
                    //         break;
                    // }
                })
            }
        }

    } */

    // :::::::: WEAPONS ::::::::

    class Weapon {
        /**
         * 
         * @param {string} name 
         * @param {number} power 
         * @param {string} type 
         * @param {number} accuracy 
         */
        constructor(name, power, type, accuracy) {
            this.name = name;
            this.power = power;
            this.type = type; // eg projectile, beam, etc
            this.accuracy = accuracy;
        }
    }

    // :::::::::::::::::: TEST EXECUTION ::::::::::::::::::

    // msgCursor.onclick = () => {
    //     msgBox.classList.remove('active');
    // }

    export const $game = new Space_Battle();
    export let $player;

    $game.start();
    console.log($game.currLevel);