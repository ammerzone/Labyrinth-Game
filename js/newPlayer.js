$(function(){
	
	// Create new player window
	$('body').append('<div id="game-new-player"><div class="content"></div></div>');
	
	// Style player window
	$('#game-new-player').css({
		position: 			'fixed',
		left: 				'0px',
		top: 				'0px',
		width: 				'100%',
		height: 			'100%',
		overflow: 			'auto',
		backgroundColor: 	'rgba(0, 0, 0, 0.8)', 
		zIndex: 			'20', 
		textAlign: 			'center',
		paddingTop: 		'50vh'
	});
	
	// Style player window content
	$('#game-new-player .content').css({
			width: 			'100vw', 
			margin: 		'0px', 
		    marginTop: 		'-45vh',
			height: 		'90vh',
			background: 	'#DDDDDD',
			padding: 		'0px',
			border: 		'2px solid #DDDDDD',
			borderRadius: 	'5px', 
			overflow: 		'auto', 
			fontSize: 		'1em'
	});
	
	// Fill player window content
	$('#game-new-player .content').html(
		'<h2>Neues Spiel</h2>' + 
		'<label for="player-name">Wähle zunächst einen eigenen Spielernamen für deinen Helden aus:</label>' + 
		'<div class="col-sm-10 col-sm-offset-1">' + 
			'<input class="form-control" type="text" name="player-name" id="player-name">' + 
			'<br>' + 
			'<button class="btn btn-success">Spiel starten</button>' + 
		'</div>'
	);
	
	// Click start game
	$(document).on('click', '#game-new-player .content button.btn', function(e){
		e.preventDefault();
		
		var name = $('#game-new-player .content #player-name').val();
		
		// Check if name is valid
		if(name.length > 3 && !(name.includes(',')) && name.search(/[a-zA-Z0-9]$/) != -1){
			
			// Hide player window content
			$('#game-new-player .content').slideUp(400);
			
			// Hide player window
			$('#game-new-player').fadeOut(400, function(){
				$('#game-new-player').detach();
			});
			
			// Update player database
			$.ajax({
				type: 		'post', 
				url: 		'ajax/setName.ajax.php', 
				dataType: 	'json', 
				data: 		{
					name: name
				}, 
				cache: 		false,
				async: 		false
			}).done(function(data){
				
			});
		}else{
			// Error message
			$('#game-new-player .content label').append(
				'<div class="alert alert-danger" role="alert">' + 
					'<strong>Fehler:</strong>' + 
					'Name darf nur aus Buchstaben und Zahlen bestehen und muss mindestens 3 Zeichen lang sein' + 
				'</div>'
			);
			
			// Hide error message
			setTimeout(function(){
				$('#game-new-player .content div.alert').slideUp(400, function(){
					$('#game-new-player .content div.alert').detach();
				});
			}, 2000);
		}
	});
});