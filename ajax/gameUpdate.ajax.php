<?php
require_once('autoload.php');

ini_set('memory_limit', '1G');
set_time_limit(120);

$session = 	isset($_SESSION['gameId']) ? $_SESSION['gameId'] : NULL;
$param = 	isset($_GET['param']) ? $_GET['param'] : NULL;

if($session === NULL || $param == NULL){
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}
?>