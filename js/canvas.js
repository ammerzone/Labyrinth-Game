var gameCanvas, 
	gameContext, 
	heroCanvas, 
	heroContext, 
	updates, 
	imgDir, 
	img, 
	renderCounter = 0, 
	updateCounter = 0, 
	map,
	character, 
	xPos, 
	yPos, 
	inputKey, 
	isRunning = 	false,
	runDirection = 	'down', 
	helpEvent = 	null, 
	heroImage, 
	heroOffsetX = 	0, 
	heroOffsetY = 	0, 
	gameTick = 		Date.now(), 
	gameAudio = 	loadAudios(), 
	monsterCanvas = [], 
	itemCanvas = 	[];

requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
window.addEventListener('load', eventWindowLoaded, false); 

function eventWindowLoaded(){
	$(function(){
		gameAudio.soundtrack = document.createElement('audio');
		
		gameAudio.soundtrack.setAttribute('id', 'game-audio-soundtrack');
		gameAudio.soundtrack.setAttribute('src', 'media/audio/map.mp3');
		
		gameAudio.soundtrack.autoplay = 	true;
		gameAudio.soundtrack.loop = 		true;
		gameAudio.soundtrack.muted = 		false;
		gameAudio.soundtrack.volume = 		0.15;
		
		updates = true;
		
		inputKey;
		
		helpEvent = 'start';
		
		canvasFire();
		
		actualizeStatusBar();
	});
}

function canvasFire(){
	gameCreate();
	heroCreate();
	
	heroMain();
	gameMain();
}

function loadAudios(){
	return {
		soundtrack: 	{}, 
		running: 		{},
		hitting: 		{}, 
		defending: 		{}, 
		dying: 			{}, 
		collecting: 	{}, 
		monster: 		{}
	};
}

function battleMonster(x, y){
	var monster = hasMonster(x, y);
	
	// open battle window
	// load...
	// loop:
		// i hit monster -> monster hp down
		// monster hit me -> my hp down
		// if: monster hp <= 0 -> win (break loop)
		// if: my hp <= 0 -> lose (break loop)
	// if won: popup with button -> delete monster, add exp, add gold
	// if lost: popup with button -> save to highscore, reset hero stats and equip and items, create map
	// close battle window
	
	
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/saveHighscore.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: gameId
		}, 
		cache: 		false,
		async: 		false
	});
	
	helpEvent = null;
}

function collectItem(x, y){
	var item = hasItem(x, y);
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/collectItem.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: 	gameId, 
			x: 			x, 
			y: 			y, 
			item: 		item
		}, 
		cache: 		false,
        async: 		false,   
	}).done(function(data){
		if(data.status === true){
			map.field[xPos + ':' + yPos].item = '';
			
			$('body').append('<div class="item-collect-callback">' + data.message + '</div>');
			
			$('.item-collect-callback').css({
				position: 	'fixed', 
				width: 		'100%', 
				left: 		'0px', 
				textAlign: 	'center',
				top: 		'40vh', 
				fontSize: 	'22px', 
				fontWeight: '900',
				color: 		'#222222', 
				textShadow: '-1px 0 #DDDDDD, 0 1px #DDDDDD, 1px 0 #DDDDDD, 0 -1px #DDDDDD', 
				display: 	'none'
			});
			
			$('.item-collect-callback').fadeIn(400, function(){
				setTimeout(function(){
					$('.item-collect-callback').animate(
						{
							top: '-' + $('.item-collect-callback').height() + 'px'
						}, 
						400, 
						function(){
							$('.item-collect-callback').detach();
						}
					)
				}, 1000);
			});
		}
	});
	
	helpEvent = null;
}

function createMap(){
	updates = true;
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/deleteMap.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: gameId
		}, 
		cache: 		false,
		async: 		false
	});
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/levelUp.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: gameId
		}, 
		cache: 		false,
		async: 		false,
		//success: 	function(data){alert(JSON.stringify(data));}
	});
	
	$.ajax({
		type: 		'post', 
		url: 		'ajax/saveHighscore.ajax.php', 
		dataType: 	'json', 
		data: 		{
			session: gameId
		}, 
		cache: 		false,
		async: 		false
	});
	
	gameAudio = loadAudios();
	$('audio').detach();
	$('canvas').detach();
	$('#game-canvas').children().detach();
	
	canvasFire();
	
	helpEvent = null;
}

function actualizeStatusBar(){
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
		$('#game-navigation #lvl').html(data.stats.lvl);
		$('#game-navigation #gold').html(data.stats.gold);
		$('#game-navigation #actEXP').html(data.stats.exp);
		$('#game-navigation #actTP').html(data.stats.tp);
		$('#game-navigation #maxTP').html(data.stats.maxTp);
	});
	
	setTimeout(function(){
		actualizeStatusBar();
	}, 250);
}