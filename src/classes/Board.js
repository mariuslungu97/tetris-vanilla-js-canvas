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
        // this.collidedBlocks = [];

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

