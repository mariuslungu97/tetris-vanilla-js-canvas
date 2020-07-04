class Game {
    constructor(difficulty = 1) {
        
        this.BLOCK_SIZE_X = 25;
        this.BLOCK_SIZE_Y = 25;
        this.BORDER_SIZE = 1.15;

        this.NR_ROWS = 20;
        this.NR_COLS = 10;

        this.SHAPES =  ["-----X--XXX-----", "-X---X---X---X--", "-----XX--XX-----", "-----XX---XX----", "-----XX-XX------", "-----X---XXX----", "------X-XXX-----"];
        this.SHAPES_COLORS = ["#65019C", "#04EFEF", "#EFF004", "#F00000", "#00F100", "#0175f0", "#EEA000"];

        this.dx = this.BLOCK_SIZE_X;
        this.dy = this.BLOCK_SIZE_Y;

        this.shapesToSee = (4 - difficulty);
        this.nextShapes =  [...new Array(this.shapesToSee)].map(() => Math.floor(Math.random() * this.SHAPES.length));
        
        this.score = 0;
        this.scoredTetris = false;

        switch(difficulty) {
            case 1:
                this.updatePlayerInterval = 400;
                break;
            case 2:
                this.updatePlayerInterval = 300;
                break;
            case 3:
                this.updatePlayerInterval = 200;
                break;
        };
    };

    updateScore(lineClears) {

        const nrTetris = Math.floor(lineClears / 4);
        const rest = lineClears % 4;

        this.score += this.scoredTetris ? 1200 * nrTetris : 800 * nrTetris;
        this.score += rest * 100;
        this.scoredTetris = nrTetris > 0 ? true : false;

    };

    drawShape() {
        const shape = this.nextShapes.shift();
        const newShape = Math.floor(Math.random() * this.SHAPES.length);
        this.nextShapes.push(newShape);
        return this.SHAPES[shape];
    };

    getColorByShape(shape) {
        const shapeIndex = this.SHAPES.findIndex(el => el === shape);
        return this.SHAPES_COLORS[shapeIndex];
    };

    getShapes = () => this.nextShapes.map(shapeIndex => this.SHAPES[shapeIndex]);

    updateScoreAtIncreasedSpeed = () => this.score += 3;
};

export default Game;