var keysDown = {};

var mouseX = 			0, 
	mouseY = 			0, 
	mouseXright = 		0, 
	mouseYright = 		0, 
	mouseXmove = 		0, 
	mouseYmove = 		0, 
	mobileMoving = 		null;

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
	
	$('#mobile-up').on('mousedown', function(e){
		e.preventDefault();
		
		mobileMoving = 'up';
	}).on('mouseup mouseleave', function(){
		mobileMoving = null;
	});
	
	$('#mobile-left').on('mousedown', function(e){
		e.preventDefault();
		
		mobileMoving = 'left';
	}).on('mouseup mouseleave', function(){
		mobileMoving = null;
	});
	
	$('#mobile-right').on('mousedown', function(e){
		e.preventDefault();
		
		mobileMoving = 'right';
	}).on('mouseup mouseleave', function(){
		mobileMoving = null;
	});
	
	$('#mobile-down').on('mousedown', function(e){
		e.preventDefault();
		
		mobileMoving = 'down';
	}).on('mouseup mouseleave', function(){
		mobileMoving = null;
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
		$.ajax({
			type: 		'post', 
			url: 		'ajax/equipItem.ajax.php', 
			dataType: 	'json', 
			data: 		{
				item: item, 
				type: 'select'
			}, 
			cache: 		false,
			async: 		false,   
		}).done(function(data){
			// Decrease item
			item.closest('tr').find('.item-amount').html(parseInt(item.closest('tr').find('.item-amount').html()) - 1);
			
			// If that was the last item
			if(parseInt(item.closest('tr').find('.item-amount').html()) === 0){
				// Delete item from list
				item.closest('tr').detach();
			}
		});
		
		alert('select');
	});
	
	$(document).on('click', '.inventory-delete', function(e){
		e.preventDefault();
		
		var item = $(this).attr('data-item');
		
		// update file + html
		$.ajax({
			type: 		'post', 
			url: 		'ajax/equipItem.ajax.php', 
			dataType: 	'json', 
			data: 		{
				item: item, 
				type: 'delete'
			}, 
			cache: 		false,
			async: 		false,   
		}).done(function(data){
			// Decrease item
			item.closest('tr').find('.item-amount').html(parseInt(item.closest('tr').find('.item-amount').html()) - 1);
			
			// If that was the last item
			if(parseInt(item.closest('tr').find('.item-amount').html()) === 0){
				// Delete item from list
				item.closest('tr').detach();
			}
		});
		
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
		
		$('#game-help').fadeOut(400);
		
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
	
	$(document).on('change', '#change-setting-sound', function(){
		if(this.checked){
			gameAudio.soundtrack.muted = false;
			
			var data = {sound: 'on'};
		}else{
			gameAudio.soundtrack.muted = true;
			
			var data = {sound: 'off'};
		}
		
		// Update player
		$.ajax({
			type: 		'post', 
			url: 		'ajax/updatePlayerSetting.ajax.php', 
			dataType: 	'json', 
			data: 		data, 
			cache: 		false,
			async: 		false,   
		});
	});
	
	$(document).on('change', '#change-setting-effects', function(){
		if(this.checked){
			gameAudio.running.muted = 		false;
			gameAudio.hitting.muted = 		false;
			gameAudio.defending.muted = 	false;
			gameAudio.dying.muted = 		false;
			gameAudio.collecting.muted = 	false;
			gameAudio.monster.muted = 		false;
			
			var data = {effects: 'on'};
		}else{
			gameAudio.running.muted = 		true;
			gameAudio.hitting.muted = 		true;
			gameAudio.defending.muted = 	true;
			gameAudio.dying.muted = 		true;
			gameAudio.collecting.muted = 	true;
			gameAudio.monster.muted = 		true;
			
			var data = {effects: 'off'};
		}
		
		// Update player
		$.ajax({
			type: 		'post', 
			url: 		'ajax/updatePlayerSetting.ajax.php', 
			dataType: 	'json', 
			data: 		data, 
			cache: 		false,
			async: 		false,   
		});
	});
	
	$(document).on('change', '#change-setting-help', function(){
		if(this.checked){
			character.settings.help = 'on';
			
			var data = {help: 'on'};
		}else{
			character.settings.help = 'off';
			
			var data = {help: 'off'};
		}
		
		// Update player
		$.ajax({
			type: 		'post', 
			url: 		'ajax/updatePlayerSetting.ajax.php', 
			dataType: 	'json', 
			data: 		data, 
			cache: 		false,
			async: 		false,   
		});
	});

	$(document).on('click', '#game-battleground .content #btn-win', function(e){
		e.preventDefault();
		
		if($(this).attr('data-x') != 'undefined' && $(this).attr('data-x') != 'undefined'){
			if($(this).attr('data-x') + ':' + $(this).attr('data-y') in map.field){
				if('monster' in map.field[$(this).attr('data-x') + ':' + $(this).attr('data-y')]){
					// Delete monster
					map.field[$(this).attr('data-x') + ':' + $(this).attr('data-y')].monster = '';
				}
			}
		}
		
		var exp = 	$(this).attr('data-exp');
		var gold = 	$(this).attr('data-gold');
		
		// close battle window
		$('#game-battleground .content').slideUp(400, function(){
			$('#game-battleground').slideUp(400, function(){
				$('#game-battleground').detach();
				
				$('body').append(
					'<div class="monster-callback">' + 
						'+' + exp + ' Exp<br>' + 
						'+' + gold + ' Gold<br>' + 
					'</div>'
				);
				
				$('.monster-callback').css({
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
				
				$('.monster-callback').fadeIn(400, function(){
					setTimeout(function(){
						$('.monster-callback').animate(
							{
								top: '-' + $('.monster-callback').height() + 'px'
							}, 
							400, 
							function(){
								$('.monster-callback').detach();
							}
						)
					}, 1000);
				});
			});
		});
		
		// Update to highscore
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
		
		helpEvent = null;
	});
	
	$(document).on('click', '#game-battleground .content #btn-lose', function(e){
		e.preventDefault();
		
		// Set exp and gold to 0
		character.stats.exp = 	0;
		character.stats.gold = 	0;
		
		$('#game-battleground .content').slideUp(400, function(){
			$('#game-battleground').slideUp(400, function(){
				$('#game-battleground').detach();
			});
		});
		
		createMap();
		
		helpEvent = null;
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

// Check if actual device is mobile or not
function checkMobile(){
	return false;
	
	var agent = navigator.userAgent;
	
	if(agent.match(/Android/i)) // Android Phone / Tablet
		return true;
	
	if(agent.match(/BlackBerry/i)) // BlackBerry Phone / Tablet
		return true;
	
	if(agent.match(/iPhone/i)) // Apple Phone / Tablet
		return true;
	
	if(agent.match(/iPad/i)) // Apple Phone / Tablet
		return true;
	
	if(agent.match(/iPod/i)) // Apple Phone / Tablet
		return true;
	
	if(agent.match(/Opera Mini/i)) // Opera phone / Tablet
		return true;
	
	if(agent.match(/IEMobile/i)) // Windows Phone / Tablet
		return true;
	
	if(agent.match(/WPDesktop/i)) // Windows Phone / Tablet
		return true;
	
	return false;
}