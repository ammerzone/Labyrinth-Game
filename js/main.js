/* GLOBAL VARIABLES */
var keysDown = {}, 
	mouseX = 			0, 
	mouseY = 			0, 
	mouseXright = 		0, 
	mouseYright = 		0, 
	mouseXmove = 		0, 
	mouseYmove = 		0, 
	mobileMoving = 		null, 
	isMobile = 			checkMobile();
/* END GLOBAL VARIABLES */

// Event listener for keydown event
document.addEventListener(
	'keydown', 
	function(e){
		setKey(e, true);
	}
);

// Event listener for keyup event
document.addEventListener(
	'keyup', 
	function(e){
		setKey(e, false);
	}
);

// Event listener for click event
document.addEventListener(
	'click', 
	function(e){
		mousePosition(e);
	}, 
	false
);

// Event listener for contextmenu event
document.addEventListener(
	'contextmenu', 
	function(e){
		mousePosition(e); 
	}, 
	false
);

// Event listener for mousemove event
document.addEventListener(
	'mousemove', 
	function(e){
		mouseMovement(e);
	}, 
	false
);

// Event listener for blur event
window.addEventListener(
	'blur', 
	function(){
		keysDown = {};
	}
);

// Get actual pressed key
window.input = {
	isDown: function(key){
		return keysDown[key.toUpperCase()];
	}
};

$(function(){
	
	// Toggle mobile navigation
	$('#buttonMobileNavHamburger').on((isMobile ? 'tap' : 'click'), function(e){
		
		// Check if navigation is visible
		if($('#game-navigation-collapse').is(":visible")){
			
			// Hide navigation
			$('#game-navigation-collapse').slideUp(400);
		}else{
			
			// Positionate Navigation
			$('#game-navigation-collapse').css({
				bottom: 	'60px', 
				left: 		(($('#buttonMobileNavHamburger').offset().left + $('#buttonMobileNavHamburger').innerWidth()) - 250) + 'px'
			});
			
			// Show navigation
			$('#game-navigation-collapse').slideDown(400);
		}
	});
	
	// Open account window
	$('#buttonAccount').on((isMobile ? 'tap' : 'click'), function(e){
		e.preventDefault();
		
		$('#game-navigation-collapse').hide();
		
		popupLoader();
		
		// Load account file
		$('#game-popup').load('view/popup/account.inc.php', function(){
			
			// Hide window
			$('#game-popup').hide();
			
			// Repositionate to center
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			// Show window
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	// Open inventory window
	$('#buttonInventory').on((isMobile ? 'tap' : 'click'), function(e){
		e.preventDefault();
		
		$('#game-navigation-collapse').hide();
		
		popupLoader();
		
		// Load inventory file
		$('#game-popup').load('view/popup/inventory.inc.php', function(){
			
			// Hide window
			$('#game-popup').hide();
			
			// Repositionate to center
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			// Show window
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	// Open settings window
	$('#buttonSettings').on((isMobile ? 'tap' : 'click'), function(e){
		e.preventDefault();
		
		$('#game-navigation-collapse').hide();
		
		popupLoader();
		
		$('#game-popup').load('view/popup/settings.inc.php', function(){
			
			// Hide window
			$('#game-popup').hide();
			
			// Repositionate to center
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			// Show window
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	// Open highscore window
	$('#buttonHighscore').on((isMobile ? 'tap' : 'click'), function(e){
		e.preventDefault();
		
		$('#game-navigation-collapse').hide();
		
		popupLoader();
		
		$('#game-popup').load('view/popup/highscore.inc.php', function(){
			
			// Hide window
			$('#game-popup').hide();
			
			// Repositionate to center
			$('#game-popup').css({
				left: '50%', 
				top: '15vh', 
				marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
			});
			
			// Show window
			$('#game-popup').slideDown(400, function(){
				$('#game-popup').prepend('<a href="#" class="buttonClose">X</a>');
			});
		});
	});
	
	// Open help window
	$('#buttonHelp').on((isMobile ? 'tap' : 'click'), function(e){
		e.preventDefault();
		
		$('#game-navigation-collapse').hide();
		
		// Set help event
		renderCounter = 0;
		helpEvent = 'start';
	});
	
	// Move up with mobile navigation
	$('#mobile-up').on((isMobile ? 'touchstart' : 'mousedown'), function(e){
		e.preventDefault();
		
		mobileMoving = 'up';
	}).on((isMobile ? 'tap' : 'mouseup mouseleave'), function(){
		mobileMoving = null;
	});
	
	// Move left with mobile navigation
	$('#mobile-left').on((isMobile ? 'touchstart' : 'mousedown'), function(e){
		e.preventDefault();
		
		mobileMoving = 'left';
	}).on((isMobile ? 'tap' : 'mouseup mouseleave'), function(){
		mobileMoving = null;
	});
	
	// Move right with mobile navigation
	$('#mobile-right').on((isMobile ? 'touchstart' : 'mousedown'), function(e){
		e.preventDefault();
		
		mobileMoving = 'right';
	}).on((isMobile ? 'tap' : 'mouseup'), function(){
		mobileMoving = null;
	});
	
	// Move down with mobile navigation
	$('#mobile-down').on((isMobile ? 'touchstart' : 'mousedown'), function(e){
		e.preventDefault();
		
		mobileMoving = 'down';
	}).on((isMobile ? 'tap' : 'mouseup mouseleave'), function(){
		mobileMoving = null;
	});
	
	// Close popup window
	$(document).on((isMobile ? 'tap' : 'click'), '#game-popup .buttonClose, #game-popup-background', function(e){
		e.preventDefault();
		
		$('#game-popup-background').hide();
		
		$('#game-popup').fadeOut(400);
		
		$('#game-popup').html();
	});
	
	// Select item from Inventory
	$(document).on((isMobile ? 'tap' : 'click'), '.inventory-select', function(e){
		e.preventDefault();
		
		// Update file + html from database
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
	});
	
	// Delete item from inventory
	$(document).on((isMobile ? 'tap' : 'click'), '.inventory-delete', function(e){
		e.preventDefault();
		
		var item = $(this).attr('data-item');
		
		// Update file + html from database
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
	});
	
	// Button to start collecting item
	$(document).on((isMobile ? 'tap' : 'click'), '#game-help #game-item-collect', function(e){
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
	
	// Button to start battle
	$(document).on((isMobile ? 'tap' : 'click'), '#game-help #game-start-battle', function(e){
		e.preventDefault();
		
		// Start battle procedure
		battleMonster($(this).attr('data-x'), $(this).attr('data-y'));
		
		$('#game-help-background').hide();
		
		$('#game-help').fadeOut(400);
		
		$('#game-help').html();
	});
	
	// Button to start level up
	$(document).on((isMobile ? 'tap' : 'click'), '#game-help #game-next-level', function(e){
		e.preventDefault();
		
		// Delete map, then add map
		createMap();
		
		// Hide help background
		$('#game-help-background').hide();
		
		// Hide help window
		$('#game-help').fadeOut(400, function(){
			helpEvent = null;
		});
		
		// Empty help window
		$('#game-help').html();
		
		// Reset help event
		helpEvent = null;
	});
	
	// Close help window
	$(document).on((isMobile ? 'tap' : 'click'), '#game-help-background, #game-help .buttonClose', function(e){
		e.preventDefault();
		
		// Check if no batte, item collection or level up is open
		if($('#game-help #game-start-battle').length === 0 && $('#game-help #game-item-collect').length === 0 && $('#game-help #game-next-level').length === 0){
			// Hide help background
			$('#game-help-background').hide();
			
			// Hide help window
			$('#game-help').fadeOut(400, function(){
				helpEvent = null;
			});
			
			// Empty help window
			$('#game-help').html();
		}
	});
	
	// Button for sound settings was changed
	$(document).on('change', '#change-setting-sound', function(){
		
		// Mute or unmute sound
		if(this.checked){
			gameAudio.soundtrack.muted = false;
			
			var data = {sound: 'on'};
		}else{
			gameAudio.soundtrack.muted = true;
			
			var data = {sound: 'off'};
		}
		
		// Update player database
		$.ajax({
			type: 		'post', 
			url: 		'ajax/updatePlayerSetting.ajax.php', 
			dataType: 	'json', 
			data: 		data, 
			cache: 		false,
			async: 		false,   
		});
	});
	
	// Button for effect settings was changed
	$(document).on('change', '#change-setting-effects', function(){
		
		// Mute or unmute sound effects
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
		
		// Update player database
		$.ajax({
			type: 		'post', 
			url: 		'ajax/updatePlayerSetting.ajax.php', 
			dataType: 	'json', 
			data: 		data, 
			cache: 		false,
			async: 		false,   
		});
	});
	
	// Button for help settings was changed
	$(document).on('change', '#change-setting-help', function(){
		
		//Change settings value
		if(this.checked){
			character.settings.help = 'on';
			
			var data = {help: 'on'};
		}else{
			character.settings.help = 'off';
			
			var data = {help: 'off'};
		}
		
		// Update player database
		$.ajax({
			type: 		'post', 
			url: 		'ajax/updatePlayerSetting.ajax.php', 
			dataType: 	'json', 
			data: 		data, 
			cache: 		false,
			async: 		false,   
		});
	});

	// Close battle window after havin won it
	$(document).on((isMobile ? 'tap' : 'click'), '#game-battleground .content #btn-win', function(e){
		e.preventDefault();
		
		if($(this).attr('data-x') != 'undefined' && $(this).attr('data-x') != 'undefined'){
			if($(this).attr('data-x') + ':' + $(this).attr('data-y') in map.field){
				if('monster' in map.field[$(this).attr('data-x') + ':' + $(this).attr('data-y')]){
					
					// Delete monster from array
					map.field[$(this).attr('data-x') + ':' + $(this).attr('data-y')].monster = '';
				}
			}
		}
		
		var exp = 	$(this).attr('data-exp');
		var gold = 	$(this).attr('data-gold');
		
		// Close battle window
		$('#game-battleground .content').slideUp(400, function(){
			$('#game-battleground').slideUp(400, function(){
				$('#game-battleground').detach();
				
				// Create callback window
				$('body').append(
					'<div class="monster-callback">' + 
						'+' + exp + ' Exp<br>' + 
						'+' + gold + ' Gold<br>' + 
					'</div>'
				);
				
				// Positionate callback window
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
				
				// Show callback window
				$('.monster-callback').fadeIn(400, function(){
					setTimeout(function(){
						
						// Animate callback window
						$('.monster-callback').animate(
							{
								top: '-' + $('.monster-callback').height() + 'px'
							}, 
							400, 
							function(){
								
								// Delete callback window
								$('.monster-callback').detach();
							}
						)
					}, 1000);
				});
			});
		});
		
		// Update to highscore database
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
	
	// Close battle window after having lost it
	$(document).on((isMobile ? 'tap' : 'click'), '#game-battleground .content #btn-lose', function(e){
		e.preventDefault();
		
		// Set exp and gold to 0
		character.stats.exp = 	0;
		character.stats.gold = 	0;
		
		// Close battle window
		$('#game-battleground .content').slideUp(400, function(){
			$('#game-battleground').slideUp(400, function(){
				$('#game-battleground').detach();
			});
		});
		
		createMap();
		
		helpEvent = null;
	});
});

/** 
* Initiate game popup with loader
* 
* @return 	void
* @see 		popupLoader()
*/
function popupLoader(){
	
	// Initialize loading spinner
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
	
	// Positionate popup box to center
	$('#game-popup').css({
		left: '50%', 
		top: '15vh', 
		marginLeft: '-' + ($('#game-popup').width() / 2) + 'px'
	});
	
	// Show popup box
	$('#game-popup-background').show();
	$('#game-popup').show();
}

/** 
* Set key code when key is pressed
* 
* @param 	object 	event
* @param 	string 	status
* @return 	void
* @see 		mousePosition()
*/
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

/** 
* Set position
* 
* @param 	object 	e
* @return 	void
* @see 		mousePosition()
*/
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

/** 
* Set position when mouse is moved
* 
* @param 	object 	e
* @return 	void
* @see 		mouseMovement()
*/
function mouseMovement(e){
	if(!e){ window.event; }
	mouseXmove = e.pageX || e.clientX + document.body.scrollLeft;
	mouseYmove = e.pageY || e.clientY + document.body.scrollTop;
}

/** 
* Check if actual device is mobile or not
* 
* @return 	boolean
* @see 		checkMobile()
*/
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