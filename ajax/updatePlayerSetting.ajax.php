<?php
require('autoload.php');

// Get parameters
$session = 	isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 	(isset($_POST['session']) ? $_POST['session'] : NULL);
$params = 	array(
	'sound' => 		isset($_POST['sound']) ? 	$_POST['sound'] : 	NULL, 
	'effects' => 	isset($_POST['effects']) ? 	$_POST['effects'] : NULL, 
	'help' => 		isset($_POST['help']) ? 	$_POST['help'] : 	NULL
);

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

// Change sound settings
if($params['sound'] != NULL){
	
	// Edit sound setting
	$player->edit(
		array(
			'settings' => array(
				'sound' => $params['sound']
			)
		)
	);
}

// Change effects settings
if($params['effects'] != NULL){
	
	// Edit effects setting
	$player->edit(
		array(
			'settings' => array(
				'effects' => $params['effects']
			)
		)
	);
}

// Change help settings
if($params['help'] != NULL){
	
	// Edit help setting
	$player->edit(
		array(
			'settings' => array(
				'help' => $params['help']
			)
		)
	);
}

// Return JSON string
echo json_encode(
	array(
		'status' => true
	)
);
die();
?>