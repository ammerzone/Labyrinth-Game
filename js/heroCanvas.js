/**
* Create hero canvas
* 
* @return 	void
* @see 		heroCreate()
*/
var heroCreate = function(){
	
	// Create canvas
	heroCanvas = document.createElement('canvas');
	heroCanvas.setAttribute('id', 'canvas-hero');
	
	// Canvas size
	heroCanvas.width = 32;
	heroCanvas.height = 48;
	
	heroContext = heroCanvas.getContext('2d');
	
	// Add canvas to html
	$('#game-canvas').append(heroCanvas);
	
	// Positionate canvas
	$('#canvas-hero').css({
		position: 'fixed', 
		left: '50%', 
		top: '50%', 
		marginLeft: '-' + (heroCanvas.width / 2) + 'px', 
		marginTop: '-' + (heroCanvas.height / 2) + 'px'
	});
	
	// Create running sound
	gameAudio.running = document.createElement('audio');
		
	gameAudio.running.setAttribute('id', 'game-audio-running');
	gameAudio.running.setAttribute('src', 'media/audio/running.mp3');
	
	// Set running sound options
	gameAudio.running.autoplay = 		true;
	gameAudio.running.loop = 			true;
	gameAudio.running.muted = 			true;
	gameAudio.running.volume = 			1;
	gameAudio.running.playbackRate = 	2;
}

/**
* Update hero canvas
* 
* @return 	void
* @see 		heroUpdate()
*/
var heroUpdate = function(){
	
	// Increase x offset
	heroOffsetX++;
	
	if(isRunning === false || heroOffsetX == 'undefined'){
		
		// Set x offset to 0
		heroOffsetX = 0;
	}
	
	heroOffsetY = 0;
	
	// Check if moving down
	if(runDirection === 'down'){
		
		// Set y offset to 0
		heroOffsetY = 0;
	}
	
	// Check if moving left
	if(runDirection === 'left'){
		
		// Set y offset to 1
		heroOffsetY = 1;
	}
	
	// Check if moving right
	if(runDirection === 'right'){
		
		// Set y offset to 2
		heroOffsetY = 2;
	}
	
	// Check if moving up
	if(runDirection === 'up'){
		
		// Set y offset to 3
		heroOffsetY = 3;
	}
	
	// Check if running
	if(isRunning === true){
		
		// Check if running sound is muted
		if(gameAudio.running.muted === true){
			
			// Check if sound effects is on
			if(character.settings.effects === 'on'){
				
				// unmute running sound
				gameAudio.running.muted = false;
			}else{
				
				// mute running sound
				gameAudio.running.muted = true;
			}
		}
	}else{
		
		// Check if running sound is muted
		if(gameAudio.running.muted === false){
			// mute running sound
			gameAudio.running.muted = true;
		}
	}
};

/**
* Update hero canvas
* 
* @return 	void
* @see 		heroUpdate()
*/
var heroRender = function(){
	
	// Clear image
	heroContext.clearRect(
		0, 
		0, 
		heroCanvas.width, 
		heroCanvas.height
	);
	
	// Load image
	heroImage = new Image()
	heroImage.src = 'media/img/player/hero1.png';
	
	// Draw image
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

/**
* Main function for hero canvas
* 
* @fires 	heroUpdate()
* @fires 	heroRender()
* @return 	void
* @see 		heroMain()
*/
var heroMain = function(){
	heroUpdate();
	heroRender();
	
	setTimeout(function(){
		
		// Reload this function
		requestAnimationFrame(heroMain);
	}, 100);
}