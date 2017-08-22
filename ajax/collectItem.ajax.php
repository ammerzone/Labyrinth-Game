<?php
require('autoload.php');

// Get parameters
$session = 	isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 	(isset($_POST['session']) ? $_POST['session'] : NULL);
$x = 		isset($_POST['x']) ? 			$_POST['x'] : 			NULL;
$y = 		isset($_POST['y']) ? 			$_POST['y'] : 			NULL;
$item = 	isset($_POST['item']) ? 			$_POST['item'] : 			NULL;

// Abourt if parameters missing
if($session === NULL || $x === NULL || $y === NULL || $item === NULL){
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

$player = new Player($session, '../media/game');

if($item === 'Gold' || $item === 'gold'){
	$itemNumb = rand(50, 100);
	
	// add item to player list
	$player->edit(
		array(
			'stats' => array(
				'gold' => $itemNumb
			)
		)
	);
}else{
	$itemNumb = 1;
	
	// add item to player list
	$player->edit(
		array(
			'items' => array(
				$item => $itemNumb
			)
		)
	);
}

$map = new Map($session, '../media/game');

// Delete from map
$map->edit(
	array(
		($x . ':' . $y) => array(
			'item' => ''
		)
	)
);

// Positive response
echo json_encode(
	array(
		'status' => true, 
		'message' => 'Erhalten: ' . $itemNumb . ' ' . $item
	)
);
die();
?>