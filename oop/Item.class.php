<?php
/**
* Administration for the items data (file)
* Operations: Add, Edit, Get, Delete
* 
* @author 			Jules Rau <admin@jules-rau.de>
* @copyright 		Jules Rau
* @license 			MIT license
* @origin 			https://github.com/ammerzone/labyrinth
* @version 	1.0		30.08.2017
*/
class Item{
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
	* @param 	string 	$path
	* @return 	void
	*/
	public function __construct($path){
		$this->file = $path . '/itemList.db';
	}
	
	/** 
	* Initialize item default values
	* 
	* @access 	private
	* @return 	array
	* @see 		getDefault()
	*/
	private function getDefault(){
		return array(
			'type' => 	'other',
			'amount' => 0,
			'atk' => 	0,
			'def' => 	0,
			'tp' => 	0,
			'image' => 	''
		);
	}
	
	/** 
	* Check item type
	* 
	* @access 	private
	* @param 	string 	$type
	* @return 	array
	* @see 		checkType()
	*/
	private function checkType($type){
		switch($type){
			case 'other': 
			case 'weapon': 
			case 'armour': 
			case 'shield': 	return true;
			default: 		return false;
		}
		
		return false;
	}
	
	/** 
	* Get item values
	* 
	* @access 	public
	* @param 	string 	$value
	* @return 	array
	* @see 		get()
	*/
	public function get($value = NULL){
		$item = array();
		
		// For each item element
		foreach(file($this->file) as $key => $file){
			$out = explode(',', $file);
			
			// Check if sub-array exists
			if(sizeof($out) > 1){
				
				// Append to array
				$item[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				// For every sub-array element
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					// Append to array
					$item[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = preg_replace('#\r|\n#', '', $sub[1]);
				}
			}else{
				$out = explode(':', $file);
				
				// Append to array
				$item[preg_replace('#\r|\n#', '', $out[0])] = preg_replace('#\r|\n#', '', $out[1]);
			}
		}
		
		// If single element
		if($value != NULL){
			if(isset($item[$value])){
				
				// Return only one element
				return $item[$value];
			}else{
				return array();
			}
		}
		
		return $item;
	}
	
	/** 
	* Add new item list
	* 
	* @access 	public
	* @param 	array 	$params
	* @return 	void
	* @see 		add()
	*/
	public function add($params){
		
		// Open or create file
		$f = fopen($this->file, 'wb');
		fclose($f);
		
		// Edit file
		$this->edit($params);
	}
	
	/** 
	* Edit item values
	* 
	* @access 	public
	* @param 	array 	$params
	* @return 	void
	* @see 		edit()
	*/
	public function edit($params){
		
		// Open or create file
		$f = fopen($this->file, 'wb');
		
		// For each element
		foreach(file($this->file) as $key => $file){
			$out = explode(',', $file);
			
			$lineText = '';
			
			// Check if sub-array exists
			if(sizeof($out) > 1){
				$arrTitle = $out[0];
				$lineText .=  $arrTitle . ',';
				unset($out[0]);
				
				// For every sub-array element
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					if(array_key_exists($arrTitle, $params)){
						if(array_key_exists($sub[0], $params[$arrTitle])){
							
							// Stringify array for file
							$lineText .= $sub[0] . ':' . $params;
						}else{
							
							// Stringify array for file
							$lineText .= $sub[0] . ':' . $sub[1];
						}
					}else{
						
						// Stringify array for file
						$lineText .= $sub[0] . ':' . $sub[1];
					}
				}
			}else{
				$sub = explode(':', $data);
				
				if(array_key_exists($sub[0], $params)){
					
					// Stringify array for file
					$lineText .= $sub[0] . ':' . $params;
				}else{
					
					// Stringify array for file
					$lineText .= $sub[0] . ':' . $sub[1];
				}
			}
			
			// Write data to file
			fwrite($f, $lineText);
			
		}
		
		// Close file
		fclose($f);
	}
	
	/** 
	* Delete items
	* 
	* @access 	public
	* @return 	boolean
	* @see 		delete()
	*/
	public function delete(){
		return unlink($this->file);
	}
}
?>