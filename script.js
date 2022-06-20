    const gameBoard = document.querySelector('#game-board');
    const msgBox = document.querySelector('#messageBox');
    const msgContent = document.querySelector('#messageBox-inner');
    const msgCursor = document.querySelector('#cursorNext');
    const heroSide = document.querySelector('#heroSide');
    const enemySide = document.querySelector('#enemySide');
    const gameStates = ['New', 'Start', 'Battle', 'End', 'Message', 'Awaiting'];

    let $player;

    class Space_Battle {

        constructor(score = 0, runtime = 0, gameState = 0) {
            this.score = score;
            this.runtime = runtime;
            this.gameState = gameState;
            this.player = '';
            // turn order [hero, enemyA, enemyB, enemyC]
        }

        start() {
            // load previous game
            console.log("Hey! You're the new pilot! What's your name again?");
            // this.showMessage("Hey! You're that new hotshot pilot! They call you, er... I forgot. Remind me again.");
            // let name = this.showPrompt("What's your name or call sign?");
            console.log(name);
            // get player's name
            console.log(`Welcome aboard, ${name}! Let's get you ready to go.\nWe've got incoming.`);
            // create player
            $player = new Hero(100, 100, 100, 8, 'Angel');
            console.log($player)
            this.gameState = 1;
            heroSide.appendChild($player.element);
            // create enemies
            console.log(`Looks like the SHROOMIANS sent a scout ahead. Prepare to engage!`);
            const alien = new Alien(50, 110, 90, 9, 'Scout', 1, 0, 0, [{ energy: 20 }]);
            enemySide.appendChild(alien.element);
            // begin game loop (based on order)
            // <><><><><><> START GAME <><><><><><>
            this.battle([alien]);
        }

        battle(opponents) {
            this.gameState = 2;
            console.log(`${$player.name} vs. ${opponents.name}!`);
            // while ($player.hull > 0 && opponents.length > 0) {
            //     // let turnOrder = this.getTurnOrder(opponents); // returns sorted array of Char objs
            //     let heroSpeed = Math.ceil(Math.random() * $player.speed);
            //     let oppSpeed = Math.ceil(Math.random() * opponents.speed);
            // }
            let turnOrder = this.getTurnOrder(opponents);
            console.log(turnOrder);
        }

        getTurnOrder(opponents) {
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

            console.log(sorted.sort((a, b) => b.speed - a.speed));
            return sorted.sort((a, b) => b.speed - a.speed).map(x => x.char);
        }

        showMessage(msg) {
            // if 'msg' = array, show cursor // msg should always be an array?
        }

        showPrompt(question) {
            console.log('running showPrompt()');
            msgBox.classList.add('active')
            msgContent.innerHTML = ''; //clear messageBox
            const printQuestion = document.createElement('p');
            printQuestion.innerHTML = question;
            // Show question
            // text input goes below
            const newPrompt = document.createElement('input');
            newPrompt.setAttribute('type', 'text');
            msgContent.appendChild(printQuestion);
            msgContent.appendChild(newPrompt);
            msgContent.addEventListener('keyup', e => {
                    // console.log(e)
                    if (e.key === 'Enter') {
                        return this.collectPrompt(newPrompt);
                    }
                })
                // return user's feedback;
        }

        collectPrompt(prompt) {
            console.log('running collectPrompt()');
            if (`${prompt.value}`.length > 0) {
                return prompt.value.toUpperCase();
            }
        }

        //retreat?
    }

    // :::::::: CHARACTER ::::::::

    class Character {
        constructor(hull, firepower, accuracy, speed, name) {
            this.hull = hull;
            this.firepower = firepower;
            this.accuracy = accuracy;
            this.speed = speed;
            this.shield = 0;
            this.name = name;
            this.element = this.create();
        }

        create() {
            let newActor = document.createElement('div');
            return newActor;
        }

        attack() {
            console.log('attacking something!');
            // determine hit
            // calculate damage
        }

        hasShield() {
            return this.shield > 0;
        }

        destroy() {
            console.log(`${this.name} was destroyed`);
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

        attack() {
            // super / apply?
            // choose weapon (if extra weapons available)
            // choose target via aim()
            // determine hit
            // calculate damage
        }

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
        /**
         * 
         * @param {integer} hull 
         * @param {integer} firepower 
         * @param {integer} accuracy 
         * @param {string} name 
         * @param {integer} index 
         * @param {integer} x 
         * @param {integer} y 
         * @param {Array of Objects} drops 
         */
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
                    switch (drop) {
                        case energy:
                            console.log(`Player received ${drop.energy} energy!`);
                            break;
                    }
                })
            }
        }

    }

    // :::::::: WEAPONS ::::::::

    class Weapon {
        constructor(name, power, type, accuracy) {
            this.name = name;
            this.power = power;
            this.type = type; // eg projectile, beam, etc
            this.accuracy = accuracy;
        }
    }

    // :::::::::::::::::: TEST EXECUTION ::::::::::::::::::

    // let test = new Hero(100, 100, 100, 'Julian');

    // console.log(test);
    // test.attack();

    msgCursor.onclick = () => {
        msgBox.classList.remove('active');
    }

    const game = new Space_Battle();
    game.start();