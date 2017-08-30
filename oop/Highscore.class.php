<?php
/**
* Administration for the highscore data (file)
* Operations: Add, Edit, Get, Delete
* 
* @author 			Jules Rau <admin@jules-rau.de>
* @copyright 		Jules Rau
* @license 			MIT license
* @origin 			https://github.com/ammerzone/labyrinth
* @version 	1.0		30.08.2017
*/
class Highscore{
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
		$this->file = $path . '/highscore.db';
	}
	
	/** 
	* Initialize highscore default values
	* 
	* @access 	private
	* @return 	array
	* @see 		getDefault()
	*/
	private function getDefault(){
		return array(
			'id' => 	'', 
			'name' => 	'',
			'date' => 	'', 
			'lvl' => 	'', 
			'exp' => 	''
		);
	}
	
	/** 
	* Get highscore values
	* 
	* @access 	public
	* @return 	array
	* @see 		get()
	*/
	public function get(){
		$highscore = array();
		
		// Check if file exists
		if(!file_exists($this->file))
			$this->add();
		
		// For each highscore element
		foreach(file($this->file) as $key => $line){
			
			$highscore[$key] = array();
			
			// For every sub-array element
			foreach(explode(',', $line) as $sub => $data){
				$val = explode(':', $data);
				
				// Append to array
				$highscore[$key][$val[0]] = isset($val[1]) ? $val[1] : '';
			}
		}
		
		return $highscore;
	}
	
	/** 
	* Add new highscore file
	* 
	* @access 	public
	* @param 	string 	$name
	* @return 	void
	* @see 		add()
	*/
	public function add(){
		
		// Open or create file
		$f = fopen($this->file, 'wb');
		fclose($f);
	}
	
	/** 
	* Edit highscore values
	* 
	* @access 	public
	* @param 	array 	$params
	* @return 	boolean
	* @see 		edit()
	*/
	public function edit($params){
		$arr = array();
		
		$foundPlace = false;
		$i = 0;
		
		foreach($this->get() as $key => $data){
			$i++;
			
			if($foundPlace === false){
				if(intval($data['exp']) < intval($params['exp'])){
					
					array_push($arr, $params);
					
					$foundPlace = true;
					$i++;
				}elseif(intval($data['exp']) === intval($params['exp'])){
					if(intval($data['lvl']) < intval($params['lvl'])){
						array_push($arr, $params);
						
						$foundPlace = true;
						$i++;
					}
				}
			}
			
			if($foundPlace === false || $data['id'] != $params['id']){
				array_push($arr, $data);
			}
		}
		
		if($i < 100 && $foundPlace === false){
			array_push($arr, $params);
		}
		
		$f = fopen($this->file, 'wb');
		
		foreach($arr as $key => $value){
			$line = 	'id:' . preg_replace('#\r|\n#', '', $value['id']) . ',';
			$line .= 	'name:' . preg_replace('#\r|\n#', '', $value['name']) . ',';
			$line .= 	'date:' . preg_replace('#\r|\n#', '', $value['date']) . ',';
			$line .= 	'lvl:' . preg_replace('#\r|\n#', '', $value['lvl']) . ',';
			$line .= 	'exp:' . preg_replace('#\r|\n#', '', $value['exp']);
			
			fwrite($f, $line . PHP_EOL);
		}
		
		fclose($f);
		
		return true;
	}
	
	/** 
	* Delete Highscore
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