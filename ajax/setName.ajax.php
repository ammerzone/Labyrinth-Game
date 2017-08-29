<?php
require('autoload.php');

// Get parameters
$session = 	isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 	(isset($_POST['session']) ? $_POST['session'] : NULL);
$name = 	isset($_POST['name']) ? 		$_POST['name'] : 		NULL;

// Abort if parameters missing
if($session === NULL || $name === NULL){
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

$player = new Player($session, '../media/game');

// Edit name
$player->edit(
	array(
		'name' => $name
	)
);

// Change init session to false
$_SESSION['newGame'] = false;

echo json_encode(
	array(
		'status' => true
	)
);
die();
?>