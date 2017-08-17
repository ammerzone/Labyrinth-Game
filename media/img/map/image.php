<?php
$height = 		512;
$width = 		512;
$borderWidth = 	64;
$borderHeight = 64;

$main = isset($_GET['main']) ? $_GET['main'] : 0;
$type = isset($_GET['type']) ? $_GET['type'] : 'wall';

$border = array(
	'right' => 		isset($_GET['borderRight']) ? 		$_GET['borderRight'] : 		0, 
	'rightType' => 	isset($_GET['borderRightType']) ? 	$_GET['borderRightType'] : 	'wall', 
	'bottom' => 	isset($_GET['borderBottom']) ? 		$_GET['borderBottom'] : 	0, 
	'bottomType' => isset($_GET['borderBottomType']) ? 	$_GET['borderBottomType'] : 'wall'
);

if(!file_exists('main/' . $type . '/' . $main . '.jpg')){
	$main = 0;
	$type = 'wall';
}

if(!file_exists('border/right/' . $border['rightType'] . '/' . $border['right'] . '.png')){
	$border['right'] = 0;
	$border['rightType'] = 'wall';
}

if(!file_exists('border/bottom/' . $border['bottomType'] . '/' . $border['bottom'] . '.png')){
	$border['bottom'] = 0;
	$border['bottomType'] = 'wall';
}

header('Content-type: image/png');

$image = imagecreatefromjpeg('main/' . $type . '/' . $main . '.jpg');

$borderRight = imagecreatefrompng('border/right/' . $border['rightType'] . '/' . $border['right'] . '.png');

imagecopyresampled(
	$image, 				// img
	$borderRight, 			// source
	$width - $borderWidth, 	// img x
	0, 						// img y
	0, 						// source x
	0, 						// source y
	$borderWidth, 			// width
	$height, 				// height
	$borderWidth, 			// width
	$height 				// height
);

$borderBottom = imagecreatefrompng('border/bottom/' . $border['bottomType'] . '/' . $border['bottom'] . '.png');

imagecopyresampled(
	$image, 					// img
	$borderBottom, 				// source
	0, 							// img x
	$height - $borderHeight, 	// img y
	0, 							// source x
	0, 							// source y
	$width, 					// width
	$borderHeight, 				// height
	$width, 					// width
	$borderHeight 				// height
);

imagejpeg($image);

imagedestroy($image);

if($border['right'] != NULL){
	imagedestroy($borderLeft);
}

if($border['bottom'] != NULL){
	imagedestroy($borderLeft);
}
?>