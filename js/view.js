function TetrisView(canvas, game) {
    this.game = game;
	this.data = game.data;

	this.generateHTML();

	var nextCanvas = document.getElementById('nextTetrominoCanvas');
    this.blockSize = Math.min(canvas.width/game.well.width, canvas.height/game.well.height);
    this.ctx = canvas.getContext('2d');
    this.nextCtx = nextCanvas.getContext('2d');

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
			'<div id="tetrisNext"><h3>Next block:</h3>' +
				'<canvas id="nextTetrominoCanvas" width="72" height="54"></canvas>' +
			'</div>' +
			'<div id="tetrisInfo">' +
				'<h3>Game info:</h3>' +
				'<div id="tetrisPlay">Press <strong>[ENTER]</strong> to start!</div>' +
				'<div id="tetrisPoints">Points: <span id="tetrisPointsSpan">0</span></div>' +
			'</div>' +
			'<div id="tetrisControls">' +
				'<h3>Controls:</h3>' +
				'<p>Enter <span>start &frasl; pause</span></p>' +
				'<p>&uarr; <span>rotation</span></p>' +
				'<p>&larr; <span>move left</span></p>' +
				'<p>&rarr; <span>move right</span></p>' +
				'<p>&darr; <span>speed up</span></p>' +
			'</div>' +
			'<h1>Falsy <span>===</span> Values</h1>' +
			'<div id="tetrisFace">' +
				'<img src="./img/face_0.png" alt="face" />' +
				'<h2>'+this.game.config.FACES.NAMES[0] + '</h2>' +
				'<p>"'+this.game.config.FACES.TITLES[0]+'"</p>' +
				'<a href="http://'+this.game.config.FACES.LINKS[0]+'/">'+this.game.config.FACES.LINKS[0]+'</a>' +
			'</div>';
		document.getElementById('tetrisContainer').innerHTML = coreHTML;
    },
/*
    dialogBox: function(status) {
    	var message = '';
    	if(status == 'winner') message = '<p>You are the winner! Congratulations!</p>';
		else message = '<p>Awww... You lose!</p>';
		message += '<a href="./">Try again?</a>';

    	var dialogHTML = '<div id="tetrisBlackbox"></div>' + '<div id="tetrisDialog">'+message+'</div>';
    	var body = document.getElementsByTagName('body');
    	body[0].innerHTML += dialogHTML;
    },
*/
0:0};