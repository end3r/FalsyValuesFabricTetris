function TetrisGame() {
	this.config = TetrisConfig();
    this.listeners = [];
	this.data = {};
    this.initWells(this.config.WELL.WIDTH,this.config.WELL.HEIGHT);
	this.config.blockSize = Math.min(fabricCanvas.width/this.well.width, fabricCanvas.height/this.well.height);
    this.data.nextTetromino = this.newNextTetromino();
    this.newTetromino();

	this.data.points = 0;
	this.data.pause = true;
}

TetrisGame.prototype = {
    listeners: null,
    well: null,
	nextWell: null,
    tetromino: null,
    data: {
    	timer: null,
    	points: 0,
		pause: false,
		nextTetromino: {}
	},

    newTetromino: function() {
		this.data.gameOver = false;
		var t = this.data.nextTetromino;
        this.data.nextTetromino = this.newNextTetromino();

        if (this.canPlaceInWell(t, t.x, t.y)) {
            this.tetromino = t;
			this.fabricRedraw(t);
	        this.notifyWellChanged();
        } else {
            this.tetromino = null;
			this.data.gameOver = true;
        }
    },

    newNextTetromino: function() {
        return Tetromino.getTetromino(Math.floor(Math.random()*6),0, Math.floor(Math.random()*(this.well.width-4)),0);
    },

    rotate: function() {
        var old_t = this.tetromino;
        var new_t = this.tetromino.rotated();
        if (this.tryPlacingRotated(new_t, old_t, 0) ||
            this.tryPlacingRotated(new_t, old_t, 1) ||
            this.tryPlacingRotated(new_t, old_t, -1) ||
            this.tryPlacingRotated(new_t, old_t, -2)) {
			
			this.fabricRedraw(new_t);	        
            this.notifyWellChanged();
        }
    },

    tryPlacingRotated: function(new_t, old_t, x) {
        if (this.canPlaceInWell(new_t, new_t.x+x, new_t.y) && (!x || this.canPlaceInWell(old_t, old_t.x+x, old_t.y))) {
            new_t.x += x;
            this.tetromino = new_t;
            return true;
        }
        return false;
    },

    move: function(direction) {
        if (this.canPlaceInWell(this.tetromino, this.tetromino.x+direction, this.tetromino.y)) {
            this.tetromino.x += direction;
            fabricCanvas.forEachObject(function(obj) { obj.left += this.game.config.blockSize*direction; });
            this.notifyWellChanged();
        }
    },

    drop: function() {
		if(!this.data.gameOver) {
			if (this.canPlaceInWell(this.tetromino, this.tetromino.x, this.tetromino.y + 1)) {
				this.tetromino.y += 1;
				fabricCanvas.forEachObject(function(obj) { obj.top += this.game.config.blockSize; });
				this.notifyWellChanged();
			} else {
				this.placeInWell(this.tetromino);
				this.newNextTetromino();
				this.newTetromino();
			}
		}
		else { // game over
			this.data.pause = true;
			this.tetromino = null;
			clearInterval(this.data.timer);
			this.gameOver('looser');
		}
    },

    addListener: function(callback) {
        this.listeners.push(callback);
    },

    canPlaceInWell: function(tetromino,x,y) {
        var blocks = tetromino.blocks;

        for(var i=0; i < blocks.length; i++) {
            for(var j=0; j < blocks[i].length; j++) {
                if (!blocks[i][j]) continue;

                // out of bounds
                if (y+i < 0 || x+j < 0) return false;
                if (y+i >= this.well.blocks.length) return false;
                if (x+j >= this.well.blocks[y+i].length) return false;

                // collision
                if (this.well.blocks[y+i][x+j]) return false;
            }
        }
        return true;
    },

    placeInWell: function(tetromino) {
        var blocks = tetromino.blocks;
        var x = tetromino.x, y = tetromino.y;

        for(var i=0; i < blocks.length; i++) {
            for(var j=0; j < blocks[i].length; j++) {
                if (blocks[i][j]) this.well.blocks[y+i][x+j] = blocks[i][j];
            }
        }

        this.clearWell();
    },

    clearWell: function() {
        var blocks = this.well.blocks;
        var write_y = blocks.length-1;
        for(var read_y=write_y; read_y >= 0; read_y--) {

            var full_line = true;
            for(var x=0; x < blocks[read_y].length; x++) {
                if (!blocks[read_y][x]) { full_line = false; break; }
            }
            blocks[write_y] = blocks[read_y];

            if (!full_line) {
				write_y--;
			}
			else { // add points
				this.data.points += this.config.POINTS_UNIT;
				var numID = (Math.ceil(this.data.points/this.config.POINTS_CHANGE)-1),
					face = document.getElementById('tetrisFace');
				face.innerHTML = '' +
					'<img src="./img/face_'+numID+'.png" alt="face" />' +
					'<h2>'+this.config.FACES.NAMES[numID]+'</h2>' +
					'<p>'+this.config.FACES.TITLES[numID]+'</p>' +
					'<a href="http://'+this.config.FACES.LINKS[numID]+'/">'+this.config.FACES.LINKS[numID]+'</a>';
				document.getElementById('tetrisPointsSpan').innerHTML = this.data.points;
				
				if(this.data.points == this.config.GOAL_POINTS) { // check if player wins
					this.data.pause = true;
					clearInterval(this.data.timer);
					this.gameOver('winner');
				}
			}
        }

        var width = blocks[0].length;
        while(write_y >= 0) {
            blocks[write_y] = [];
            for(var x=0; x < width; x++)
				blocks[write_y][x] = 0;
            write_y--;
        }
    },

    notifyWellChanged: function() {
        this.listeners.forEach(function(listener){
            listener();
        });
    },

    initWells: function(w,h) {
        this.well = {width:w, height:h, blocks:[]};
        for(var i=0; i < h; i++) {
            this.well.blocks[i] = []
            for(var j=0; j < w; j++) {
                this.well.blocks[i][j] = 0;
            }
        }
        this.nextWell = {blocks:[]};
        for(var i=0; i < 3; i++) {
            this.nextWell.blocks[i] = []
            for(var j=0; j < 4; j++) {
                this.nextWell.blocks[i][j] = 0;
            }
        }
    },
    
    fabricRedraw: function(tetromino) {
		fabricCanvas.forEachObject(function(obj) {
			fabricCanvas.remove(obj);
		});
		var blockSize = this.config.blockSize;
		var blocks = tetromino.blocks,
			x = tetromino.x,
			y = tetromino.y;
	
		for(var i=0; i < blocks.length; i++) {
			for(var j=0; j < blocks[i].length; j++) {
				if (!blocks[i][j]) continue;

				var rect = new fabric.Rect({
					top: blockSize*(y+i)+(blockSize/2),
					left: blockSize*(x+j)+(blockSize/2),
					width: blockSize,
					height: blockSize,
					fill: this.config.WELL.COLORS[blocks[i][j]]
				});
				fabricCanvas.add(rect);
			}
		}
    },

0:0};