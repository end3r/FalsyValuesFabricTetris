function TetrisView(canvas, game) {
	//canvas = nextCanvas;
	this.generateHTML();

	//var canvas = document.getElementById('nextTetrominoCanvas');
    this.blockSize = Math.min(canvas.width/game.well.width, canvas.height/game.well.height);
    this.game = game;
    this.ctx = canvas.getContext('2d');
	this.data = game.data;

    var self = this;
    canvas.addEventListener('keydown', function(e) {self.keyHandler(e);}, false);
    canvas.addEventListener('focus', function(e) {self.focused = true; self.draw();}, false);
    canvas.addEventListener('blur', function(e) {self.focused = false; self.draw();}, false);

    this.game.addListener(function(){self.draw()});

    canvas.tabIndex = 0;
    canvas.focus();

    this.draw();
}

TetrisView.prototype = {
    ctx: null,
    game: null,
    focused: false,

    key: {
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
        ENTER: 13
    },

    keyHandler: function(e) {
        switch(e.keyCode) {
            case this.key.UP: {
            	if(!this.data.pause)
                	this.game.rotate();
                break;
            }
            case this.key.LEFT: {
            	if(!this.data.pause)
                this.game.move(-1);
                break;
            }
            case this.key.RIGHT: {
            	if(!this.data.pause)
                this.game.move(1);
                break;
            }
            case this.key.DOWN: {
            	if(!this.data.pause)
                this.game.drop();
                break;
            }
            case this.key.ENTER: {
				if(this.data.pause) { // unpause game
					this.data.pause = false;
					document.getElementById('tetrisPlay').innerHTML = 'Game status: <span>active</span>';
					this.data.timer = setInterval(function(){ this.game.drop(); }, this.data.speed);
				}
				else { // pause game
					this.data.pause = true;
					document.getElementById('tetrisPlay').innerHTML = 'Game status: <span>pause</span>';
					clearInterval(this.data.timer);
				}
            	break;
            }
            default: { return; }
        }
        e.preventDefault();
    },

    wellColors: ['#111111', '#0000ff', '#ffa500', '#ffff00', '#00ff00', '#aa00ff', '#ff0000' ],

    draw: function() {
        this.drawBlocks(this.game.well.blocks,0,0, false);
        this.drawBlocks(this.game.tetromino.blocks, this.game.tetromino.x, this.game.tetromino.y, true);
    },

    drawBlocks: function(blocks, x,y, skipzero) {
        var blockSize = this.blockSize;

        for(var i=0; i < blocks.length; i++) {
            for(var j=0; j < blocks[i].length; j++) {
                if (skipzero && !blocks[i][j]) continue;

                this.ctx.fillStyle = this.wellColors[blocks[i][j]];
                this.ctx.fillRect(blockSize*(x+j), blockSize*(y+i), blockSize-1, blockSize-1);
            }
        }
    },
    
    generateHTML: function() {
		var coreHTML = '' +
			'<canvas id="nextTetrominoCanvas" width="80" height="80"></canvas>' +
			'<div class="tetrisBackground" id="tetrisBackground" style="background: url(./img/booklet_12.jpg) no-repeat"></div>' +
			'<div class="tetrisInfo">' +
				'<div class="tetrisPlay" id="tetrisPlay">Press [ENTER] to start</div>' +
				'<div class="tetrisPoints">Points: <span id="tetrisPointsSpan">0</span></div>' +
			'</div>' +
			'<div class="tetrisControls">' +
				'<p>Controls:</p></p>&nbsp;</p>' +
				'<p>Enter - start &frasl; pause</p>' +
				'<p>&uarr; &nbsp;&nbsp; - rotation</p>' +
				'<p>&larr; &nbsp; - move left</p>' +
				'<p>&rarr; &nbsp; - move right</p>' +
				'<p>&darr; &nbsp;&nbsp; - speed up</p>' +
			'</div>';
		document.getElementById('tetrisContainer').innerHTML = coreHTML;
    },

0:0};