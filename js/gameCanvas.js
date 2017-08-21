var gameCreate = function(){
	gameCanvas = document.createElement('canvas');
	gameCanvas.setAttribute('id', 'canvas-map');
	gameContext = gameCanvas.getContext('2d');
	
	gameCanvas.width = window.innerWidth;
	gameCanvas.height = window.innerHeight;
	
	gameContext.font = 			'20pt Arial';
	gameContext.textAlign = 	'left'; 
	gameContext.strokeStyle = 	'#000000';
	gameContext.fillStyle = 	'#CCCCCC';
	gameContext.lineWidth = 	1;

	$('div#game-canvas').append(gameCanvas);
	
	gameAudio.soundtrack = document.createElement('audio');
	
	gameAudio.soundtrack.setAttribute('id', 'game-audio-soundtrack');
	gameAudio.soundtrack.setAttribute('src', 'media/audio/map.mp3');
	
	gameAudio.soundtrack.autoplay = 	true;
	gameAudio.soundtrack.loop = 		true;
	gameAudio.soundtrack.muted = 		false;
	gameAudio.soundtrack.volume = 		0.15;
};

var gameDefaults = function(){
	updates = 	false;
	imgDir = 	'';
	img = 		{};
	map = {
		x: 0,
		y: 0,
		size: {
			x: 0, 
			y: 0
		}, 
		start: {
			x: 0, 
			y: 0 
		}, 
		end: {
			x: 0, 
			y: 0 
		},
		field: 		[], 
		monster: 	[], 
		items: 		[]
	};
	character = {
		name: '', 
		position: {
			x: map.start.x, 
			y: map.start.y 
		}, 
		image: {
			width: 		32,
			height: 	32
		}, 
		stats: {
			speed: 	100,
			atk: 	10, 
			def: 	10, 
			tp: 	100, 
			maxTp: 	100, 
			exp: 	0, 
			lvl: 	1, 
			gold: 	0
		}, 
		settings: {
			sound: 		'on',
			effects: 	'on',
			help: 		'on'
		},
		equiped: {
			sword: 		'',
			shield: 	'',
			armour: 	''
		}, 
		items: {}
	};
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/getMap.ajax.php', 
		dataType: 	'json', 
		cache: 		false,
        async: 		false
	}).done(function(data){
		if('status' in data){
			if(data.status === false){
				return;
			}
		}
		
		if('size' in data){
			if('x' in data.size)
				map.size.x = data.size.x;
			if('y' in data.size)
				map.size.y = data.size.y;
			
			delete data.size;
		}
		
		if('start' in data){
			//if('char' in data.start)
			//	map.start.char = data.start.char;
			if('x' in data.start)
				map.start.x = data.start.x;
			if('y' in data.start)
				map.start.y = data.start.y;
			
			delete data.start;
		}
		
		if('end' in data){
			//if('char' in data.end)
			//	map.end.char = data.end.char;
			if('x' in data.end)
				map.end.x = data.end.x;
			if('y' in data.end)
				map.end.y = data.end.y;
			
			delete data.end;
		}
		
		map.field = data;
	});
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/getPlayer.ajax.php', 
		dataType: 	'json', 
		cache: 		false,
        async: 		false
	}).done(function(data){
		if('name' in data){
			character.name = data.name
		}
		
		if('position' in data){
			if('x' in data.position){
				character.position.x = data.position.x;
			}
			
			if('y' in data.position){
				character.position.y = data.position.y;
			}
		}
		
		if('image' in data){
			if('width' in data.image){
				character.image.width = data.image.width;
			}
			if('height' in data.image){
				character.image.height = data.image.height;
			}
		}
		
		if('stats' in data){
			if('speed' in data.stats){
				character.stats.speed = data.stats.speed;
			}
			
			if('atk' in data.stats){
				character.stats.atk = data.stats.atk;
			}
			
			if('def' in data.stats){
				character.stats.def = data.stats.def;
			}
			
			if('tp' in data.stats){
				character.stats.tp = data.stats.tp;
			}
			
			if('maxTp' in data.stats){
				character.stats.maxTp = data.stats.maxTp;
			}
			
			if('exp' in data.stats){
				character.stats.exp = data.stats.exp;
			}
			
			if('lvl' in data.stats){
				character.stats.lvl = data.stats.lvl;
			}
			
			if('gold' in data.stats){
				character.stats.gold = data.stats.gold;
			}
		}
		
		if('equiped' in data){
			if('sword' in data.equiped){
				character.equiped.sword = data.equiped.sword;
			}
			
			if('shield' in data.equiped){
				character.equiped.shield = data.equiped.shield;
			}
			
			if('armour' in data.equiped){
				character.equiped.armour = data.equiped.armour;
			}
		}
		
		if('items' in data){
			character.items = data.items;
		}
	});
	
	xPos = map.start.x;//character.position.x;
	yPos = map.start.y;//character.position.y;
};

var gameUpdate = function(){
	updates = false;
	updateCounter++;
	
	$.when(gameDefaults()).done(function(){
		$.ajax({
			type: 'post', 
			url: 'ajax/gameUpdate.ajax.php', 
			dataType: 'json', 
			cache: false,
			data: {}, 
			success: function(data){
				if(data.status === true){
					
				}else{
					//alert(JSON.stringify(data));
				}
			}, 
			error: function(data){
				//alert(JSON.stringify(data));
			}
		});
	});
};

var gamePositionate = function(modifier){
	/* RUNNING */
		isRunning = false;
		
		// Run up
		if(input.isDown('UP') || input.isDown('w')){
			isRunning = 	true;
			runDirection = 	'up';
			
			map.y -= (character.stats.speed * modifier);
		}
		
		// Run left
		if(input.isDown('LEFT') || input.isDown('a')){
			isRunning = 	true;
			runDirection = 	'left';
			
			map.x -= character.stats.speed * modifier;
		}
		
		// Run down
		if(input.isDown('DOWN') || input.isDown('s')){
			isRunning = 	true;
			runDirection = 	'down';
			
			map.y += character.stats.speed * modifier;
		}
		
		// Run right
		if(input.isDown('RIGHT') || input.isDown('d')){
			isRunning = 	true;
			runDirection = 	'right';
			
			map.x += character.stats.speed * modifier;
		}
	/* END RUNNING */
	
	/* CALIBRATE KOORDINATES AND POSITION */
		// Change y-position (up)
		if(map.y < -256 - (0.5 * 64)){
			// Check if not wall -> walkable
			if(getType(xPos, (+yPos - +1)) != 'wall'){
				map.y += 512;
				yPos--;
			}else{
				// Texture (256px) + 0.5 * Texture transition (64px)
				if(map.y <= -256 - (0.5 * 64)){
					map.y = -256 - (0.5 * 64);
				}
			}
		}
		
		// Change y-position (down)
		if(map.y > 256 - (0.5 * 64)){
			// Check if not wall -> walkable
			if(getType(xPos, (+yPos + +1)) != 'wall'){
				map.y -= 512;
				yPos++;
			}else{
				// Texture (256px) + 0.5 * Texture transition (64px)
				if(map.y >= 256 - (0.5 * 64)){
					map.y = 256 - (0.5 * 64);
				}
			}
		}
		
		// Change x-position (left)
		if(map.x < -256 - (0.5 * 64)){
			// Check if not wall -> walkable
			if(getType((+xPos - +1), yPos) != 'wall'){
				map.x += 512;
				xPos--;
			}else{
				// Texture (256px) + 0.5 * Texture transition (64px)
				if(map.x <= -256 - (0.5 * 64)){
					map.x = -256 - (0.5 * 64);
				}
			}
		}
		
		// Change x-position (right)
		if(map.x > 256 - (0.5 * 64)){
			// Check if not wall -> walkable
			if(getType((+xPos + +1), yPos) != 'wall'){
				map.x -= 512;
				xPos++;
			}else{
				// Texture (256px) + 0.5 * Texture transition (64px)
				if(map.x >= 256 - (0.5 * 64)){
					map.x = 256 - (0.5 * 64);
				}
			}
		}
	/* END CALIBRATION */
}

var gameRender = function(){
	renderCounter++;
	
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	
	var x=0, 
		y=0;
	
	var mapImage = new Array();
	
	mapImage['monster'] = 	new Array();
	mapImage['item'] = 		new Array();
	
	for(i = (xPos - 2); (i - 2) <= xPos; i++){
		x=0;
		
		mapImage[i] = 				new Array();
		mapImage['monster'][i] = 	new Array();
		mapImage['item'][i] = 		new Array();
		
		for(j = (yPos - 2); (j - 2) <= yPos; j++){
			mapImage[i][j] = new Image();
			
			var texture = '0';
			var type = 'wall';
			
			if(typeof map.field[i + ':' + j] != 'undefined'){
				if('texture' in map.field[i + ':' + j]){
					var texture = map.field[i + ':' + j].texture;
				}
				
				if('type' in map.field[i + ':' + j]){
					var type = map.field[i + ':' + j].type;
				}
			}
			
			var srcfile = 'media/img/map/image.php';
			srcfile += '?main=' + texture;
			srcfile += '&type=' + type;
			srcfile += '&borderRight=' + getTexture(i + 1, j);
			srcfile += '&borderRightType=' + getType(i + 1, j);
			srcfile += '&borderBottom=' + getTexture(i, j + 1);
			srcfile += '&borderBottomType=' + getType(i, j + 1);
			
			mapImage[i][j].src = srcfile;
			
			gameContext.drawImage(
				mapImage[i][j], 
				0, 
				0, 
				512, 
				512, 
				- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256), 
				- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256), 
				512,
				512
			);
			
			
			if(hasItem(i, j) != false && hasItem(i, j) != 'false'){
				mapImage['item'][i][j] = new Image();
				
				//mapImage['item'][i][j].src = 'media/img/item/' + hasItem(i, j) + '.png';
				
				gameContext.beginPath();
				gameContext.fillStyle = 'blue';
				gameContext.arc(
					- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256) + (512 / 2), 
					- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256) + (512 / 2), 
					100, 
					0,
					2 * Math.PI
				);
				gameContext.fill();
				/*
				gameContext.drawImage(
					mapImage[i][j], 
					0, 
					0, 
					512, 
					512, 
					- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256) + ((512 - 200) / 2), 
					- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256) + ((512 - 200) / 2), 
					200,
					200
				);
				*/
			}
			
			if(hasMonster(i, j) != false && hasMonster(i, j) != 'false'){
				mapImage['monster'][i][j] = new Image();
				
				//mapImage['monster'][i][j].src = 'media/img/monster/' + hasItem(i, j) + '.png';
				
				gameContext.beginPath();
				gameContext.fillStyle = 'red';
				gameContext.arc(
					- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256) + (512 / 2), 
					- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256) + (512 / 2), 
					100, 
					0,
					2 * Math.PI
				);
				gameContext.fill();
			}
			
			x++;
		}
		y++;
	}
};

var gameAction = function(){
	// Get collect radius
	if(Math.sqrt(
		Math.pow(parseInt(map.x) - parseInt(xPos), 2) + 
		Math.pow(parseInt(map.y) - parseInt(yPos), 2)
	) <= 100){ 
		// Check if monster
		if(hasMonster(xPos, yPos)){
			if(helpEvent != 'open'){
				helpEvent = 'monster';
			}
			
			renderCounter = 1;
		}
		
		// Check if item
		if(hasItem(xPos, yPos)){
			if(helpEvent != 'open'){
				helpEvent = 'item';
			}
			
			renderCounter = 1;
		}
		
		// Check if end
		if(isEnd(xPos, yPos)){
			if(helpEvent != 'open'){
				helpEvent = 'end';
			}
			
			renderCounter = 1;
		}
	}
	
	// Add action listener
	if(renderCounter <= 1){
		gameActionListener();
	}
}

var gameMain = function(){
	var tick = Date.now();
	
	gameCanvas.width = window.innerWidth;
	gameCanvas.height = window.innerHeight;
	
	//if changements
	if(updates === true){
		renderCounter = 0;
		
		gameUpdate();
	}
	
	$.when(gamePositionate((tick - gameTick) / 1000)).done(function(){
		gameRender();
		gameAction();
		
		gameTick = tick;
		requestAnimationFrame(gameMain);
	});
};

function gameActionListener(){
	if(character.settings.help === 'on'){
		if(helpEvent != null && helpEvent != 'open'){
			var helpFile = 'view/help/';
			
			switch(helpEvent){
				case 'start': 
					helpFile += 'start'; 
					break;
				case 'item': 
					helpFile += 'item'; 
					break;
				case 'monster': 
					helpFile += 'monster'; 
					break;
				case 'end': 
					helpFile += 'end'; 
					break;
				default: 
					helpFile += 'start'; 
					break;
			}
			
			helpFile += '.inc.php';
			
			$('#game-help').html(
				'<div class="loadingSpinner-circle">' + 
					'<div class="loadingSpinner-circle1 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle2 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle3 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle4 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle5 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle6 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle7 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle8 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle9 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle10 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle11 loadingSpinner-child"></div>' + 
					'<div class="loadingSpinner-circle12 loadingSpinner-child"></div>' + 
				'</div>'
			);
			
			$('#game-help-background').show();
			$('#game-help').show();
			
			$('#game-help').load(helpFile, function(){
				$('#game-help').hide();
				
				$('#game-help').slideDown(400);
			});
			
			helpEvent = 'open';
		}
	}
}

function getTexture(x, y){
	if(typeof map.field[x + ':' + y] != 'undefined'){
		if('texture' in map.field[x + ':' + y]){
			return map.field[x + ':' + y].texture;
		}
	}
	
	return 0;
}

function getType(x, y){
	if(typeof map.field[x + ':' + y] != 'undefined'){
		if('type' in map.field[x + ':' + y]){
			return map.field[x + ':' + y].type;
		}
	}
	
	return 'wall';
}

function hasItem(x, y){
	if(typeof map.field[x + ':' + y] != 'undefined'){
		if('item' in map.field[x + ':' + y]){
			if(map.field[x + ':' + y].item.length > 0){
				return map.field[x + ':' + y].item;
			}
		}
	}
	
	return false;
}

function hasMonster(x, y){
	if(typeof map.field[x + ':' + y] != 'undefined'){
		if('monster' in map.field[x + ':' + y]){
			if(map.field[x + ':' + y].monster.length > 0){
				return map.field[x + ':' + y].monster;
			}
		}
	}
	
	return false;
}

function isEnd(x, y){
	
}
