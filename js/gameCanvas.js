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
	//KOORDINATEN UND POSITION NEU DEFINIEREN
	if(map.y < -256){
		map.y += 512;
		yPos--;
		
		// check if monster
		// check if item
	}
	
	if(map.y > 256){
		map.y -= 512;
		yPos++;
		
		// check if monster
		// check if item
	}
	
	if(map.x < -256){
		map.x += 512;
		xPos--;
		
		// check if monster
		// check if item
	}
	
	if(map.x > 256){
		map.x -= 512;
		xPos++;
		
		// check if monster
		// check if item
	}
	
	//RUN
	isRunning = false;
	
	if(input.isDown('UP') || input.isDown('w')){
		isRunning = 	true;
		runDirection = 	'up';
		
		/*
		var tmp = new Image;
		
		var verschiebung = Math.round(yPos - (map.y + (character.stats.speed * modifier)) / 512);
		
		var texture = map.field[xPos + ':' + ((map.y>=0)?(yPos):(verschiebung))].texture;
		var type = map.field[xPos + ':' + ((map.y>=0)?(yPos):(verschiebung))].type;
		
		tmp.src = 'media/img/map/image.php?main=' + texture + '&type=' + type; 
		if(tmp.complete){
			map.y -= (character.stats.speed * modifier);
		}
		*/
		map.y -= (character.stats.speed * modifier);
	}
	if(input.isDown('LEFT') || input.isDown('a')){
		isRunning = 	true;
		runDirection = 	'left';
		
		/*
		var tmp = new Image;
		
		var verschiebung = Math.round(xPos - (map.x + (character.stats.speed * modifier)) / 512);
		
		tmp.src = "media/img/map/["+((map.x>=0)?(xPos):(verschiebung))+"]["+yPos+"].png"; 
		if(tmp.complete){
			map.x -= character.stats.speed * modifier;
		}
		*/
		map.x -= character.stats.speed * modifier;
	}
	if(input.isDown('DOWN') || input.isDown('s')){
		isRunning = 	true;
		runDirection = 	'down';
		
		/*
		var tmp = new Image;
		
		var verschiebung = Math.floor(yPos + (map.y + (character.stats.speed * modifier)) / 256);
		
		tmp.src = "media/img/map/["+xPos+"]["+((map.y>=0)?(verschiebung):(yPos))+"].png"; 
		if(tmp.complete){
			map.y += character.stats.speed * modifier;
		}
		*/
		map.y += character.stats.speed * modifier;
	}
	if(input.isDown('RIGHT') || input.isDown('d')){
		isRunning = 	true;
		runDirection = 	'right';
		
		/*
		var tmp = new Image;
		
		var verschiebung = Math.floor(xPos + (map.x + (character.speed * modifier)) / 256);
		
		tmp.src = "media/img/map/["+((map.x>=0)?(verschiebung):(xPos))+"]["+yPos+"].png";
		if(tmp.complete){
			map.x += character.stats.speed * modifier;
		}
		*/
		map.x += character.stats.speed * modifier;
	}
}

var gameRender = function(){
	renderCounter++;
	
	gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
	gameContext.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
	
	// Load Map
	var x=0, 
		y=0;
	
	var mapImage = new Array();
	for(i = ((xPos >= 2) ? (xPos - 2) : 0); (i - 2) <= xPos; i++){
		x=0;
		
		mapImage[i] = new Array();
		
		for(j = ((yPos >= 2) ? (yPos - 2) : 0); (j - 2) <= yPos; j++){
			mapImage[i][j] = new Image();
			
			var texture = '0';
			var type = 'ground';
			
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
			x++;
		}
		y++;
	}
	
	if(renderCounter <= 1){
		gameActionListener();
	}
};

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
		
		gameTick = tick;
		requestAnimationFrame(gameMain);
	});
};


function gameActionListener(){
	if(character.settings.help === 'on'){
		if(helpEvent != ''){
			var helpFile = 'view/help/';
			
			switch(helpEvent){
				case 'start': 
					helpFile += 'start'; 
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
			
			helpEvent = '';
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