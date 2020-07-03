class Game {
    constructor(difficulty = 1) {
        
        this.BLOCK_SIZE_X = 25;
        this.BLOCK_SIZE_Y = 25;
        this.BORDER_SIZE = 2;

        this.NR_ROWS = 20;
        this.NR_COLS = 10;

        this.SHAPES =  ["-----X--XXX-----", "-X---X---X---X--", "-----XX--XX-----", "-----XX---XX----", "-----XX-XX------", "-----X---XXX----", "------X-XXX-----"];
        //TODO: fill array with shapes colors
        this.SHAPES_COLORS = [];

        this.dx = this.BLOCK_SIZE_X * difficulty;
        this.dy = this.BLOCK_SIZE_Y * difficulty;

        this.shapesToSee = (4 - difficulty);
        this.nextShapes =  [...new Array(this.shapesToSee)].map(() => Math.floor(Math.random() * this.SHAPES.length));
        
        this.score = 0;
        this.scoredTetris = false;
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

    getShapes = () => this.nextShapes.slice();

    updateScoreAtIncreasedSpeed = () => this.score += 3;
};

export default Game;