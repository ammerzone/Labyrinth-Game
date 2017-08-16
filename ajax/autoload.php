<?php
session_start();
//error_reporting(0);

// Autoloads the classes
spl_autoload_register(
	
	function ($className){
		// Array with included class names
		static $includedClasses = array();
		
		// Check if already included
		if(!isset($includedClasses[$className]))
			
			// Check if class-file exists
			if(file_exists('../oop/' . $className . '.class.php')){
				$includedClasses[$className] = true;
				
				// Include class
				require_once '../oop/' . $className . '.class.php';
				
			}
	}
);
?>