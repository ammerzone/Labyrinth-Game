/* GLOBAL VARIABLES */
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
/* END GLOBAL VARIABLES */

// Animation event listener
requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
window.addEventListener('load', eventWindowLoaded, false); 

/** 
* Initialize procedure when loaded
* 
* @fires 	canvasFire()
* @fires 	actualizeStatusBar()
* @return 	void
* @see 		eventWindowLoaded()
*/
function eventWindowLoaded(){
	$(function(){
		
		// Init game soundtrack
		gameAudio.soundtrack = document.createElement('audio');
		
		gameAudio.soundtrack.setAttribute('id', 'game-audio-soundtrack');
		gameAudio.soundtrack.setAttribute('src', 'media/audio/map.mp3');
		
		// Set game soundtrack options
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

/** 
* Fires Canvas 
* 
* @fires 	gameCreate()
* @fires 	heroCreate()
* @fires 	heroMain()
* @fires 	gameMain()
* @return 	void
* @see 		canvasFire()
*/
function canvasFire(){
	gameCreate();
	heroCreate();
	
	heroMain();
	gameMain();
}


/** 
* Init game audio
* 
* @return 	array
* @see 		loadAudios()
*/
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

/**
* Battle against a monster
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	void
* @see 		battleMonster()
*/
function battleMonster(x, y){
	
	// Get monster
	var monster = hasMonster(x, y);
	
	// Add  battle window
	$('body').append('<div id="game-battleground"><div class="content"></div></div>');
	
	// Style battle window
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
	
	// Style battle window content
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
	
	// Add loader
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

/**
* Collecting an item
* 
* @param 	integer 	x
* @param 	integer 	y
* @return 	void
* @see 		collectItem()
*/
function collectItem(x, y){
	
	// Get item
	var item = hasItem(x, y);
	
	// Collect item in database
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
		
		// Check if collecting was successful
		if(data.status === true){
			
			// Delete item from array
			map.field[xPos + ':' + yPos].item = '';
			
			// Add callback window
			$('body').append('<div class="item-collect-callback">' + data.message + '</div>');
			
			// Style callback window
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
			
			// Show callback window
			$('.item-collect-callback').fadeIn(400, function(){
				setTimeout(function(){
					
					// Animate callback window
					$('.item-collect-callback').animate(
						{
							top: '-' + $('.item-collect-callback').height() + 'px'
						}, 
						400, 
						function(){
							
							// Delete callback window
							$('.item-collect-callback').detach();
						}
					)
				}, 1000);
			});
		}
	});
	
	// Reset help event
	helpEvent = null;
}

/**
* Create a new map
* 
* @fire 	canvasFire()
* @return 	void
* @see 		createMap()
*/
function createMap(){
	updates = true;
	
	// Delete Map in database
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
	
	// Set level + 1 in database
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
	
	// Save data to highscore
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
	
	// Reload audio
	gameAudio = loadAudios();
	
	// Delete audio
	$('audio').detach();
	$('canvas').detach();
	$('#game-canvas').children().detach();
	
	canvasFire();
	
	// Reset help event
	helpEvent = null;
	
	// Refresh page
	location.reload();
}

/**
* Refresh status bar values (gold, hp, exp)
* 
* @fires 	actualizeStatusBar()
* @return 	void
* @see 		actualizeStatusBar()
*/
function actualizeStatusBar(){
	
	// Get player data from database
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
		
		// Add data to status bar
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
	
	// Relaod this function
	setTimeout(function(){
		actualizeStatusBar();
	}, 250);
}