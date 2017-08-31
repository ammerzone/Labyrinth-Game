/** 
* Create game canvas
* 
* @return 	void
* @see 		gameCreate()
*/
var gameCreate = function(){
	
	// Create canvas
	gameCanvas = document.createElement('canvas');
	gameCanvas.setAttribute('id', 'canvas-map');
	gameContext = gameCanvas.getContext('2d');
	
	// Set canvas size
	gameCanvas.width = window.innerWidth;
	gameCanvas.height = window.innerHeight;
	
	// Set canvas settings
	gameContext.font = 			'20pt Arial';
	gameContext.textAlign = 	'left'; 
	gameContext.strokeStyle = 	'#000000';
	gameContext.fillStyle = 	'#CCCCCC';
	gameContext.lineWidth = 	1;
	
	// Add canvas to html
	$('div#game-canvas').append(gameCanvas);
};

/** 
* Set game defaults
* 
* @return 	void
* @see 		gameDefaults()
*/
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
	
	// Get map values from database
	$.ajax({
		type: 		'post', 
		url: 		'ajax/getMap.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: gameId
		}, 
		cache: 		false,
        async: 		false
	}).done(function(data){
		
		// Check if request was successfull
		if('status' in data){
			if(data.status === false){
				return;
			}
		}
		
		if('size' in data){
			if('x' in data.size){
				
				// Override map x-size
				map.size.x = data.size.x;
			}
			
			if('y' in data.size){
				
				// Override map y-size
				map.size.y = data.size.y;
			}
			
			delete data.size;
		}
		
		if('start' in data){
			/*if('char' in data.start){
				
				// Override map start character
				map.start.char = data.start.char;
			}*/
			
			if('x' in data.start){
				// Override map start x-position
				map.start.x = data.start.x;
			}
			
			if('y' in data.start){
				// Override map start y-position
				map.start.y = data.start.y;
			}
			
			delete data.start;
		}
		
		if('end' in data){
			/*if('char' in data.end){
				
				// Override map end character
				map.end.char = data.end.char;
			}*/
			
			if('x' in data.end){
				
				// Override map end x-position
				map.end.x = data.end.x;
			}
			
			if('y' in data.end){
				
				// Override map end y-position
				map.end.y = data.end.y;
			}
			
			delete data.end;
		}
		
		// Ovewrride map field data
		map.field = data;
	});
	
	// Get player values from database
	$.ajax({
		type: 		'post', 
		url: 		'ajax/getPlayer.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: gameId
		}, 
		cache: 		false,
        async: 		false
	}).done(function(data){
		if('name' in data){
			
			// Override character name
			character.name = data.name
		}
		
		if('position' in data){
			if('x' in data.position){
				
				// Override character x-position
				character.position.x = data.position.x;
			}
			
			if('y' in data.position){
				
				// Override character y-position
				character.position.y = data.position.y;
			}
		}
		
		if('settings' in data){
			if('sound' in data.settings){
				
				// Override sound-settings
				character.settings.sound = data.settings.sound;
			}
			
			if('effects' in data.settings){
				
				// Override effects-settings
				character.settings.effects = data.settings.effects;
			}
			
			if('help' in data.settings){
				
				// Override help-settings
				character.settings.help = data.settings.help;
			}
		}
		
		if('stats' in data){
			if('speed' in data.stats){
				
				// Override player speed
				character.stats.speed = data.stats.speed;
			}
			
			if('atk' in data.stats){
				
				// Override player atk
				character.stats.atk = data.stats.atk;
			}
			
			if('def' in data.stats){
				
				// Override player def
				character.stats.def = data.stats.def;
			}
			
			if('tp' in data.stats){
				
				// Override player tp
				character.stats.tp = data.stats.tp;
			}
			
			if('maxTp' in data.stats){
				
				// Override player maxTp
				character.stats.maxTp = data.stats.maxTp;
			}
			
			if('exp' in data.stats){
				
				// Override player exp
				character.stats.exp = data.stats.exp;
			}
			
			if('lvl' in data.stats){
				
				// Override player lvl
				character.stats.lvl = data.stats.lvl;
			}
			
			if('gold' in data.stats){
				
				// Override player gold
				character.stats.gold = data.stats.gold;
			}
		}
		
		if('equiped' in data){
			if('sword' in data.equiped){
				
				// Override equiped sword
				character.equiped.sword = data.equiped.sword;
			}
			
			if('shield' in data.equiped){
				
				// Override equiped shield
				character.equiped.shield = data.equiped.shield;
			}
			
			if('armour' in data.equiped){
				
				// Override equiped armour
				character.equiped.armour = data.equiped.armour;
			}
		}
		
		if('items' in data){
				
			// Override player items
			character.items = data.items;
		}
	});
	
	// Set actual position to start position
	xPos = map.start.x;
	yPos = map.start.y;
	
	// Soundtrack (enable / disable)
	if(character.settings.sound === 'on'){
		gameAudio.soundtrack.muted = false;
	}else if(character.settings.sound === 'off'){
		gameAudio.soundtrack.muted = true;
	}
};

/** 
* Game canvas update
* 
* @fires 	gameDefaults()
* @return 	void
* @see 		gameUpdate()
*/
var gameUpdate = function(){
	updates = false;
	updateCounter++;
	
	// Get defaults
	$.when(gameDefaults()).done(function(){
		
		// Overwrite default values with update data from database
		$.ajax({
			type: 		'post', 
			url: 		'ajax/gameUpdate.ajax.php', 
			dataType: 	'json', 
			data: 		{
				session: gameId
			}, 
			cache: 		false,
			async: 		false,
			success: 	function(data){
				if(data.status === true){
					
				}else{
					//alert(JSON.stringify(data));
				}
			}, 
			error: 		function(data){
				//alert(JSON.stringify(data));
			}
		});
	});
};

/** 
* Positionate actual position and running
* 
* @return 	void
* @see 		gamePositionate()
*/
var gamePositionate = function(modifier){
	
	/* RUNNING */
		isRunning = false;
		
		// Check that no help event is active
		if(helpEvent === null){
			// Run up
			if(input.isDown('UP') || input.isDown('w') || mobileMoving === 'up'){
				isRunning = 	true;
				runDirection = 	'up';
				
				map.y -= character.stats.speed * modifier;
			}
			
			// Run left
			if(input.isDown('LEFT') || input.isDown('a') || mobileMoving === 'left'){
				isRunning = 	true;
				runDirection = 	'left';
				
				map.x -= character.stats.speed * modifier;
			}
			
			// Run down
			if(input.isDown('DOWN') || input.isDown('s') || mobileMoving === 'down'){
				isRunning = 	true;
				runDirection = 	'down';
				
				map.y += character.stats.speed * modifier;
			}
			
			// Run right
			if(input.isDown('RIGHT') || input.isDown('d') || mobileMoving === 'right'){
				isRunning = 	true;
				runDirection = 	'right';
				
				map.x += character.stats.speed * modifier;
			}
		}
	/* END RUNNING */
	
	/* CALIBRATE KOORDINATES AND POSITION */
		
		// Change y-position (up)
		if(map.y < -256 - (0.5 * 64)){
			
			// Check if not wall -> walkable
			if(getType(xPos, (+yPos - +1)) != 'wall'){
				
				// Change coordnate and reset position
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
				
				// Change coordnate and reset position
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
				
				// Change coordnate and reset position
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
				
				// Change coordnate and reset position
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

/** 
* Draw game canvas
* 
* @fires 	getTexture()
* @fires 	getType()
* @fires 	hasItem()
* @fires 	itemSprite()
* @fires 	hasMonster()
* @fires 	monsterSprite()
* @return 	void
* @see 		gameRender()
*/
var gameRender = function(){
	renderCounter++;
	
	// Clear canvas
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
					
					// Get field texture
					var texture = map.field[i + ':' + j].texture;
				}
				
				if('type' in map.field[i + ':' + j]){
					
					// Get field type
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
			
			// Load field image
			mapImage[i][j].src = srcfile;
			
			// Draw field image
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
			
			// Check if current field has item
			if(hasItem(i, j) != false && hasItem(i, j) != 'false'){
				
				// Check if current field has item canvas
				if(typeof itemCanvas[i + ':' + j] === 'undefined'){ 
				
					// Create item canvas
					itemCanvas[i + ':' + j] = itemSprite({
						id: 'item-animation-' + i + '-' + j
					});
					
					// Positionate item canvas
					itemCanvas[i + ':' + j].positionate(
						- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256), 
						- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256)
					);
					
					itemCanvas[i + ':' + j].render();
					itemCanvas[i + ':' + j].loop();
				}else{
					
					// Positionate item canvas
					itemCanvas[i + ':' + j].positionate(
						- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256), 
						- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256)
					);
				}
			}else{
				
				// Check if current field has item canvas
				if(typeof itemCanvas[i + ':' + j] != 'undefined'){ 
				
					// Delete item canvas
					itemCanvas[i + ':' + j].delete();
					itemCanvas.splice(i + ':' + j);
					
					$('#item-animation-' + i + '-' + j).detach();
				}
			}
			
			// Check if current field has monster
			if(hasMonster(i, j) != false && hasMonster(i, j) != 'false'){
				
				// Check if current field has monster canvas
				if(typeof monsterCanvas[i + ':' + j] === 'undefined'){ 
				
					// Create monster canvas
					monsterCanvas[i + ':' + j] = monsterSprite({
						id: 		'monster-animation-' + i + '-' + j, 
						monster: 	hasMonster(i, j)
					});
					
					// Positionate monster canvas
					monsterCanvas[i + ':' + j].positionate(
						- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256), 
						- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256)
					);
					
					monsterCanvas[i + ':' + j].render();
					monsterCanvas[i + ':' + j].loop();
				}else{
					
					// Positionate monster canvas
					monsterCanvas[i + ':' + j].positionate(
						- map.x + ((i - xPos) * 512 + (gameCanvas.width / 2) - 256), 
						- map.y + ((j - yPos) * 512 + (gameCanvas.height / 2) - 256)
					);
				}
			}else{
				
				// Check if current field has monster canvas
				if(typeof monsterCanvas[i + ':' + j] != 'undefined'){ 
				
					// Delete monster canvas
					monsterCanvas[i + ':' + j].delete();
					monsterCanvas.splice(i + ':' + j);
					
					$('#monster-animation-' + i + '-' + j).detach();
				}
			}
			
			x++;
		}
		
		y++;
	}
};

/**
* Initialize game actions
* 
* @fires 	hasMonster()
* @fires 	battleMonster()
* @fires 	hasItem()
* @fires 	collectItem()
* @fires 	isEnd()
* @fires 	createMap()
* @fires 	gameActionListener()
* @return 	void
* @see 		gameAction()
*/
var gameAction = function(){
	
	// Check if position is in collect radius vector (100px)
	if(Math.sqrt(
		Math.pow(parseInt(map.x) - parseInt(xPos), 2) + 
		Math.pow(parseInt(map.y) - parseInt(yPos), 2)
	) <= 100){
		
		// Check if monster
		if(hasMonster(xPos, yPos)){
			
			// Check if help is on
			if(character.settings.help === 'on'){
				if(helpEvent != 'open'){
					
					// Update help event
					helpEvent = 'monster';
				}
				
				// Reset render counter
				renderCounter = 1;
			}else{
				if(helpEvent != 'open'){
					
					// Update help event
					helpEvent = 'open';
					
					// Start battle
					battleMonster(xPos, yPos);
				}
			}
		}
		
		// Check if item
		if(hasItem(xPos, yPos)){
			
			// Check if help is on
			if(character.settings.help === 'on'){
				if(helpEvent != 'open'){
					helpEvent = 'item';
				}
				
				// Reset render counter
				renderCounter = 1;
			}else{
				if(helpEvent != 'open'){
					
					// Update help event
					helpEvent = 'open';
					
					// Collect item
					collectItem(xPos, yPos);
				}
			}
		}
		
		// Check if end
		if(isEnd(xPos, yPos)){
			
			// Check if help is on
			if(character.settings.help === 'on'){
				if(helpEvent != 'open'){
					helpEvent = 'end';
				}
				
				// Reset render counter
				renderCounter = 1;
			}else{
				if(helpEvent != 'open'){
					
					// Update help event
					helpEvent = 'open';
					
					// Create new map
					createMap();
				}
			}
		}
	}
	
	// Check if render counter is here for first time
	if(renderCounter <= 1){
		
		// Add action listener
		gameActionListener(xPos, yPos);
	}
}

/**
* Main function for game canvas
* 
* @fires 	gameUpdate()
* @fires 	gamePositionate()
* @fires 	gameRender()
* @fires 	gameAction()
* @return 	void
* @see 		heroMain()
*/
var gameMain = function(){
	var tick = Date.now();
	
	gameCanvas.width = window.innerWidth;
	gameCanvas.height = window.innerHeight;
	
	// Check if changements
	if(updates === true){
		
		// Reset render counter
		renderCounter = 0;
		
		gameUpdate();
		
		if(character.settings.help === 'off'){
			
			// Unset help event
			helpEvent = null;
		}
	}
	
	// Positionate game
	$.when(gamePositionate((tick - gameTick) / 1000)).done(function(){
		gameRender();
		gameAction();
		
		// Update timestamp
		gameTick = tick;
		
		// Reload this function
		requestAnimationFrame(gameMain);
	});
};

/**
* Initialize game actions when activated
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	void
* @see 		gameActionListener()
*/
function gameActionListener(x, y){
	
	// Check if help is turned on
	if(character.settings.help === 'on'){
		
		// Check if no active help event is open
		if(helpEvent != null && helpEvent != 'open'){
			var helpFile = 'view/help/';
			
			// Get event
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
			
			helpFile += '.inc.php?x=' + xPos + '&y=' + yPos;
			
			// Add loading spinner to help event window
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
			
			// Show help event window
			$('#game-help-background').show();
			$('#game-help').show();
			
			// Load content into help event window
			$('#game-help').load(helpFile, function(){
				$('#game-help').hide();
				
				$('#game-help').slideDown(400);
			});
			
			// Update help event
			helpEvent = 'open';
		}
	}
}

/**
* Get the texture of a field
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	integer
* @see 		getTexture()
*/
function getTexture(x, y){
	
	// Check if field exists
	if(typeof map.field[x + ':' + y] != 'undefined'){
		
		// Check if field has texture
		if('texture' in map.field[x + ':' + y]){
			return map.field[x + ':' + y].texture;
		}
	}
	
	return 0;
}

/**
* Get the type of a field
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	string
* @see 		getType()
*/
function getType(x, y){
	
	// Check if field exists
	if(typeof map.field[x + ':' + y] != 'undefined'){
		
		// Check if field has type
		if('type' in map.field[x + ':' + y]){
			return map.field[x + ':' + y].type;
		}
	}
	
	return 'wall';
}

/**
* Check if position has an item
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	string
* @return 	boolean
* @see 		hasItem()
*/
function hasItem(x, y){
	
	// Check if field exists
	if(typeof map.field[x + ':' + y] != 'undefined'){
		
		// Check if field has item
		if('item' in map.field[x + ':' + y]){
			if(map.field[x + ':' + y].item.length > 0){
				return map.field[x + ':' + y].item;
			}
		}
	}
	
	return false;
}

/**
* Check if position has a monster
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	string
* @return 	boolean
* @see 		hasMonster()
*/
function hasMonster(x, y){
	
	// Check if field exists
	if(typeof map.field[x + ':' + y] != 'undefined'){
		
		// Check if field has monster
		if('monster' in map.field[x + ':' + y]){
			if(map.field[x + ':' + y].monster.length > 0){
				return map.field[x + ':' + y].monster;
			}
		}
	}
	
	return false;
}

/**
* Check if position is end position
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	boolean
* @see 		isEnd()
*/
function isEnd(x, y){
	
	// Check if field exists
	if(typeof map.field[x + ':' + y] != 'undefined'){
		
		// Check if field has type
		if('type' in map.field[x + ':' + y]){
			return (map.field[x + ':' + y].type === 'end');
		}
	}
	
	return false;
}
