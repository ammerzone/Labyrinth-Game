<?php
require_once('autoload.php');

// Set memory and time limit higher to prevent runtime errors
ini_set('memory_limit', '1G');
set_time_limit(120);

// Get parameters
$session = 	isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 			(isset($_GET['session']) ? $_GET['session'] : NULL);
$param = 	isset($_GET['param']) ? 		json_decode($_GET['param']) : 	array();

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

// Return JSON string
echo json_encode(
	array(
		'status' => true
	)
);
die();
?>