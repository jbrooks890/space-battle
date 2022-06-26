import { Message } from "./Message.js";
import { Game } from "./Space_Battle.js";
import { Hero, Alien } from "./Character.js";
// import { Character, Hero, Alien } from 'script/Character.js'

const gameBoard = document.querySelector("#game-board");
const msgBox = document.querySelector("#messageBox");
const msgContent = document.querySelector("#messageBox-inner");
const msgCursor = document.querySelector("#cursorNext");
const heroSide = document.querySelector("#heroSide");
const enemySide = document.querySelector("#enemySide");
const menuBtn = document.querySelector("#menu-button");
const gameMenu = document.querySelector("#game-menu");
const bottomCache = document.querySelector("#game-bottom-cache");
const gameStates = ["New", "Start", "Battle", "End", "Message", "Awaiting"];
const $confirmBtn = document.querySelector("#confirm-button");

function toggleMenu() {
  gameMenu.classList.toggle("active");
}

// :::::::::::::::::: TEST EXECUTION ::::::::::::::::::

// msgCursor.onclick = () => {
//     msgBox.classList.remove('active');
// }

const $game = new Game();
// export const $msg = new Message();
const $player = new Hero(200, 8, "Angel");

menuBtn.onclick = toggleMenu;

$game.start();

export { $game, $confirmBtn, $player, enemySide };
