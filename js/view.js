function TetrisView(canvas, game) {
	this.generateHTML();

	var nextCanvas = document.getElementById('nextTetrominoCanvas');
    this.blockSize = Math.min(canvas.width/game.well.width, canvas.height/game.well.height);
	//nextCanvas.style.width = this.blocksize*4;
	//nextCanvas.style.height = this.blocksize*4;
    this.game = game;
    this.ctx = canvas.getContext('2d');
    this.nextCtx = nextCanvas.getContext('2d');
	this.data = game.data;
	//this.game.data = {}; /* ... */

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

    keyHandler: function(e) {
        switch(e.keyCode) {
            case this.game.config.KEYS.UP: {
            	if(!this.data.pause)
                	this.game.rotate();
                break;
            }
            case this.game.config.KEYS.LEFT: {
            	if(!this.data.pause)
                this.game.move(-1);
                break;
            }
            case this.game.config.KEYS.RIGHT: {
            	if(!this.data.pause)
                this.game.move(1);
                break;
            }
            case this.game.config.KEYS.DOWN: {
            	if(!this.data.pause)
                this.game.drop();
                break;
            }
            case this.game.config.KEYS.ENTER: {
				if(this.data.pause) { // unpause game
					this.data.pause = false;
					document.getElementById('tetrisPlay').innerHTML = 'Game status: <span>active</span>';
					this.data.timer = setInterval(function(){ this.game.drop(); }, this.game.config.GAME_SPEED);
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

    draw: function() {
        this.drawBlocks(this.ctx, this.game.well.blocks,0,0, false);
        this.drawBlocks(this.nextCtx, this.game.nextWell.blocks,0,0, false);
        this.drawBlocks(this.ctx, this.game.tetromino.blocks, this.game.tetromino.x, this.game.tetromino.y, true);
        this.drawBlocks(this.nextCtx, this.data.nextTetromino.blocks,0,0, true);
    },

    drawBlocks: function(context, blocks, x,y, skipzero) {
        var blockSize = this.blockSize;

        for(var i=0; i < blocks.length; i++) {
            for(var j=0; j < blocks[i].length; j++) {
                if (skipzero && !blocks[i][j]) continue;

                context.fillStyle = this.game.config.WELL.COLORS[blocks[i][j]];
                context.fillRect(blockSize*(x+j), blockSize*(y+i), blockSize-1, blockSize-1);
            }
        }
    },
    
    generateHTML: function() {
		var coreHTML = '' +
			'<p>Next block:</p>' +
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