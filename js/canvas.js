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
	
	$('body').append('<div id="game-battleground"><div class="content"></div></div>');
	
	$('#game-battleground').css({
		position: 			'fixed',
		left: 				'0px',
		top: 				'0px',
		width: 				'100%',
		height: 			'100%',
		overflow: 			'auto',
		backgroundColor: 	'rgba(0, 0, 0, 0.8)', 
		zIndex: 			'20', 
		textAlign: 			'center',
		paddingTop: 		'50vh', 
		display: 			'none'
	});
	
	$('#game-battleground .content').css({
			width: 			'50vw', 
			minWidth: 		'300px', 
			margin: 		'auto', 
		    marginTop: 		'-20vh',
			height: 		'40vh',
			background: 	'#DDDDDD',
			padding: 		'0px',
			border: 		'2px solid #DDDDDD',
			borderRadius: 	'5px', 
		overflow: 			'auto'
	});
	
	$('#game-battleground .content').html(
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
	
	// Open battle window
	$('#game-battleground').fadeIn(400);
	
	// Load battle
	$('#game-battleground .content').load('view/popup/battle.inc.php?x=' + x + '&y=' + y + '&monster=' + monster, function(){
		$('#game-battleground .content').hide();
		$('#game-battleground .content').slideDown(400);
	});
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
		async: 		false
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
	
	location.reload();
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
		
		$('#game-navigation #actTp').closest('.progress').find('.progress-bar').attr('aria-valuenow', data.stats.tp);
		$('#game-navigation #actTp').closest('.progress').find('.progress-bar').attr('aria-valuemax', data.stats.maxTp);
		$('#game-navigation #actTp').closest('.progress').find('.progress-bar').css({
			width: ((data.stats.tp / data.stats.maxTp) * 100) + '%'
		});
	});
	
	setTimeout(function(){
		actualizeStatusBar();
	}, 250);
}