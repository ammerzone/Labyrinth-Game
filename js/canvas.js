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
	helpEvent, 
	heroImage, 
	heroOffsetX = 0, 
	heroOffsetY = 0, 
	gameTick = Date.now();

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
