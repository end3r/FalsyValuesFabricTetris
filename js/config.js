function TetrisConfig() {
	var conf = {
		GAME_SPEED: 500,
		GOAL_POINTS: 700,
		POINTS_UNIT: 10,
		POINTS_CHANGE: 50,
		WELL: {
			WIDTH: 10,
			HEIGHT: 20,
			COLORS: [
				'#333333',
				'#FEB1D3',
				'#7DB72F',
				'#F16C7C',
				'#00ADEE',
				'#ED1C24',
				'#FAA51A'
			]
		},
		KEYS: {
			UP: 38,
			DOWN: 40,
			LEFT: 37,
			RIGHT: 39,
			ENTER: 13
		},
		FACES: {
			NAMES: [
				'Douglas Crockford',
				'Tantek Çelik',
				'Juriy "kangax" Zaytsev',
				'Tom Hughes-Croucher',
				'Dmitry Soshnikov',
				'Brian LeRoux',
				'Andrea Giammarchi',
				'Christian Johansen',
				'Damian "ferrante" Wielgosik',
				'Kornel "porneL" Lesiński',
				'Peter "kuvos" van der Zee',
				'Zbigniew Braniecki',
				'Michał Budzyński',
				'Radek Litman'
			],
			TITLES: [
				'Styling for Success',
				'CASSIS Project',
				'Fabric.js - building a canvas library',
				'Node.js',
				'ECMAScript 6',
				'PhoneGap and Cordova',
				'ECMAScript 5',
				'TDD / JavaScript testing',
				'Introduction to JavaScript',
				'Game Development',
				'Game Development',
				'Javascript compilation',
				'Desktop applications with Javascript',
				'Desktop applications with Javascript',
			],
			LINKS: [
				'crockford.com',
				'tantek.com',
				'perfectionkills.com',
				'kid666.com',
				'dmitrysoshnikov.com',
				'westcoastlogic.com',
				'webreflection.blogspot.com',
				'cjohansen.no',
				'varjs.com',
				'pornel.net',
				'qfox.nl',
				'',
				'michalbe.blogspot.com',
				'dev.gg.pl',
			]
		}	
	};
	return conf;
};