class Board {
    constructor(posX, posY, blockSizeX, blockSizeY, borderSize, m, n) {
        
        this.posX = posX;
        this.posY = posY;
        
        this.m = m;
        this.n = n;

        this.blockSizeX = blockSizeX;
        this.blockSizeY = blockSizeY;
        this.borderSize = borderSize;

        this.boardCoordsX = [this.posX, this.posX + n*this.blockSizeX + this.borderSize];
        this.boardCoordsY = [this.posY, this.posY + m*this.blockSizeY + this.borderSize];

        this.boardBlocks = [];
        this.collidedTetros = [];

        for (let i = 0; i < m; i++) {
            for(let j = 0; j < n; j++) {
                const block = {
                    posX : this.posX + j * this.blockSizeX,
                    posY : this.posY + i * this.blockSizeY,
                    filled : false
                };
                this.boardBlocks.push(block);
            };
        };
    }

    drawBoard(ctx) {
          
        //iterate through boardBlocks and render each block and its border, based on its established position
        for(let i = 0; i < this.boardBlocks.length; i++) {
            
            let {posX, posY} = this.boardBlocks[i];
            
            const borderStyle = "rgba(219,219,219,.4)";
            const blockStyle = "#6d6d6e";

            this.drawBlock(ctx, borderStyle, blockStyle, posX, posY);

        };
    }

    drawCollidedTetros(ctx) {
        for (let i = 0; i < this.collidedTetros.length; i++) {
            this.collidedTetros[i].draw(ctx);
        };
    }

    addTetroToCollided = (tetro) => this.collidedTetros.push(tetro);

    doBlocksCollide(firstBlockCoords, secondBlockCoords) {
        
        let doCollideOnXAxis = false;
        let doCollideOnYAxis = false;
        
        if (firstBlockCoords[0] === secondBlockCoords[0] && firstBlockCoords[0] + this.blockSizeX === secondBlockCoords[0] + this.blockSizeX) {
            doCollideOnXAxis = true;
        };

        if (firstBlockCoords[1] === secondBlockCoords[1] && firstBlockCoords[1] + this.blockSizeY === secondBlockCoords[1] + this.blockSizeY) {
            doCollideOnYAxis = true;
        };

        return doCollideOnXAxis && doCollideOnYAxis;
        
    }

    checkForCollisions(shape, posX, posY) {

        let updateDirectionX = true;
        let updateDirectionY = true;

        for (let i = 0; i < shape.length; i++) {

            if (shape[i] === "X") {

                const [blockPosX, blockPosY] = this.getBlockPosition(i, posX, posY);

                //check for collisions against board walls (left, right, ceiling)
                
                if (blockPosX < this.boardCoordsX[0] || blockPosX + this.blockSizeX + this.borderSize > this.boardCoordsX[1]) updateDirectionX = false;

                if (blockPosY + this.blockSizeY + this.borderSize > this.boardCoordsY[1]) return [updateDirectionX, updateDirectionY = false];

                //check for collisions against collided blocks
                for (let j = 0; j < this.collidedTetros.length; j++) {

                    const collidedTetro = this.collidedTetros[j];

                    for (let k = 0; k < collidedTetro.shape.length; k++) {

                        if (collidedTetro.shape[k] === "X") {
                            
                            const collidedBlockCoords = this.getBlockPosition(k, collidedTetro.posX, collidedTetro.posY);

                            const doCollide = this.doBlocksCollide([blockPosX, blockPosY], collidedBlockCoords);
                            
                            if (doCollide) {
                                updateDirectionX = false;
                                updateDirectionY = false;
                                return [updateDirectionX, updateDirectionY];
                            };
    
                        };
                        
                    };

                };

            };
        }
        return [updateDirectionX, updateDirectionY];
    };

    drawBlock(ctx, borderStyle, blockStyle, posX, posY) {

         //draw border
         ctx.fillStyle = borderStyle;
         ctx.fillRect(posX, posY, this.blockSizeX+this.borderSize, this.blockSizeY+this.borderSize);
         
         //draw block
         ctx.fillStyle = blockStyle;
         ctx.fillRect(posX+this.borderSize, posY+this.borderSize, this.blockSizeX-this.borderSize, this.blockSizeY-this.borderSize);
         
    };

    getBlockPosition(i, posX, posY) {
        
        const row = Math.floor(i / 4);
        const col = i % 4;

        const blockPosX = posX + col * this.blockSizeY;
        const blockPosY = posY + row * this.blockSizeX;

        return [blockPosX, blockPosY];
    }
}

export default Board;

