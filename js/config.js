function TetrisConfig() {
	var conf = {
		GAME_SPEED: 500,
		GOAL_POINTS: 500,
		POINTS_UNIT: 10,
		WELL: {
			WIDTH: 10,
			HEIGHT: 20,
			COLORS: [
				'#111111',
				'#0000ff',
				'#ffa500',
				'#ffff00',
				'#00ff00',
				'#aa00ff',
				'#ff0000'
			]
		},
		KEYS: {
			UP: 38,
			DOWN: 40,
			LEFT: 37,
			RIGHT: 39,
			ENTER: 13
		}
	};
	return conf;
};