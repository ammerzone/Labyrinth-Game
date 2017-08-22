function monsterSprite(options){
				
	var that = {},
		frameIndex = 		0,
		tickCount = 		0,
		ticksPerFrame = 	0,
		numberOfFrames = 	options.numberOfFrames || 1;
	
	that.image = 	new Image();
	that.id = 		options.id;
	that.canvas = 	document.createElement('canvas');
	
	switch(options.monster){
		case 'Spinne': 
			var numberOfFrames = 	6;
			that.width = 			100 * numberOfFrames;
			that.height = 			100;
			that.image.src = 		'media/img/monster/Spinne.png';
			break;
		case 'Drache': 
			var numberOfFrames = 	3;
			that.width = 			96 * numberOfFrames;
			that.height = 			96;
			that.image.src = 		'media/img/monster/Drache.png';
			break;
		default: 
			var numberOfFrames = 	6;
			that.width = 			100 * numberOfFrames;
			that.height = 			100;
			that.image.src = 		'media/img/monster/Spinne.png';
			break;
	}
	
	that.canvas.setAttribute('id', that.id);
	
	that.canvas.width = 	that.width;
	that.canvas.height = 	that.height;
	
	that.context = that.canvas.getContext("2d");
	
	
	if(typeof jQuery == 'undefined'){
		document.body.appendChild(that.canvas);
	}else{
		$('#game-canvas').append(that.canvas);
	}
	
	// positionate canvas
	that.positionate = function(x, y){
		$('#' + that.id).css({
			position: 	'fixed', 
			left: 		x + ((512 - (that.width / numberOfFrames)) / 2), 
			top: 		y + ((512 - that.height) / 2)
		});
	};
	
	that.render = function(){
		
		// Clear canvas
		that.context.clearRect(0, 0, that.width, that.height);
		
		// Draw animation
		that.context.drawImage(
			that.image,
			frameIndex * that.width / numberOfFrames,
			0,
			that.width / numberOfFrames,
			that.height,
			0,
			0,
			that.width / numberOfFrames,
			that.height
		);
	};
	
	that.loop = function(){
		setTimeout(function(){
			that.update();
			that.render();
			
			window.requestAnimationFrame(that.loop);
		}, 150);
	};
	
	that.update = function(){

		tickCount += 1;
			
		if(tickCount > ticksPerFrame){
		
			tickCount = 0;
			
			// If the current frame index is in range
			if(frameIndex < numberOfFrames - 1){
				
				// Go to the next frame
				frameIndex += 1; 
			}else if(that.loop){
				frameIndex = 0;
			}
		}
	}; 
	
	that.delete = function(){
		// Clear canvas
		that.context.clearRect(0, 0, that.width, that.height);
		
		if(typeof jQuery == 'undefined'){
			$('#' + that.id).detach();
		}
	}
	
	return that;
}