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

    markTetroAsFilled(tetro) {
        for (let i = 0; i < tetro.shape.length; i++) {
            if (tetro.shape[i] === "X") {

                const blockIndex = this.getBlockIndex(i, tetro.posX, tetro.posY);
                this.markBlockAsFilled(blockIndex);

            };
        };
    };

    getBlockIndex(i, posX, posY) {
        
        const [blockPosX, blockPosY] = this.getBlockPosition(i, posX, posY);

        const row = Math.floor((blockPosY - this.posY) / this.blockSizeY);
        const col = Math.floor((blockPosX - this.posX) / this.blockSizeX);
        
        return row  * this.n + col;
    };

    markBlockAsFilled(index) {
        const block = {...this.boardBlocks[index]};
        block.filled = true;

        this.boardBlocks[index] = block;
    };

    drawBoard(ctx) {
        
        const emptyBorderStyle = "rgba(219,219,219,.4)";
        const emptyBlockStyle = "#6d6d6e";

        const collidedBorderStyle = "rgba(0,44,133,1)";
        const collidedBlockStyle = "#023eb5";

        //iterate through boardBlocks and render each block and its border, based on its established position
        for(let i = 0; i < this.boardBlocks.length; i++) {
            
            let {posX, posY} = this.boardBlocks[i];
            const isFilled = this.boardBlocks[i].filled;
            
            if (isFilled) {
                this.drawBlock(ctx, collidedBorderStyle, collidedBlockStyle, posX, posY);
            } else {
                this.drawBlock(ctx, emptyBorderStyle, emptyBlockStyle, posX, posY);
            };

        };
    }

    renderBoardInConsole(board) {

        let line = "";

        for (let i = 0; i < this.m; i++) {
            
            for (let j = 0; j < this.n; j++) {
                line += board[i * this.n + j].filled ? "X" : "-";
            };

            line += "\n";
        };
        
        console.log(line);
    };


    updateBoardBlocks(completedRows) {

        if (completedRows.length === 0) return;
        
        for (let i = 0; i < completedRows.length; i++) {

            //create deep copy
            let newBoardBlocks = JSON.parse(JSON.stringify(this.boardBlocks));

            const completedRowIndex = completedRows[i];

            let row = 0;
            let col = 0;

            for (let j = 0; j < completedRowIndex; j++) {

                newBoardBlocks[(row + 1) * this.n + col].filled = this.boardBlocks[row * this.n + col].filled;

                //update row and col
                if ((j + 1) % this.n === 0) {
                    row++;
                    col = 0;
                } else {
                    col++;
                }
            };

            this.boardBlocks = newBoardBlocks;

        };
    };

    checkForCompletedRows() {

        const completedRows = [];

        for (let i = 0; i < this.boardBlocks.length; i += this.n) {

            const row = this.boardBlocks.slice(i, i + this.n);
            let count = 0;

            row.forEach(block => {
                if (block.filled === true) count++;
            });

            if (count === this.n) completedRows.push(i);
        };
        return completedRows;
    };

    addTetroToCollided = (tetro) => {
        this.markTetroAsFilled(tetro);
        this.collidedTetros.push(tetro);
    };

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

                //get the block index relative to the board, and check if that block is already filled
                const blockIndex = this.getBlockIndex(i, posX, posY);

                if (this.boardBlocks[blockIndex].filled) {
                    updateDirectionX = false;
                    updateDirectionY = false;
                    return [updateDirectionX, updateDirectionY];
                };
            };
        };

        return [updateDirectionX, updateDirectionY];
    };

    drawBlock(ctx, borderStyle, blockStyle, posX, posY) {

         //draw border
         ctx.fillStyle = borderStyle;
         ctx.fillRect(posX, posY, this.blockSizeX + this.borderSize, this.blockSizeY + this.borderSize);
         
         //draw block
         ctx.fillStyle = blockStyle;
         ctx.fillRect(posX+this.borderSize, posY+this.borderSize, this.blockSizeX-this.borderSize, this.blockSizeY-this.borderSize);
         
    };

    getBlockPosition(i, posX, posY) {
        //get each block position, based on its index and its belonging tetro posX and posY
        //assumes that all tetros have a 4x4 structure
        const row = Math.floor(i / 4);
        const col = i % 4;

        const blockPosX = posX + col * this.blockSizeY;
        const blockPosY = posY + row * this.blockSizeX;

        return [blockPosX, blockPosY];
    }
}

export default Board;

