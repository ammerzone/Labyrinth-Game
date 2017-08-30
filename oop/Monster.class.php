<?php
/**
* Administration for the actual monster data (file)
* Operations: Add, Edit, Get, Delete
* 
* @author 			Jules Rau <admin@jules-rau.de>
* @copyright 		Jules Rau
* @license 			MIT license
* @origin 			https://github.com/ammerzone/webcam-login
* @version 	1.0		20.03.2017
*/
class Monster{
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
		$this->file = $path . '/monsterList.db';
	}
	
	/** 
	* Initialize monster default values
	* 
	* @access 	private
	* @return 	array
	* @see 		getDefault()
	*/
	private function getDefault(){
		return array(
			'tp' => 	0,
			'atk' => 	0,
			'def' => 	0,
			'exp' => 	0,
			'gold' => 	0
		);
	}
	
	/** 
	* Get monster values
	* 
	* @access 	public
	* @return 	array
	* @see 		get()
	*/
	public function get(){
		$monster = array();
		
		// Open monster file line after line
		foreach(file($this->file) as $key => $file){
			$out = explode(',', $file);
			
			// Check if sub-array exists
			if(sizeof($out) > 1){
				
				// Init sub-array
				$monster[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				// For every sub-element
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					// Append to array
					$monster[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = preg_replace('#\r|\n#', '', $sub[1]);
				}
			}else{
				$out = explode(':', $file);
				
				// Append to array
				$monster[preg_replace('#\r|\n#', '', $out[0])] = preg_replace('#\r|\n#', '', $out[1]);
			}
		}
		
		return $monster;
	}
	
	/** 
	* Add new monster
	* 
	* @access 	public
	* @param 	string 	$params
	* @return 	void
	* @see 		add()
	*/
	public function add($params){
		
		// Open or create file
		$f = fopen($this->file, 'wb');
		fclose($f);
		
		// Edit
		$this->edit($params);
	}
	
	/** 
	* Edit monster values
	* 
	* @access 	public
	* @param 	array 	$params
	* @return 	void
	* @see 		edit()
	*/
	public function edit($params){
		
		// Open monster file
		$f = fopen($this->file, 'wb');
		
		foreach(file($this->file) as $key => $file){
			$out = explode(',', $file);
			
			$lineText = '';
			
			// Check if sub-array exists
			if(sizeof($out) > 1){
				$arrTitle = $out[0];
				$lineText .=  $arrTitle . ',';
				unset($out[0]);
				
				// For each sub-array element
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
	* Delete monsters
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