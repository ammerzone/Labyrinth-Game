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
	isRunning = false,
	runDirection = 'down', 
	helpEvent = null, 
	heroImage, 
	heroOffsetX = 0, 
	heroOffsetY = 0, 
	gameTick = Date.now(), 
	gameAudio = loadAudios();

requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.mozRequestAnimationFrame;
window.addEventListener('load', eventWindowLoaded, false); 

function eventWindowLoaded(){
	$(function(){
		updates = true;
		
		inputKey;
		
		helpEvent = 'start',
		
		gameCreate();
		heroCreate();
		
		heroMain();
		gameMain();
	});
}

function loadAudios(){
	return {
		soundtrack: 	null, 
		running: 		null,
		hitting: 		null, 
		defending: 		null, 
		dying: 			null, 
		collecting: 	null, 
		monster: 		null
	};
}

function battleMonster(){
	// open battle window
	// load...
	// loop:
		// i hit monster -> monster hp down
		// monster hit me -> my hp down
		// if: monster hp <= 0 -> win (break loop)
		// if: my hp <= 0 -> lose (break loop)
	// if won: popup with button -> delete monster, add exp
	// if lost: popup with button -> save to highscore, reset hero, create map
	// close battle window
	
	helpEvent = null;
}

function collectItem(){
	// open item window (animation)
	// add item to player list
	// delete item from map list
	// click button to close item window
	
	helpEvent = null;
}

function createMap(){
	// open window
	// loading spinner + text
	// close window
	
	// refresh site
	
	helpEvent = null;
}