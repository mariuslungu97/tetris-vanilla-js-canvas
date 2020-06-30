class Player {
    constructor(shape, posX, posY, dx, dy, board) {
        /*
            A shape is defined as a string of this form:
            ----
            -X--
            XXX-
            ----
            The shape always has a 4x4 structure, even though the data structure of the shape is not a
            multi-dimensional array, but a 1D array, for simplification purposes
        */
        this.shape = shape;
        this.posX = posX;
        this.posY = posY;
        
        this.dx = dx;
        this.dy = dy;

        //keep a reference of the current board
        this.board = board;
    }

    draw(ctx) {
        
        for (let i = 0; i < this.shape.length; i++) {
            
            if (this.shape[i] === 'X') {
                
                //get block position
                const [posX, posY] = this.board.getBlockPosition(i, this.posX, this.posY);

                const borderStyle = "rgba(0,44,133,1)";
                const blockStyle = "#023eb5";

                this.board.drawBlock(ctx, borderStyle, blockStyle, posX, posY);

            }
        };
    }

    update(direction) {
        
        if (direction === "left") this.posX = this.posX - this.dx;
        else if (direction === "right") this.posX = this.posX + this.dx;
        else this.posX = this.posX;

        this.posY = this.posY + this.dy;
    }
};

export default Player;

