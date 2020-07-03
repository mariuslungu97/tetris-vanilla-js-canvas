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
    
    rotate() {

        let angle = 90;
        let rotated = false;
        let rotatedTetro;

        while (!rotated && angle !== 360) {

            rotatedTetro = this.rotateWithAngle(angle);

            //check for collisions 
            const [updatePosX, updatePosY] = this.board.checkForCollisions(rotatedTetro, this.posX, this.posY);

            if (updatePosX && updatePosY) rotated = true;
            else angle += 90;

        };  

        if (!rotated) return false;
        else {
            this.shape = rotatedTetro;
            return true;
        };

    }

    rotateWithAngle(angle) {

        let tempShape = new String(this.shape).split('');

        let result = new Array(tempShape.length);

        for (let i = 0; i < Math.floor(angle / 90); i++) {

            let row = 0;
            let col = 0;

            for (let j = 0; j < tempShape.length; j++) {
                
                let rotatedCol = (4 - 1) - row;
                let rotatedRow = col;

                result[rotatedRow * 4 + rotatedCol] = tempShape[j];

                if ((j+1) % 4 === 0) {
                    row++;
                    col = 0;
                } else {
                    col++;
                }

            };

            tempShape = [...result];

        };

        return result.join("");
    }
 
    update(direction) {
        
        //use temporary positions to check for collisions
        let tempPosX, tempPosY;

        if (direction === "left") tempPosX = this.posX - this.dx;
        else if (direction === "right") tempPosX = this.posX + this.dx;
        else tempPosX = this.posX;

        tempPosY = this.posY + this.dy;
        
        //check for collision
        const [updateDirectionX, updateDirectionY] = this.board.checkForCollisions(this.shape, tempPosX, tempPosY);
        
        //update direction
        if (!updateDirectionY) return updateDirectionY;
        else {
            if (updateDirectionX) {
                this.posX = tempPosX;
            }
            this.posY = tempPosY;
            return true;
        };
    }
};

export default Player;

