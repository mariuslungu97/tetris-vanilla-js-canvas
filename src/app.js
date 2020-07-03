//Imports
import "./scss/style.scss";

import Game from './classes/Game';
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

let game;
let board;
let player;

let boardPosX, boardPosY;
let playerPosX, playerPosY;

let updatePlayerInterval = 400; // in ms
let lastUpdateTime = (new Date()).getTime();
let currentUpdateTime = 0;

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
    const nextShapes = game.getShapes();

    for (let i = 0; i < nextShapes.length; i++) {

        const nextPlayer = new Player(game.SHAPES[nextShapes[i]], shapePosX, shapePosY, game.dx, game.dy, board);
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
    ctx.fillText(`${game.score}`, textPosX, textPosY + 50);

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

        //update player position
        currentUpdateTime = (new Date()).getTime();

        if (currentUpdateTime - lastUpdateTime > updatePlayerInterval) {
            
            //update position
            const hasPlayerUpdated = player.update("none");

            if (!hasPlayerUpdated) {
                 
                board.addTetroToCollided(player);
                
                //check for completed rows
                const completedRows = board.checkForCompletedRows();
                
                //update board blocks
                board.updateBoardBlocks(completedRows);
                
                //update score  
                game.updateScore(completedRows.length);

                //create new player instance
                player = new Player(game.drawShape(), playerPosX, playerPosY, game.dx, game.dy, board);
                
                //check if the player is colliding without any positional update => player has lost
                const [updatePosX, updatePosY] = board.checkForCollisions(player.shape, player.posX, player.posY);
                const isFirstRowFilled = board.isFirstRowFilled();

                if (!updatePosX && !updatePosY && isFirstRowFilled) {
                    //player has lost
                    if (!alert("You have lost! Your final score is: " + game.score)) {
                        game = new Game();
                        board = new Board(boardPosX, boardPosY, game.BLOCK_SIZE_X, game.BLOCK_SIZE_Y, game.BORDER_SIZE, game.NR_ROWS, game.NR_COLS);
                        player = new Player(game.drawShape(), playerPosX, playerPosY, game.dx, game.dy, board);
                    }
                };
            };

            lastUpdateTime = currentUpdateTime;
        };

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
    
    //create game instance
    //TODO: get game params dynamically, by letting the user set the difficulty of the game
    game = new Game();

    //create board instance
    boardPosX = canvasWidth / 2 - (game.NR_COLS/2) * game.BLOCK_SIZE_X;
    boardPosY = canvasHeight / 2 - (game.NR_ROWS/2) * game.BLOCK_SIZE_Y;
   
    board = new Board(boardPosX, boardPosY, game.BLOCK_SIZE_X, game.BLOCK_SIZE_Y, game.BORDER_SIZE, game.NR_ROWS, game.NR_COLS);

    //create player instance
    playerPosX = canvasWidth / 2 - (4/2) * game.BLOCK_SIZE_X;
    playerPosY = boardPosY;

    player = new Player(game.drawShape(), playerPosX, playerPosY, game.dx, game.dy, board);

    let increasedSpeedInterval;

    //set event listeners
    window.addEventListener("keydown", (e) => {
        if (e.keyCode === 37) player.update("left");
        else if (e.keyCode === 39) player.update("right");
        else if (e.keyCode === 38) player.rotate();
        else if (e.keyCode === 40) {
            updatePlayerInterval = 25;
            increasedSpeedInterval = setInterval(() => game.updateScoreAtIncreasedSpeed(), 50);
        };

    });

    window.addEventListener("keyup", (e) => {
        if (e.keyCode === 40) {
            updatePlayerInterval = 400;
            clearInterval(increasedSpeedInterval);
        };
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



