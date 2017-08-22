<?php
require_once('autoload.php');

ini_set('memory_limit', '1G');
set_time_limit(120);

$session = 	isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 			(isset($_GET['session']) ? $_GET['session'] : NULL);
$param = 	isset($_GET['param']) ? 		json_decode($_GET['param']) : 	array();

if($session === NULL){
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

echo json_encode(
	array(
		'status' => true
	)
);
die();
?>