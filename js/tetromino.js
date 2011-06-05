function Tetromino(blocks, x,y) {
    this.x = x; this.y = y;
    this.blocks = blocks;
}

Tetromino.prototype = {
    x:null,
    y:null,
    blockSize:null,

    rotated: function() {
        var old_height = this.blocks.length;
        var rotated = this.rotatedBlocks();
        var new_height = rotated.length;

        return new Tetromino(rotated, this.x, this.y - new_height + old_height);
    },

    rotatedBlocks: function() {
        var w = this.blocks[0].length;
        var h = this.blocks.length;

        var rotated = new Array(w);
        for(var i=0; i < h; i++) {
            for(var j=0; j < w; j++) {
                if (!rotated[w-1-j]) rotated[w-1-j] = []
                rotated[w-1-j][i] = this.blocks[i][j];
            }
        }
        return rotated;
    },

    blocks: null
};

Tetromino.tetrominos = [
    [[0,0,0,0],
     [1,1,1,1],
     [0,0,0,0]],

    [[0,0,0],
     [2,2,2],
     [0,0,2]],

    [[0,0,0],
     [3,3,3],
     [3,0,0]],

    [[4,4],
     [4,4]],

    [[0,5,5],
     [5,5,0]],

    [[0,0,0],
     [6,6,6],
     [0,6,0]],

    [[7,7,0],
     [0,7,7]],
];

Tetromino.getTetromino = function(num, rotation, x,y) {
    var t = new Tetromino(Tetromino.tetrominos[num], x,y);
    rotation = rotation%4;
    for(var i=0; i < rotation; i++) {
        t = t.rotated();
    }
    return t;
};