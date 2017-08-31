/**
* Create a item sprite object
* 
* @param 	object 		options
* @return 	object
* @see 		itemSprite()
*/
function itemSprite(options){
	
	/* GLOBAL VARIABLES */
	var that = {},
		frameIndex = 		0,
		tickCount = 		0,
		ticksPerFrame = 	0,
		numberOfFrames = 	6;
	/* END GLOBAL VARIABLES */
	
	// Create element
	that.image = 		new Image();
	that.id = 			options.id;
	that.canvas = 		document.createElement('canvas');
	
	// Set item data
	that.width = 		100 * numberOfFrames;
	that.height = 		100;
	that.image.src = 	'media/img/item/Item.png';
	
	that.canvas.setAttribute('id', that.id);
	
	that.canvas.width = 	that.width;
	that.canvas.height = 	that.height;
	
	that.context = that.canvas.getContext("2d");
	
	// Add canvas element
	if(typeof jQuery == 'undefined'){
		document.body.appendChild(that.canvas);
	}else{
		$('#game-canvas').append(that.canvas);
	}
	
	/**
	* Positionate canvas
	* 
	* @param 	integer 	x
	* @param 	integer 	y
	* @return 	void
	* @see 		delete()
	*/
	that.positionate = function(x, y){
		$('#' + that.id).css({
			position: 	'fixed', 
			left: 		x + ((512 - (that.width / numberOfFrames)) / 2), 
			top: 		y + ((512 - that.height) / 2)
		});
	};
	
	/**
	* Render (draw) canvas
	* 
	* @return 	void
	* @see 		render()
	*/
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
	
	/**
	* Canvas loop
	* 
	* @return 	void
	* @see 		loop()
	*/
	that.loop = function(){
		setTimeout(function(){
			that.update();
			that.render();
			
			// Repeat loop
			window.requestAnimationFrame(that.loop);
		}, 220);
	};
	
	/**
	* Update canvas
	* 
	* @return 	void
	* @see 		update()
	*/
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
	
	/**
	* Delete canvas
	* 
	* @return 	void
	* @see 		delete()
	*/
	that.delete = function(){
		// Clear canvas
		that.context.clearRect(0, 0, that.width, that.height);
		
		if(typeof jQuery == 'undefined'){
			$('#' + that.id).detach();
		}
	}
	
	return that;
}