$(function(){
	$('body').append('<div id="game-new-player"><div class="content"></div></div>');
	
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
	
	$('#game-new-player .content').css({
			width: 			'50vw', 
			minWidth: 		'300px', 
			margin: 		'auto', 
		    marginTop: 		'-20vh',
			height: 		'40vh',
			background: 	'#DDDDDD',
			padding: 		'0px',
			border: 		'2px solid #DDDDDD',
			borderRadius: 	'5px', 
		overflow: 			'auto'
	});
	
	$('#game-new-player .content').html(
		'<h2>Neues Spiel</h2>' + 
		'<label for="player-name">Wähle zunächst einen eigenen Spielernamen für deinen Helden aus:</label>' + 
		'<div class="col-sm-10 col-sm-offset-1">' + 
			'<input class="form-control" type="text" name="player-name" id="player-name">' + 
			'<br>' + 
			'<button class="btn btn-success">Spiel starten</button>' + 
		'</div>'
	);
	
	// Spiel starten click
	$(document).on('click', '#game-new-player .content button.btn', function(e){
		e.preventDefault();
		
		var name = $('#game-new-player .content #player-name').val();
		
		// Check if name is valid
		if(name.length > 3 && !(name.includes(',')) && name.search(/[a-zA-Z0-9]$/) != -1){
			$('#game-new-player .content').slideUp(400);
			$('#game-new-player').fadeOut(400, function(){
				$('#game-new-player').detach();
			});
			
			// Update player
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