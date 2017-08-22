var keysDown = {};

var mouseX = 		0, 
	mouseY = 		0, 
	mouseXright = 	0, 
	mouseYright = 	0, 
	mouseXmove = 	0, 
	mouseYmove = 	0;

document.addEventListener(
	'keydown', 
	function(e){
		setKey(e, true);
	}
);

document.addEventListener(
	'keyup', 
	function(e){
		setKey(e, false);
	}
);

document.addEventListener(
	'click', 
	function(e){
		mousePosition(e);
	}, 
	false
);

document.addEventListener(
	'contextmenu', 
	function(e){
		mousePosition(e); 
	}, 
	false
);

document.addEventListener(
	'mousemove', 
	function(e){
		mouseMovement(e);
	}, 
	false
);

window.addEventListener(
	'blur', 
	function(){
		keysDown = {};
	}
);

window.input = {
	isDown: function(key){
		return keysDown[key.toUpperCase()];
	}
};

$(function(){
	$('#buttonAccount').on('click', function(e){
		e.preventDefault();
		
		popupLoader();
		
		$('#game-popup').load('view/popup/account.inc.php', function(){
			$('#game-popup').hide();
			
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	$('#buttonInventory').on('click', function(e){
		e.preventDefault();
		
		popupLoader();
		
		$('#game-popup').load('view/popup/inventory.inc.php', function(){
			$('#game-popup').hide();
			
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	$('#buttonSettings').on('click', function(e){
		e.preventDefault();
		
		popupLoader();
		
		$('#game-popup').load('view/popup/settings.inc.php', function(){
			$('#game-popup').hide();
			
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	$('#buttonHighscore').on('click', function(e){
		e.preventDefault();
		
		popupLoader();
		
		$('#game-popup').load('view/popup/highscore.inc.php', function(){
			$('#game-popup').hide();
			
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	$('#buttonHelp').on('click', function(e){
		e.preventDefault();
		
		renderCounter = 0;
		helpEvent = 'start';
	});
	
	$(document).on('click', '#game-popup .buttonClose, #game-popup-background', function(e){
		e.preventDefault();
		
		$('#game-popup-background').hide();
		
		$('#game-popup').fadeOut(400);
		
		$('#game-popup').html();
	});
	
	$(document).on('click', '.inventory-select', function(e){
		e.preventDefault();
		
		// update file + html
		
		alert('select');
	});
	
	$(document).on('click', '.inventory-delete', function(e){
		e.preventDefault();
		
		// update file + html
		
		alert('delete');
	});
	
	$(document).on('click', '#game-help #game-item-collect', function(e){
		e.preventDefault();
		
		var x = $(this).attr('data-x');
		var y = $(this).attr('data-y');
		
		$('#game-help-background').hide();
		
		$('#game-help').fadeOut(400, function(){
			helpEvent = null;
			
			// Collect item
			collectItem(x, y);
		});
		
		$('#game-help').html();
	});
	
	$(document).on('click', '#game-help #game-start-battle', function(e){
		e.preventDefault();
		
		// Start battle procedure
		battleMonster($(this).attr('data-x'), $(this).attr('data-y'));
		
		$('#game-help-background').hide();
		
		$('#game-help').fadeOut(400, function(){
			helpEvent = null;
		});
		
		$('#game-help').html();
	});
	
	$(document).on('click', '#game-help #game-next-level', function(e){
		e.preventDefault();
		
		// delete map
		// add map
		createMap();
		
		$('#game-help-background').hide();
		
		$('#game-help').fadeOut(400, function(){
			helpEvent = null;
		});
		
		$('#game-help').html();
		
		helpEvent = null;
	});
	
	$(document).on('click', '#game-help-background, #game-help .buttonClose', function(e){
		e.preventDefault();
		
		if($('#game-help #game-start-battle').length === 0 && $('#game-help #game-item-collect').length === 0 && $('#game-help #game-nect-level').length === 0){
			$('#game-help-background').hide();
			
			$('#game-help').fadeOut(400, function(){
				helpEvent = null;
			});
			
			$('#game-help').html();
		}
	});
});

function popupLoader(){
	$('#game-popup').html(
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
	
	$('#game-popup').css({
		left: '50%', 
		top: '15vh', 
		marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
	});
	
	$('#game-popup-background').show();
	$('#game-popup').show();
}

function setKey(event, status){
	var code = event.keyCode;
	var key;
	switch(code){
		case 13:	key = 'ENTER'; break;
		case 17: 	key = 'STRG'; break;
		case 27: 	key = 'ESC'; break;
		case 36:	key = 'SPACE'; break;
		case 37:	key = 'LEFT'; break;
		case 38:	key = 'UP'; break;
		case 39:	key = 'RIGHT'; break;
		case 40:	key = 'DOWN'; break;
		case 112:	key = 'F1'; break;
		case 113:	key = 'F2'; break;
		case 114:	key = 'F3'; break;
		case 115:	key = 'F4'; break;
		default:	key = String.fromCharCode(code);
	}
	keysDown[key] = status;
}

function mousePosition(e){
	/*
	if(!e){ window.event; }
	if((e.type && e.type == "contextmenu") || (e.button && e.button == 2) || (e.which && e.which == 3)){
		mouseXright = e.pageX || e.clientX + document.body.scrollLeft;
		mouseYright = e.pageY || e.clientY + document.body.scrollTop;
		e.preventDefault();
	}else{
		mouseX = e.pageX || e.clientX + document.body.scrollLeft;
		mouseY = e.pageY || e.clientY + document.body.scrollTop;
	}
	*/
}

function mouseMovement(e){
	if(!e){ window.event; }
	mouseXmove = e.pageX || e.clientX + document.body.scrollLeft;
	mouseYmove = e.pageY || e.clientY + document.body.scrollTop;
}