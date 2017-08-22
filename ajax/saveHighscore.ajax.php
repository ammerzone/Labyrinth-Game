<?php
require('autoload.php');

// Get parameters
$session = 	isset($_SESSION['gameId']) ? $_SESSION['gameId'] : (isset($_POST['session']) ? $_POST['session'] : NULL);

// Abourt if parameters missing
if($session === NULL){
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

$player = new Player($session, '../media/game');

$data = $player->get();

$highscore = new Highscore('../media/game');

$highscore->edit(
	array(
		'id' => 	$session,
		'name' => 	$data['name'],
		'lvl' => 	$data['stats']['lvl'], 
		'exp' => 	$data['stats']['exp']
	)
);

echo json_encode(
	array(
		'status' => true
	)
);
die();
?>