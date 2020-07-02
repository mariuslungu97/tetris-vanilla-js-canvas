//Imports
import "./scss/style.scss";

import Board from './classes/Board';
import Player from './classes/Player';

//Global Variables
const vendors = ["webkit", "moz"];
const mainCanvas = document.getElementById("mainCanvas");
let ctx;

const CANVAS_WIDTH_PERC = 75; // in percentages
const CANVAS_HEIGHT_PERC = 75; // in percentages

let canvasWidth, canvasHeight;

let currentTime = 0;
let lastTime = (new Date()).getTime();

let fps = 60;
let interval = 1000 / fps;

const BLOCK_SIZE_X = 25;
const BLOCK_SIZE_Y = 25;
const BORDER_SIZE = 2;

let board;
let player;

const NR_ROWS = 20;
const NR_COLS = 10;

const dx = BLOCK_SIZE_X;
const dy = BLOCK_SIZE_Y;

const SHAPES = ["-----X--XXX-----", "-X---X---X---X--", "-----XX--XX-----", "-----XX---XX----", "-----XX-XX------", "-----X---XXX----", "------X-XXX-----"];

let nextShapes;
let shapesToSee = 3;

const drawNextShapes = () => {

    //render text
    const textPosX = board.boardCoordsX[1] + (canvasWidth -  board.boardCoordsX[1]) / 2;
    const textPosY = board.boardCoordsY[0] + 30;

    ctx.font = "36px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText("NEXT:", textPosX, textPosY);

    //render shapes
    let shapePosX = textPosX;
    let shapePosY = textPosY + 25;

    for (let i = 0; i < nextShapes.length; i++) {

        const shape = SHAPES[nextShapes[i]];
        const nextPlayer = new Player(shape, shapePosX, shapePosY, dx, dy, board);
        nextPlayer.draw(ctx);

        shapePosY += 165;
    };

};

const drawScore = () => {
    //render text
    const textPosX = (canvasWidth -  board.boardCoordsX[1]) / 2;
    const textPosY = board.boardCoordsY[0] + 30;

    ctx.font = "36px sans-serif";
    ctx.fillStyle = "#ffffff";

    ctx.fillText("SCORE:", textPosX, textPosY);
    
    ctx.textAlign = "center";
    ctx.fillText(`${board.score}`, textPosX, textPosY + 50);

};

const draw = () => {

    //clear screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    //draw board
    board.drawBoard(ctx);

    //draw player
    player.draw(ctx);

    //draw next shapes
    drawNextShapes();

    //draw score
    drawScore();
};

const gameLoop = () => {

    window.requestAnimationFrame(gameLoop);

    currentTime = (new Date()).getTime();
    let delta = currentTime - lastTime;

    if (delta > interval) {

        draw();

        lastTime = currentTime - (delta % interval);

    }

};

const init = () => {
    
    ctx.canvas.width = (window.innerWidth * CANVAS_WIDTH_PERC) / 100;
    ctx.canvas.height = (window.innerHeight * CANVAS_HEIGHT_PERC) / 100;

    canvasWidth = ctx.canvas.width;
    canvasHeight = ctx.canvas.height;

    //requestAnimationFrame support for Microsoft Explorer and Mozilla Fireforx
    for (let x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
        window.requestAnimationFrame = window[vendors[x] + "RequestAnimationFrame"];
        window.cancelAnimationFrame = window[vendors[x] + "CancelAnimationFrame" || vendors[x] + "CancelRequestAnimationFrame"];
    };
    
    //fill nextShapes
    nextShapes = [...new Array(shapesToSee)].map(() => Math.floor(Math.random() * SHAPES.length));

    //create board instance
    let boardPosX = canvasWidth / 2 - (NR_COLS/2) * BLOCK_SIZE_X;
    let boardPosY = canvasHeight / 2 - (NR_ROWS/2) * BLOCK_SIZE_Y;
   
    board = new Board(boardPosX, boardPosY, BLOCK_SIZE_X, BLOCK_SIZE_Y, BORDER_SIZE, NR_ROWS, NR_COLS);

    //create player instance
    const playerPosX = canvasWidth / 2 - (4/2) * BLOCK_SIZE_X;
    const playerPosY = boardPosY;

    player = new Player(SHAPES[nextShapes.shift()], playerPosX, playerPosY, dx, dy, board);
    nextShapes.push(Math.floor(Math.random() * SHAPES.length));

    //set interval to update player position every 500ms
    const playerUpdateInterval = setInterval(() => {
        
        const hasPlayerUpdated = player.update("none");

        if (!hasPlayerUpdated) {
            board.addTetroToCollided(player);
            //check for completed rows
            const completedRows = board.checkForCompletedRows();
            //update board blocks
            board.updateBoardBlocks(completedRows);
            board.updateScore(completedRows.length);

            //create new player instance
            player = new Player(SHAPES[nextShapes.shift()], playerPosX, playerPosY, dx, dy, board);
            nextShapes.push(Math.floor(Math.random() * SHAPES.length));
        }

    }, 300);

    //set event listeners
    window.addEventListener("keydown", (e) => {
        
        if (e.keyCode === 37) player.update("left");
        else if (e.keyCode === 39) player.update("right");
        else if (e.keyCode === 38) player.rotate();

    });

    //game loop
    gameLoop();
};

window.addEventListener("load", (e) => {
    //check if canvas is supported
    if (mainCanvas.getContext) {

        ctx = mainCanvas.getContext("2d");
        
        init();

    } else {
        alert("The Canvas element is not supported by your browser");
    }
});



