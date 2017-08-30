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

$level = 1;

// get level
$get = $player->get();

// Increase level
if(isset($get['stats']['lvl'])){
	$level = intval($get['stats']['lvl']) + 1;
}

// Edit player level + 1
$player->edit(
	array(
		'stats' => array(
			'lvl' => $level
		)
	)
);

// Return JSON string
echo json_encode(
	array(
		'status' => true, 
		'lvl' => $level
	)
);
die();
?>