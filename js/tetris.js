function tetrisGame(id) {
		var self = this;

		self.removeClasses = function(className) {
			var board = document.getElementById('tetrisBoard');
			var p = board.getElementsByTagName('p');
			for (i = 0; i < p.length; i++) {
				if(p[i].className == className)
					p[i].className = '';
			}
		};
		
		self.dom = {
			core: null,
			board: null,
			timer: null,
			points: null,
			next: null,
			nextBoard: null,
			controls: null,
			play: null
		};
		self.data = {
			boardWidth: 10,
			boardHeight: 20,
			nextBoardWidth: 4,
			nextBoardHeight: 2,
			counter: 0,
			points: 0,
			goal: 500,
			pause: false,
			defaultSpeed: 500,
			fastSpeed: 20,
			actualSpeed: 0,
			element: [],
			elementCount: 4,
			board: [],
			nextBoard: [],
			obj: {
				id: 0,
				item: 0,
				shift: { x: 0, y: 0 },
				len: [3,3,3,3,3,4,2],
				block: [
					[ [ [1,3],[2,1],[2,2],[2,3] ], [ [1,1],[1,2],[2,2],[3,2] ], [ [2,1],[2,2],[2,3],[3,1] ], [ [1,2],[2,2],[3,2],[3,3] ] ],
					[ [ [1,1],[2,1],[2,2],[2,3] ], [ [1,2],[2,2],[3,1],[3,2] ], [ [2,1],[2,2],[2,3],[3,3] ], [ [1,2],[1,3],[2,2],[3,2] ] ],
					[ [ [1,2],[2,1],[2,2],[2,3] ], [ [1,2],[2,1],[2,2],[3,2] ], [ [2,1],[2,2],[2,3],[3,2] ], [ [1,2],[2,2],[2,3],[3,2] ] ],
					[ [ [1,2],[1,3],[2,1],[2,2] ], [ [1,2],[2,2],[2,3],[3,3] ] ],
					[ [ [1,1],[1,2],[2,2],[2,3] ], [ [1,3],[2,2],[2,3],[3,2] ] ],
					[ [ [2,1],[2,2],[2,3],[2,4] ], [ [1,2],[2,2],[3,2],[4,2] ] ],
					[ [ [1,1],[1,2],[2,1],[2,2] ] ]]
			},
			storage: []
		};

		self.init = function(){
			self.dom.core = document.getElementById(id);
			var core = '';
			console.log('init: '+id);
		//	self.dom.bg = document.createElement('div');
		//		self.dom.bg.className = 'tetrisBackground';
		//		self.dom.bg.style.background = 'url(./img/booklet_12.jpg) no-repeat';
			self.dom.bg = '<div class="tetrisBackground" id="tetrisBackground" style="background: url(./img/booklet_12.jpg) no-repeat">';

		//	self.dom.info = document.createElement('div');
		//		self.dom.info.className = 'tetrisInfo';
			self.dom.info = '<div class="tetrisInfo">';

		//	self.dom.board = document.createElement('div');
		//		self.dom.board.className = 'tetrisBoard';
		//		self.dom.board.style.width = 16*self.data.boardWidth;
			self.dom.board = '<div class="tetrisBoard" id="tetrisBoard" style="width: '+16*self.data.boardWidth+'px;">';

		//	self.dom.points = document.createElement('div');
		//		self.dom.points.className = 'tetrisPoints';
		//		self.dom.points.innerHTML = 'Punkty: <span>0</span>';
			self.dom.points = '<div class="tetrisPoints">Punkty: <span id="tetrisPointsSpan">0</span>';

		//	self.dom.next = document.createElement('div');
		//		self.dom.next.className = 'tetrisNext';
		//		self.dom.next.innerHTML = 'Następny klocek:';
			self.dom.next = '<div class="tetrisNext">Następny klocek:';

		//	self.dom.nextBoard = document.createElement('div');
		//		self.dom.nextBoard.className = 'tetrisNextBoard';
		//		self.dom.nextBoard.style.width = 16*self.data.nextBoardWidth;
			self.dom.nextBoard = '<div class="tetrisNextBoard" id="tetrisNextBoard" style="width: '+16*self.data.nextBoardWidth+'px;">';
			
			self.dom.next += self.dom.nextBoard;
			self.dom.next += '</div>';
			var controlString = '<p>Sterowanie:</p></p>&nbsp;</p>' +
				'<p>Enter - start &frasl; pauza</p>' +
				'<p>&uarr; &nbsp;&nbsp; - obrót klocka</p>' +
				'<p>&larr; &nbsp; - ruch w lewo</p>' +
				'<p>&rarr; &nbsp; - ruch w prawo</p>' +
				'<p>&darr; &nbsp;&nbsp; - przyspieszenie</p>';

		//	self.dom.controls = document.createElement('div');
		//		self.dom.controls.className = 'tetrisControls';
		//		self.dom.controls.innerHTML = controlString;
			self.dom.controls = '<div class="tetrisControls">'+controlString;

		//	self.dom.play = document.createElement('div');
		//		self.dom.play.className = 'tetrisPlay';
		//		self.dom.play.innerHTML = 'Stan gry: <span>pauza</span>';
			self.dom.play = '<div class="tetrisPlay">Stan gry: <span>pauza</span>';

			self.dom.play.toggle = function(trigger) {
				if(trigger == 'on') {
					self.dom.play = '<div class="tetrisPlay">Stan gry: <span>aktywna</span></div>';
					self.data.pause = false;
					self.data.timer = setTimeout(function(){ self.renderChange() }, self.data.actualSpeed);
				}
				else { // trigger == off
					self.dom.play = '<div class="tetrisPlay">Stan gry: <span>pauza</span></div>';
					self.data.pause = true;
					clearTimeout(self.data.timer);
				}
			};

			for(var i=1; i<=self.data.boardHeight; i++) {
				self.data.board[i] = [];
				for(var j=1; j<=self.data.boardWidth; j++) {
					self.data.board[i][j] = 0;
					self.dom.board += '<p id="board_'+i+'_'+j+'"></p>';
				}
			};
			self.dom.board += '<div class="clear"></div>';

			self.data.actualSpeed = self.data.defaultSpeed;
			core += self.dom.bg;
			core += '</div>';
			self.dom.info += self.dom.play;
			self.dom.info += '</div>';
			self.dom.info += self.dom.points;
			self.dom.info += '</div>';
			core += self.dom.info;
			core += '</div>';
			core += self.dom.board;
			core += '</div>';
			core += self.dom.next;
			core += '</div>';
			core += self.dom.controls;
			core += '</div>';
			core += '<div class="clear"></div>';
			
			self.dom.core.innerHTML = core;

			self.createNewElement();
			self.createNewElement();
			self.showNewElement();
			self.showNextElement();
			self.data.pause = true;
			clearTimeout(self.data.timer);
			
			document.onkeypress = function(event){
				switch(event.keyCode) {
					case 37: { // left arrow = move left
						event.preventDefault();
						if(!self.data.pause)
							self.moveElement('left');
						break;
					}
					case 39: { // right arrow = move right
						event.preventDefault();
						if(!self.data.pause)
							self.moveElement('right');
						break;
					}
					case 40: { // down arrow = accelerate
						event.preventDefault();
						if(!self.data.pause) {
							self.data.actualSpeed = self.data.fastSpeed;
						}
						break;
					}
					case 13: { // enter = pause
						event.preventDefault();
						if(self.data.pause) { // unpause game
							self.data.pause = false;
							self.dom.play.innerHTML = 'Stan gry: <span>aktywna</span>';
							self.data.timer = setTimeout(function(){ self.renderChange() }, self.data.actualSpeed);
						}
						else { // pause game
							self.data.pause = true;
							self.dom.play.innerHTML = 'Stan gry: <span>pauza</span>';
							clearTimeout(self.data.timer);
						}
						break;
					}
					case 38: { // up arrow = rotate
						event.preventDefault();
						if(!self.data.pause)
							self.rotateElement();
						break;
					}
					default: {}
				}
			};

		//	$(document).unbind('keyup').bind('keyup',function(event){
		//		if(event.keyCode == 40)
		//			self.data.actualSpeed = self.data.defaultSpeed;
		//	});
			document.onkeyup = function(event){
				if(event.keyCode == 40)
					self.data.actualSpeed = self.data.defaultSpeed;
			}
		};

		self.createNewElement = function() {
			self.data.actualSpeed = self.data.defaultSpeed;
			var newObj = {};
			newObj.id = 0;
			newObj.block = self.data.obj.block;
			newObj.len = self.data.obj.len;
			newObj.shift = self.data.obj.shift;
			var newItem = Math.floor(Math.random() * 7);			
			var new_block = self.data.obj.block[newItem][0];
			newObj.item = newItem;
			newObj.shift.x = 0;
			newObj.shift.y = Math.floor ( ( Math.floor ( self.data.boardWidth - newObj.len[newObj.item] ) / 2 ) );
			newObj.element = [];
			for (var i = 0; i < self.data.elementCount; i++) {
				newObj.element[i] = {};
				newObj.element[i].x = new_block[i][0] + newObj.shift.x;
				newObj.element[i].y = new_block[i][1] + newObj.shift.y;
			}
			self.data.storage.push(newObj);
		};
		
		self.showNewElement = function() {
			var gameOver = false;
			self.data.obj = self.data.storage.shift();
			self.data.element = self.data.obj.element;
			for (var i = 0; i < self.data.elementCount; i++) {
				var new_x = self.data.element[i].x;
				var new_y = self.data.element[i].y;
				if(self.data.board[new_x][new_y] == 2) {
					gameOver = true; }
				self.data.board[new_x][new_y] = 1;
				self.dom.boardElement = document.getElementById('board_'+new_x+'_'+new_y);
					self.dom.boardElement.className = 'tetrisElement';
			}
			if(gameOver) {
				alert('KONIEC, przegrałeś!');
				self.data.pause = true;
				clearTimeout(self.data.timer);
				self.init();
			}
			else {
				self.data.timer = setTimeout(function(){ self.renderChange() }, self.data.actualSpeed);
			}
		};
		
		self.showNextElement = function() {
			//self.dom.nextBoard.innerHTML = '';
			var nextBoard = '';
			for(var i=1; i<=self.data.nextBoardHeight; i++) {
				self.data.nextBoard[i] = [];
				for(var j=1; j<=self.data.nextBoardWidth; j++) {
					self.data.nextBoard[i][j] = 0;
					nextBoard += '<p id="nextBoard_'+i+'_'+j+'"></p>';
				}
			}
			nextBoard += '<div class="clear"></div>';
			self.dom.nextBoard = document.getElementById('tetrisNextBoard');
			self.dom.nextBoard.innerHTML = nextBoard;

			//document.getElementById('tetrisNext').innerHTML += self.dom.nextBoard.innerHTML;
			var nextObj = self.data.storage[0];
			var nextElement = nextObj.element;
			for(var i = 0; i < self.data.elementCount; i++) {
				var next_x = nextElement[i].x - nextObj.shift.x;
				var next_y = nextElement[i].y - nextObj.shift.y;
				self.dom.nextBoardElement = document.getElementById('nextBoard_'+next_x+'_'+next_y);
					self.dom.nextBoardElement.className = 'tetrisElement';
			}
			//alert(JSON.stringify(self.dom.nextBoard.innerHTML));
		};
		
		self.renderChange = function() {
			self.removeClasses('tetrisElement');
			var wallHit = false;
			for (var i = 0; i < self.data.elementCount; i++) {
				var x = self.data.element[i].x;
				var y = self.data.element[i].y;
				var new_x = x+1;
				if (new_x > self.data.boardHeight || self.data.board[new_x][y] == 2) {
					wallHit = true; break;
				}
			}
			if(wallHit) {
				for (var i = 0; i < self.data.elementCount; i++) {
					var x = self.data.element[i].x;
					var y = self.data.element[i].y;
					self.data.board[x][y] = 2;
					self.dom.boardElement = document.getElementById('board_' + (x) + '_' + y);
						self.dom.boardElement.className = 'tetrisWall';
				}
			} else {
				for (var i = 0; i < self.data.elementCount; i++) {
					var x = self.data.element[i].x;
					var y = self.data.element[i].y;
					var new_x = ++self.data.element[i].x;
					self.data.board[x][y] = 0;
					self.data.board[new_x][y] = 1;
					self.dom.boardElement = document.getElementById('board_'+new_x+'_'+y);
						self.dom.boardElement.className = 'tetrisElement';
				}
			}
			if(wallHit) {
				self.checkLevel();
				self.createNewElement();
				self.showNewElement();
				self.showNextElement();
			} else {
				self.data.obj.shift.x++;
				self.data.timer = setTimeout(function(){ self.renderChange() }, self.data.actualSpeed);
			}
		};
		
		self.moveElement = function(direction) {
			var wallHit = false;
			switch(direction) {
				case 'left': { var dir = -1; self.data.obj.shift.y--; break; }
				case 'right': { var dir = 1; self.data.obj.shift.y++; break; }
				default: {}
			}
			for (var i = 0; i < self.data.elementCount; i++) {
				var x = self.data.element[i].x;
				var y = self.data.element[i].y;
				var new_y = y+dir;
				if (new_y < 1 || new_y > self.data.boardWidth || self.data.board[x][new_y] == 2) {
					wallHit = true; break;
				}
			}
			if(!wallHit) {
				self.removeClasses('tetrisElement');
				for (var i = 0; i < self.data.elementCount; i++) {
					var x = self.data.element[i].x;
					var y = self.data.element[i].y;
					self.data.element[i].y += dir;
					var new_y = self.data.element[i].y;
					self.data.board[x][y] = 0;
					self.data.board[x][new_y] = 1;
					self.dom.boardElement = document.getElementById('board_'+x+'_'+new_y);
						self.dom.boardElement.className = 'tetrisElement';
				}
			}
			else {
				self.data.obj.id = (--self.data.obj.id)%self.data.obj.block[self.data.obj.item].length;
				switch(direction) {
					case 'left': { var dir = -1; self.data.obj.shift.y++; break; }
					case 'right': { var dir = 1; self.data.obj.shift.y--; break; }
					default: {}
				}
			}
		};
		
		self.rotateElement = function() {
			array = self.data.element;
			self.removeClasses('tetrisElement');
			self.data.obj.id = (++self.data.obj.id)%self.data.obj.block[self.data.obj.item].length;
			var rotated_block = self.data.obj.block[self.data.obj.item][self.data.obj.id];
			var new_array = [];
			for (var i = 0; i < self.data.elementCount; i++) {
				new_array[i] = {};
				new_array[i].x = rotated_block[i][0] + self.data.obj.shift.x;
				new_array[i].y = rotated_block[i][1] + self.data.obj.shift.y;
			}
			var wall = false;
			for(var i = 0; i < self.data.elementCount; i++) {
				if(new_array[i].y < 1 || new_array[i].x < 0 || new_array[i].y > self.data.boardWidth || self.data.board[new_array[i].y][new_array[i].x] == 2) {
					wall = true; break;
				}
			}
			if(!wall) {
				for(var i = 0; i < self.data.elementCount; i++) {
					array[i].x = new_array[i].x;
					array[i].y = new_array[i].y;
					self.dom.boardElement = document.getElementById('board_'+array[i].x+'_'+array[i].y);
						self.dom.boardElement.className = 'tetrisElement';
					self.data.element = array;
				}
			}
			else {
				for(var i = 0; i < self.data.elementCount; i++) {
					self.dom.boardElement = document.getElementById('board_'+array[i].x+'_'+array[i].y);
						self.dom.boardElement.className = 'tetrisElement';
				}
			}
		};
		
		self.checkLevel = function() {
			for(var height = self.data.boardHeight; height>0; height--) {
				var levelCount = 0;
				for(var cc=1; cc<=self.data.boardWidth; cc++) {
					if(self.data.board[height][cc] == 2) {
						levelCount++;
					}
				}
				if(levelCount == self.data.boardWidth) {
					self.data.points+=10;
					var bg = document.getElementById('tetrisBackground');
						bg.style.background = 'url(./img/booklet_'+(Math.ceil(self.data.points/50))+'.jpg) no-repeat';
					var points = document.getElementById('tetrisPointsSpan');
						points.innerHTML = self.data.points;
					if(self.data.points == self.data.goal) {
						self.data.pause = true;
						clearTimeout(self.data.timer);
						alert('Wygrałeś, gratulacje!');
					}
					for (var w = 1; w <= self.data.boardWidth; w++) {
						self.data.board[height][w] = 0;
						var wall = document.getElementById('board_'+height+'_'+w);
						if(wall.className == 'tetrisWall')
							wall.className = '';
					}
					for(var h = height; h >= 1; h--) {
						for(var w = self.data.boardWidth; w >= 1; w--) {
							var wall = document.getElementById('board_'+h+'_'+w);
							var new_h = h+1;
							if(wall.className == 'tetrisWall') {
								wall.className = '';
								self.data.board[h][w] = 0;
								self.data.board[new_h][w] = 2;
								var wall = document.getElementById('board_'+new_h+'_'+w);
									wall.className = 'tetrisWall';
							}
						}
					}
					self.checkLevel();
				}
			}
		};
	};
new tetrisGame('tetrisContainer').init();