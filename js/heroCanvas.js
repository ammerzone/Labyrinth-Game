var heroCreate = function(){
	heroCanvas = document.createElement('canvas');
	heroCanvas.setAttribute('id', 'canvas-hero');
	heroCanvas.width = 32;
	heroCanvas.height = 48;
	
	heroContext = heroCanvas.getContext('2d');
	
	$('#game-canvas').append(heroCanvas);
	
	$('#canvas-hero').css({
		position: 'fixed', 
		left: '50%', 
		top: '50%', 
		marginLeft: '-' + (heroCanvas.width / 2) + 'px', 
		marginTop: '-' + (heroCanvas.height / 2) + 'px'
	});
	
	gameAudio.running = document.createElement('audio');
		
	gameAudio.running.setAttribute('id', 'game-audio-running');
	gameAudio.running.setAttribute('src', 'media/audio/running.mp3');
	
	gameAudio.running.autoplay = 		true;
	gameAudio.running.loop = 			true;
	gameAudio.running.muted = 			true;
	gameAudio.running.volume = 			1;
	gameAudio.running.playbackRate = 	2;
}

var heroUpdate = function(){
	heroOffsetX++;
	
	if(isRunning === false || heroOffsetX == 'undefined'){
		heroOffsetX = 0;
	}
	
	heroOffsetY = 0;
	
	if(runDirection === 'down'){
		heroOffsetY = 0;
	}
	
	if(runDirection === 'left'){
		heroOffsetY = 1;
	}
	
	if(runDirection === 'right'){
		heroOffsetY = 2;
	}
	
	if(runDirection === 'up'){
		heroOffsetY = 3;
	}
	
	if(input.isDown('UP') || input.isDown('w') || input.isDown('LEFT') || input.isDown('a') || input.isDown('DOWN') || input.isDown('s') || input.isDown('RIGHT') || input.isDown('d')){
		if(gameAudio.running.muted === true){
			gameAudio.running.muted = false;
		}
	}else{
		if(gameAudio.running.muted === false){
			gameAudio.running.muted = true;
		}
	}
};

var heroRender = function(){
	heroContext.clearRect(
		0, 
		0, 
		heroCanvas.width, 
		heroCanvas.height
	);
	
	heroImage = new Image()
	heroImage.src = 'media/img/player/hero1.png';
	
	heroContext.drawImage(
		heroImage, 
		(32 * (heroOffsetX % 4)), 
		(48 * (heroOffsetY % 4)), 
		32, 
		48, 
		0, 
		0, 
		32, 
		48
	);
};

var heroMain = function(){
	heroUpdate();
	heroRender();
	
	setTimeout(function(){
		requestAnimationFrame(heroMain);
	}, 100);
}