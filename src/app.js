import "./scss/style.scss";

//Global Variables
const vendors = ["webkit", "moz"];
const mainCanvas = document.getElementById("mainCanvas");
let ctx;

const CANVAS_WIDTH_PERC = 85; // in percentages
const CANVAS_HEIGHT_PERC = 75; // in percentages

let canvasWidth, canvasHeight;

let currentTime = 0;
let lastTime = (new Date()).getTime();

let fps = 60;
let interval = 1000 / fps;

const draw = () => {

    //clear screen
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    //draw background
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

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



