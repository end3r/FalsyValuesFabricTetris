function TetrisView(canvas, game) {
    this.game = game;
	this.data = game.data;
	this.game.gameOver = this.gameOver;
	this.generateHTML();

	var nextCanvas = document.getElementById('nextTetrominoCanvas'),
		page = document.getElementsByTagName('html')[0];

    this.ctx = canvas.getContext('2d');
    this.nextCtx = nextCanvas.getContext('2d');

    var self = this;
	page.addEventListener('keydown', function(e) {self.keyHandler(e);}, false);
    this.game.addListener(function(){
    	self.draw();
    	fabricCanvas.renderAll();
    });

    canvas.tabIndex = 0;
    canvas.focus();
    this.draw();
    this.fabricInit = true;
}

TetrisView.prototype = {
    ctx: null,
	nextCtx: null,
    game: null,

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
					document.getElementById('tetrisPlay').innerHTML = 'Game status: <span><strong>[PAUSE]</strong></span>';
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
        if(!this.fabricInit) {
        	this.fabricInit = false;
			this.drawFabricBlocks(this.game.tetromino.blocks, this.game.tetromino.x, this.game.tetromino.y);
        }
		this.drawBlocks(this.nextCtx, this.data.nextTetromino.blocks,0,0, true);
    },

    drawBlocks: function(context, blocks, x,y, skipzero) {
        var blockSize = this.game.config.blockSize;

        for(var i=0; i < blocks.length; i++) {
            for(var j=0; j < blocks[i].length; j++) {
                if (skipzero && !blocks[i][j]) continue;

                context.fillStyle = this.game.config.WELL.COLORS[blocks[i][j]];
                context.fillRect(blockSize*(x+j), blockSize*(y+i), blockSize-1, blockSize-1);
            }
        }
    },

    drawFabricBlocks: function(blocks,x,y) {
        var blockSize = this.game.config.blockSize;

        for(var i=0; i < blocks.length; i++) {
            for(var j=0; j < blocks[i].length; j++) {
                if (!blocks[i][j]) continue;

				var rect = new fabric.Rect({
					top: blockSize*(y+i)+(blockSize/2),
					left: blockSize*(x+j)+(blockSize/2),
					width: blockSize,
					height: blockSize,
					fill: this.game.config.WELL.COLORS[blocks[i][j]]
				});
				fabricCanvas.add(rect);
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
			'<h1><a href="http://falsyvalues.com/">Falsy <span>===</span> Values</a></h1>' +
			'<div class="tetrisBox" id="tetrisFace">' +
				'<img src="./img/face_0.png" alt="face" />' +
				'<h2>'+this.game.config.FACES.NAMES[0] + '</h2>' +
				'<p>'+this.game.config.FACES.TITLES[0]+'</p>' +
				'<a href="http://'+this.game.config.FACES.LINKS[0]+'/">'+this.game.config.FACES.LINKS[0]+'</a>' +
			'</div>';
		document.getElementById('tetrisContainer').innerHTML = coreHTML;
    },

	gameOver: function(result) {
    	var message = '<img src="./img/logo.png" alt="Falsy Values logo" />' +
			'<h2>Falsy Values Fabric Tetris</h2>';
    	if(result == 'winner') {
			message += '<p> Congratulations, You won the game!</p>';
		}
		else {
			message += '<p>Sorry, You lost the game.</p>';
		}
		message += '<a href="">Try again?</a>';
    	var resultHTML = '<div id="tetrisBlackbox"></div>' + '<div class="tetrisBox" id="tetrisDialog">'+message+'</div>';
    	var body = document.getElementsByTagName('body')[0];
    	body.innerHTML += resultHTML;
	},
		
0:0};