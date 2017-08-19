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
	}, 150);
}