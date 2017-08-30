<?php
require('autoload.php');

// Get parameters
$session = 	isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 	NULL;
$item = 	isset($_POST['item']) ? 		$_POST['item'] : 		NULL;
$type = 	isset($_POST['type']) ? 		$_POST['type'] : 		NULL;

// Abort if parameters missing
if($session === NULL || $item === NULL){
	
	// Return JSON string
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

if($type === 'select'){
	// If armour: check if already got one
	// If weapon: check if already got one
	// If shield: check if already got one

	// Use item
}

// If amount > 1: player item amount - 1
// Else: delete player item

// Return JSON string
echo json_encode(
	array(
		'status' => true
	)
);
die();
?>