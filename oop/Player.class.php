<?php
/**
* Administration for the actual player data (file)
* Operations: Add, Edit, Get, Delete
* 
* @author 			Jules Rau <admin@jules-rau.de>
* @copyright 		Jules Rau
* @license 			MIT license
* @origin 			https://github.com/ammerzone/labyrinth
* @version 	1.0		30.08.2017
*/
class Player{
	/**
	* Value of the session
	* 
	* @var 		string
	* @access 	private
	*/
	private $session;	
	
	/**
	* Path of the player data-file
	* 
	* @var 		string
	* @access 	private
	*/
	private $file;
	
	/**
	* Constructs the Object
	* 
	* @access 	public
	* @param 	string	$session
	* @param 	string 	$path
	* @return 	void
	*/
	public function __construct($session, $path){
		$this->session = $session;
		$this->file = $path . '/player/';
	}
	
	/** 
	* Initialize player default values
	* 
	* @access 	private
	* @return 	array
	* @see 		getDefault()
	*/
	private function getDefault(){
		return array(
			'name' => '', 
			'settings' => array(
				'sound' => 		'on', 
				'effects' => 	'on', 
				'help' => 		'on'
			),
			'stats' => array(
				'speed' => 	100, 
				'atk' => 	10, 
				'def' => 	10, 
				'tp' => 	100, 
				'maxTp' => 	100, 
				'exp' => 	0, 
				'lvl' => 	1, 
				'gold' => 	0
			), 
			'equiped' => array(
				'weapon' => 	'', 
				'shield' => 	'',
				'armour' => 	''
			), 
			'items' => array()
		);
	}
	
	/** 
	* Get player values
	* 
	* @access 	public
	* @return 	array
	* @see 		get()
	*/
	public function get(){
		$player = array();
		
		// Check if file exists
		if(!file_exists($this->file . $this->session . '.db'))
			$this->add();
		
		// For each player element
		foreach(file($this->file . $this->session . '.db') as $key => $file){
			$out = explode(',', $file);
			
			// Check if sub-array exists
			if(sizeof($out) > 1){
				
				// Append to array
				$player[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				// For every sub-array element
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					// Append to array
					$player[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = isset($sub[1]) ? preg_replace('#\r|\n#', '', $sub[1]) : '';
				}
			}else{
				$out = explode(':', $file);
				
				// Append to array
				$player[preg_replace('#\r|\n#', '', $out[0])] = isset($out[1]) ? preg_replace('#\r|\n#', '', $out[1]) : '';
			}
		}
		
		return $player;
	}
	
	/** 
	* Add new player
	* 
	* @access 	public
	* @param 	string 	$name
	* @return 	void
	* @see 		add()
	*/
	public function add($name = NULL){
		
		// Open or create file
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		// Get defaults
		$arr = $this->getDefault();
		
		// If name, set name
		if($name != NULL){
			$arr['name'] = $name;
		}
		
		// For each element
		foreach($arr as $key => $val){
			$lineText = '';
			
			// Check if sub-array exists
			if(!is_array($val)){
				
				// Stringify array for file
				$lineText .= $key . ':' . $val;
			}else{
				
				// Stringify array for file
				$lineText .= $key;
				
				if(sizeof($val) > 0){
					$lineText .= ',';
					
					$i = 0;
					
					// For every sub-array element
					foreach($val as $sub => $data){
						$i++;
						
						// Stringify array for file
						$lineText .= $sub . ':' . $data;
						
						// If current element is not last
						if($i < sizeof($val)){
							$lineText .= ',';
						}
					}
				}
			}
			
			// Write data to file
			fwrite($f, $lineText . PHP_EOL);
		}
		
		// Close file
		fclose($f);
	}
	
	/** 
	* Edit player values
	* 
	* @access 	public
	* @param 	array 	$params
	* @return 	void
	* @see 		edit()
	*/
	public function edit($params){
		
		// Get data
		$arr = $this->get();
		
		// Transform key item to array if type is string
		if(!is_array($arr['items'])){
			$arr['items'] = array();
		}
		
		// change array to new name
		if(array_key_exists('name', $params)){
			$arr['name'] = $params['name'];
		}
		
		// Change array to new settings data
		if(array_key_exists('settings', $params)){
			foreach($params['settings'] as $key => $data){
				if(array_key_exists($key, $arr['settings'])){ 
					$arr['settings'][$key] = $data;
				}
			}
		}
		
		// Change array to new stats data
		if(array_key_exists('stats', $params)){
			foreach($params['stats'] as $key => $data){
				if(array_key_exists($key, $arr['stats'])){
					if($key === 'Gold' || $key === 'gold'){
						
						// Increase gold with a maximum of 999.999
						$arr['stats'][$key] = min(intval($arr['stats'][$key]) + $data, 999999);
					}else{
						$arr['stats'][$key] = $data;
					}
				}
			}
		}
		
		// Change array to new equiped data
		if(array_key_exists('equiped', $params)){
			foreach($params['equiped'] as $key => $data){
				if(array_key_exists($key, $arr['equiped'])){
					$arr['equiped'][$key] = $data;
				}
			}
		}
		
		// Change array to new equiped data
		if(array_key_exists('items', $params)){
			if(is_array($params['items'])){
				foreach($params['items'] as $item => $amount){
					
					// If item already exists
					if(array_key_exists($item, $arr['items'])){
						
						// Increase item amount
						$arr['items'][$item] = intval($arr['items'][$item]) + $amount;
					}else{
						
						// Append item to array item list
						$arr['items'][$item] = $amount;
					}
				}
			}else{
				$arr['items'] = '';
			}
		}
		
		// Open player file
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		// For every element of the array
		foreach($arr as $key => $val){
			$lineText = '';
			
			// Check if sub-array
			if(!is_array($val)){
				
				// Stringify array for file
				$lineText .= $key . ':' . $val;
			}else{
				$lineText .= $key;
				
				// If array is not empty
				if(sizeof($val) > 0){
					
					// Stringify array for file
					$lineText .= ',';
					
					$i = 0;
					
					// Foreach sub-array element
					foreach($val as $sub => $data){
						$i++;
						
						// Stringify array for file
						$lineText .= $sub . ':' . $data;
						
						// If this element is not the last
						if($i < sizeof($val)){
							
							// Stringify array for file
							$lineText .= ',';
						}
					}
				}
			}
			
			// Fill player file
			fwrite($f, $lineText . PHP_EOL);
		}
		
		// Close player file
		fclose($f);
	}
	
	/** 
	* Delete the player
	* 
	* @access 	public
	* @return 	boolean
	* @see 		delete()
	*/
	public function delete(){
		return unlink($this->file . $this->session . '.db');
	}
}
?>