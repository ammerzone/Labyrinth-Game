<?php
require('autoload.php');

// Get parameters
$session = 	isset($_SESSION['gameId']) ? $_SESSION['gameId'] : (isset($_POST['session']) ? $_POST['session'] : NULL);

// Abort if parameters missing
if($session === NULL){
	
	// Return JSON string
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

$player = new Player($session, '../media/game');

// Get player data
$data = $player->get();

$highscore = new Highscore('../media/game');

// Edit highscore
$highscore->edit(
	array(
		'id' => 	$session,
		'name' => 	$data['name'],
		'date' => 	date('d.m.Y', time()) . ',', 
		'lvl' => 	$data['stats']['lvl'], 
		'exp' => 	$data['stats']['exp']
	)
);

// Return JSON string
echo json_encode(
	array(
		'status' => true
	)
);
die();
?>