<?php
define('LAB_HEIGHT', 25);
define('LAB_WIDTH', 35);

/**
* Administration for the actual map data (file)
* Operations: Add, Edit, Get, Delete
* 
* @author 			Jules Rau <admin@jules-rau.de>
* @copyright 		Jules Rau
* @license 			MIT license
* @origin 			https://github.com/ammerzone/labyrinth
* @version 	1.0		30.08.2017
*/
class Map{
	/**
	* Value of the session
	* 
	* @var 		string
	* @access 	private
	*/
	private $session;
	
	/**
	* Partial path of the map data-file
	* 
	* @var 		string
	* @access 	private
	*/
	private $path;
	
	/**
	* Path of the map data-file
	* 
	* @var 		string
	* @access 	private
	*/
	private $file;
	
	/**
	* General default data
	* 
	* @var 		array
	* @access 	private
	*/
	private $lab;
	
	/**
	* Constructs the Object
	* 
	* @access 	public
	* @param 	string	$session
	* @param 	string 	$path
	* @return 	void
	*/
	public function __construct($session, $path){
		$this->session = 	$session;
		$this->file = $path . '/map/';
		$this->path = $path;
		$this->lab = array(
			'width' => 		LAB_WIDTH,  
			'height' => 	LAB_HEIGHT, 
			'ground' => 	array(0, 1, 2, 3, 4, 5), 
			'wall' => 		array(0), 
			'start' => 		array(
				'char' => 	'0', 
				'x' => 		0, 
				'y' => 		0
			), 
			'end' => 		array(
				'char' => 	'0', 
				'x' => 		0, 
				'y' => 		0
			), 
			'field' => 		array()
		);
	}
	
	/** 
	* Initialize map default values for a coordinate
	* 
	* @access 	private
	* @return 	array
	* @see 		getDefault()
	*/
	private function getDefault(){
		return array(
			'size' => array(
				'x' => 0, 
				'y' => 0
			), 
			'start' => array(
				'x' => 0, 
				'y' => 0
			), 
			'end' => array(
				'x' => 0, 
				'y' => 0
			)
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
		$map = array();
		
		// Add new map if no exists
		if(!file_exists($this->file . $this->session . '.db'))
			$this->add();
		
		// For every line of the map file
		foreach(file($this->file . $this->session . '.db') as $key => $file){
			$out = explode(',', $file);
			
			// Check if sub-array exists
			if(sizeof($out) > 1){
				$map[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				// For each sub-array element
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					// Stringify array for file
					$map[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = isset($sub[1]) ? preg_replace('#\r|\n#', '', $sub[1]) : '';
				}
			}else{
				$out = explode(':', $file);
				
				// Stringify array for file
				$map[preg_replace('#\r|\n#', '', $out[0])] = isset($out[1]) ? preg_replace('#\r|\n#', '', $out[1]) : '';
			}
		}
		
		return $map;
	} 
	
	/** 
	* Create labyrinth
	* 
	* @access 	private
	* @return 	array
	* @see 		initField()
	*/
	public function create(){
		$this->setStartEnd();
		$this->initField();
		$this->buildField();
		
		$map = $this->getDefault();
		
		$map['size']['x'] = $this->lab['width'];
		$map['size']['y'] = $this->lab['height'];
		$map['start'] = 	$this->lab['start'];
		$map['end'] = 		$this->lab['end'];
		
		// Init empty field
		foreach($this->lab['field'] as $y => $data){
			foreach($this->lab['field'][$y] as $x => $data){
				$map[$x . ':' . $y] = $data;
			}
		}
		
		return $map;
	}
	
	/** 
	* Set a start and a end position
	* 
	* @access 	private
	* @return 	boolean
	* @see 		setStartEnd()
	*/
	private function setStartEnd(){
		while(true){
			$this->lab['start']['x'] = 	rand(0, $this->lab['width'] - 1);
			$this->lab['start']['y'] = 	rand(0, $this->lab['height'] - 1);
			
			$this->lab['end']['x'] = 	rand(0, $this->lab['width'] - 1);
			$this->lab['end']['y'] = 	rand(0, $this->lab['height'] - 1);
			
			// Get vector length fron start to end point
			$vector = sqrt(
				pow(
					max(
						$this->lab['start']['x'] - $this->lab['end']['x'], 
						$this->lab['end']['x'] - $this->lab['start']['x']
					), 
					2
				)
				+ 
				pow(
					max(
						$this->lab['start']['y'] - $this->lab['end']['y'], 
						$this->lab['end']['y'] - $this->lab['start']['y']
					), 
					2
				)
			);
			
			// If vector is long enough: break
			if($vector >= min($this->lab['width'], $this->lab['height'])){
				break;
			}
		}
	}
	
	/** 
	* Init empty labyrinth fields
	* 
	* @access 	private
	* @return 	array
	* @see 		initField()
	*/
	private function initField(){
		
		// Init empty field
		for($i = 0; $i < $this->lab['height']; $i++){
			
			$this->lab['field'][$i] = array();

			for($j = 0; $j < $this->lab['width']; $j++){
				$this->lab['field'][$i][$j] = NULL;
			}
		}
		
		// Fill field with start coordinate
		$this->fillField(
			'start', 
			$this->lab['start']['x'], 
			$this->lab['start']['y'], 
			NULL
		);
		
		
		// Fill field with end coordinate
		$this->fillField(
			'end', 
			$this->lab['end']['x'], 
			$this->lab['end']['y'], 
			NULL
		);
	}
	
	/** 
	* Build the labyrinth
	* 
	* @access 	private
	* @return 	array
	* @see 		buldField()
	*/
	private function buildField(){
		
		// Init 
		$this->initField();
		
		// Build the solution path (recursive)
		$this->buildSolutionPath(
			$this->lab['start']['x'], 
			$this->lab['start']['y'], 
			array(), 
			array()
		);
		
		$groundPath = array();
		$wallPath = array();
		
		
		// For every field coordinate (y)
		for($i = 0; $i < $this->lab['height']; $i++){
			
			// For every field coordinate (x)
			for($j = 0; $j < $this->lab['width']; $j++){
				
				// act field is 30% ground, 70% wall
				if(rand(0, 9) <= 3){
					$groundPath = $this->fillField('ground', $j, $i, $groundPath);
				}else{
					$wallPath = $this->fillField('wall', $j, $i, $wallPath);
				}
			}
		}
	}
	
	/** 
	* Find a solution path in the empty field
	* 
	* @access 	private
	* @param 	integer 	$actX
	* @param 	integer 	$actY
	* @param 	string 		$directionPath
	* @param 	string 		$groundPath
	* @return 	array
	* @see 		buildSolutionPath()
	*/
	private function buildSolutionPath($actX, $actY, $directionPath, $groundPath){
		
		// get possible move directions
		$dirs = $this->getSolutionDirections(
			$actX, 
			$actY
		);
		
		// restart when no new position is possible
		if(sizeof($dirs) === 0){
			// 	reinit 
			$this->initField();
			
			// restart
			return $this->buildSolutionPath(
				$this->lab['start']['x'], 
				$this->lab['start']['y'], 
				array(), 
				array()
			);
		}
		
		// update act position to moved direction
		switch($dirs[rand(0, sizeof($dirs) - 1)]){
			case 'L': // left
					$actX--;
					array_push($directionPath, 'L');
				break;
			case 'T': // top
					$actY--;
					array_push($directionPath, 'T');
				break;
			case 'R': // right
					$actX++;
					array_push($directionPath, 'R');
				break;
			case 'D': // down
					$actY++;
					array_push($directionPath, 'D');
				break;
			default: break;
		}
		
		// end when new act position is end position
		if($actY === $this->lab['end']['y'] && $actX === $this->lab['end']['x']){
			return true;
		}
		
		// get neighbours of new act position
		$neighbours = $this->getNeighbours(
			$actX, 
			$actY
		);
		
		// fill act field
		$groundPath = $this->fillField(
			'ground', 
			$actX, 
			$actY, 
			$groundPath
		);
		
		// Build solution path (recursive)
		return $this->buildSolutionPath(
			$actX, 
			$actY, 
			$directionPath, 
			$groundPath
		);
	}
	
	/** 
	* Get all possible directions for the solution paths
	* 
	* @access 	private
	* @param 	integer 	$actX
	* @param 	integer 	$actY
	* @return 	array
	* @see 		getSolutionDirections()
	*/
	private function getSolutionDirections($actX, $actY){
		$dirs = array();
		
		// Check right neighbour
		if($this->getNeighbours($actX + 1, $actY) == 1 || $this->hasEndNeigbour($actX + 1, $actY)){
			
			// Check if right neighbour would be in the field
			if($actX < $this->lab['width'] - 1){
				array_push($dirs, 'R');
			}
		}
		
		// Check left neighbour
		if($this->getNeighbours($actX - 1, $actY) == 1 || $this->hasEndNeigbour($actX - 1, $actY)){
			
			// Check if left neighbour would be in the field
			if($actX > 0){
				array_push($dirs, 'L');
			}
		}
		
		// Check bottom neighbour
		if($this->getNeighbours($actX, $actY + 1) == 1 || $this->hasEndNeigbour($actX, $actY + 1)){
			
			// Check if bottom neighbour would be in the field
			if($actY < $this->lab['height'] - 1){
				array_push($dirs, 'D');
			}
		}
		
		// Check top neightbour
		if($this->getNeighbours($actX, $actY - 1) == 1 || $this->hasEndNeigbour($actX, $actY - 1)){
			
			// Check if top neighbour would be in the field
			if($actY > 0){
				array_push($dirs, 'T');
			}
		}
		
		return $dirs;
	}
	
	/** 
	* Fill rest of the map field with (random) data
	* 
	* @access 	private
	* @param 	string 		$type
	* @param 	integer 	$x
	* @param 	integer 	$y
	* @param 	integer 	$path
	* @return 	array
	* @see 		fillField()
	*/
	private function fillField($type, $x, $y, $path){
		
		// if act field is empty
		if($this->lab['field'][$y][$x] === NULL){
			
			// get last set path texture
			if(sizeof($path) > 0){
				$lastPath = array_pop($path);
			}else{
				$r = rand(0, sizeof($this->lab[$type]) - 1);
				if(isset($this->lab[$type][$r])){
					$lastPath = $this->lab[$type][$r];
				}else{
					$lastPath = NULL;
				}
			}
			
			$texture = NULL;
			
			if($lastPath != NULL){
				// 90% set same texture, 10% set new random texture
				if(rand(0, 9) <= 0){
					if(sizeof($this->lab[$type]) > 1){
						$texture = $this->lab[$type][rand(0, sizeof($this->lab[$type]) - 1)];
					}else{
						$texture = 0;
					}
				}else{
					$texture = $lastPath;
				}
			
				array_push($path, $texture);
			}else{
				$texture = 0;
			}
			
			// fill field on act position
			$this->lab['field'][$y][$x] = array(
				'texture' => 	$texture, 
				'type' => 		$type, 
				'data' => 		array()
			);
			
			switch($type){
				case 'ground':
					// fill act field randomly with monster (10%)
					$this->lab['field'][$y][$x]['monster'] = ((rand(0, 9) === 0) ? $this->getMonster() : false);
					
					// fill act field randomly with item when no monster (10%)
					if($this->lab['field'][$y][$x]['monster'] === false){
						$this->lab['field'][$y][$x]['item'] = ((rand(0, 9) === 0) ? $this->getItem() : false);
					}else{
						$this->lab['field'][$y][$x]['item'] = false;
					}
					break;
				case 'wall':
					// fill act field with no monster and no item
					$this->lab['field'][$y][$x]['monster'] = false;
					$this->lab['field'][$y][$x]['item'] = false;
					break;
				case 'start': 
					// fill act field with no monster and no item
					$this->lab['field'][$y][$x]['monster'] = false;
					$this->lab['field'][$y][$x]['item'] = false;
					
					// set start char as texture
					$this->lab['field'][$y][$x]['texture'] = $this->lab['start']['char'];
					break;
				case 'end': 
					// fill act field with no monster and no item
					$this->lab['field'][$y][$x]['monster'] = false;
					$this->lab['field'][$y][$x]['item'] = false;
					
					// set start char as texture
					$this->lab['field'][$y][$x]['texture'] = $this->lab['end']['char'];
					break;
				default: break;
			}
		}
		return $path;
	}
	
	/** 
	* Get monster list
	* 
	* @access 	private
	* @return 	array
	* @see 		getMonster()
	*/
	private function getMonster(){
		$monster = new Monster($this->path);
		
		$list = array();
		
		// Get only monster names as keys
		foreach($monster->get() as $key => $data){
			array_push($list, $key);
		}
		
		return $list[rand(0, sizeof($list) - 1)];
	}
	
	/** 
	* Get item list
	* 
	* @access 	private
	* @return 	array
	* @see 		getItem()
	*/
	private function getItem(){
		$item = new Item($this->path);
		
		$list = array();
		
		// Get only item names as keys
		foreach($item->get() as $key => $data){
			array_push($list, $key);
		}
		
		return $list[rand(0, sizeof($list) - 1)];
	}
	
	/** 
	* Get number of neighbours of a coordniate
	* 
	* @access 	private
	* @param 	integer 	$x
	* @param	integer		$y
	* @return 	void
	* @see 		getNeighbours()
	*/
	private function getNeighbours($x, $y){
		$x = intval($x);
		$y = intval($y);
		
		$neighbours = 0;
		
		// Check if y-coordinate exists
		if(array_key_exists($y, $this->lab['field'])){
			
			// Check if x-coordinate - 1 exists
			if(array_key_exists($x - 1, $this->lab['field'][$y])){
				
				// Check if left field is neighbour
				if($this->lab['field'][$y][$x - 1] != NULL){
					$neighbours++;
				}
			}
			
			// Check if x-coordinate + 1 exists
			if(array_key_exists($x + 1, $this->lab['field'][$y])){
				
				// Check if right field is neighbour
				if($this->lab['field'][$y][$x + 1] != NULL){
					$neighbours++;
				}
			}
		}
		
		// Check if y-coordinate - 1 exists
		if(array_key_exists($y - 1, $this->lab['field'])){
			
			// Check if x-coordinate exists
			if(array_key_exists($x, $this->lab['field'][$y - 1])){
				
				// Check if top field is neighbour
				if($this->lab['field'][$y - 1][$x] != NULL){
					$neighbours++;
				}
			}
		}
		
		// Check if y-coordinate + 1 exists
		if(array_key_exists($y + 1, $this->lab['field'])){
			
			// Check if x-coordinate exists
			if(array_key_exists($x, $this->lab['field'][$y + 1])){
				
				// Check if bottom field is neighbour
				if($this->lab['field'][$y + 1][$x] != NULL){
					$neighbours++;
				}
			}
		}
		
		return $neighbours;
	}
	
	/** 
	* Check if coordinate has the end coordinate as neigbour
	* 
	* @access 	private
	* @param 	integer 	$x
	* @param	integer		$y
	* @return 	boolean
	* @see 		hasEndNeigbour()
	*/
	private function hasEndNeigbour($x, $y){
		
		// Check if x-coordinate equals end-x-coordinate
		if($x === $this->lab['end']['x']){
			
			// Check if right neightbour is end point
			if($y === $this->lab['end']['y'] + 1){
				return true;
			}
			
			// Check if left neightbour is end point
			if($y === $this->lab['end']['y'] - 1){
				return true;
			}
		}
		
		// Check if y-coordinate equals end-y-coordinate
		if($y === $this->lab['end']['y']){
			
			// Check if bottom neightbour is end point
			if($x === $this->lab['end']['x'] + 1){
				return true;
			}
			
			// Check if top neightbour is end point
			if($x === $this->lab['end']['x'] - 1){
				return true;
			}
		}
		
		// Check if already stand on end position
		if($x === $this->lab['end']['x'] && $y === $this->lab['end']['y']){
			return true;
		}
		
		return false;
	}
	
	/** 
	* Add new map
	* 
	* @access 	public
	* @return 	void
	* @see 		add()
	*/
	public function add(){
		
		// Create new map
		$params = $this->create();
		
		// Open or Create map file
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		
		// For every created map element
		foreach($params as $key => $data){
			
			$lineText = '';
			
			// Check if sub-array exists
			if(sizeof($data) > 1){
				
				// Stringify array for file
				$lineText .= $key . ',';
				
				$i = 0;
				
				// For every sub-array element
				foreach($data as $sub => $val){
					$i++;
					
					if(!is_array($val)){
						
						// Stringify array for file
						$lineText .= $sub . ':' . $val . (($i < sizeof($data)) ? ',' : NULL);
					}
				}
				
			}else{
				
				// Stringify array for file
				$lineText .= $key . ':' . $data;
			}
			
			// Write data to file
			fwrite($f, $lineText . PHP_EOL);
		}
		
		// Close file
		fclose($f);
	}
	
	/** 
	* Edit map values
	* 
	* @access 	public
	* @param 	array 	$params
	* @return 	void
	* @see 		edit()
	*/
	public function edit($params){
		
		// Get data
		$arr = $this->get();
		
		// change array to new size data (x and y)
		if(array_key_exists('size', $params)){
			if(array_key_exists('x', $params['size'])){
				$arr['size']['x'] = $params['size']['x'];
			}
			
			if(array_key_exists('y', $params['size'])){
				$arr['size']['y'] = $params['size']['y'];
			}
		}
		
		// change array to new start data (char, x and y)
		if(array_key_exists('start', $params)){
			if(array_key_exists('char', $params['start'])){
				$arr['start']['char'] = $params['start']['char'];
			}
			
			if(array_key_exists('x', $params['start'])){
				$arr['start']['x'] = $params['start']['x'];
			}
			
			if(array_key_exists('y', $params['start'])){
				$arr['start']['y'] = $params['start']['y'];
			}
		}
		
		// change array to new end data (char, x and y)
		if(array_key_exists('end', $params)){
			if(array_key_exists('char', $params['end'])){
				$arr['end']['char'] = $params['end']['char'];
			}
			
			if(array_key_exists('x', $params['end'])){
				$arr['end']['x'] = $params['end']['x'];
			}
			
			if(array_key_exists('y', $params['end'])){
				$arr['end']['y'] = $params['end']['y'];
			}
		}
		
		// for every map y element
		for($i = 0; $i < $this->lab['height']; $i++){
			
			// for every map x element
			for($j = 0; $j < $this->lab['width']; $j++){
				
				// Check if koordinate is edited
				if(array_key_exists($j . ':' . $i, $params)){
					
					// Check if texture is edited
					if(array_key_exists('texture', $params[$j . ':' . $i])){
						
						// Change array to new elements texture
						$arr[$j . ':' . $i]['texture'] = $params[$j . ':' . $i]['texture'];
					}
					
					// Check if type is edited
					if(array_key_exists('type', $params[$j . ':' . $i])){
						
						// Change array to new elements type
						$arr[$j . ':' . $i]['type'] = $params[$j . ':' . $i]['type'];
					}
					
					// Check if monster is edited
					if(array_key_exists('monster', $params[$j . ':' . $i])){
						
						// Change array to new elements monster
						$arr[$j . ':' . $i]['monster'] = $params[$j . ':' . $i]['monster'];
					}
					
					// Check if item is edited
					if(array_key_exists('item', $params[$j . ':' . $i])){
						
						// Change array to new elements item
						$arr[$j . ':' . $i]['item'] = $params[$j . ':' . $i]['item'];
					}
				}
			}
		}
		
		// Open map file
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		// For every array element
		foreach($arr as $key => $data){
			
			$lineText = '';
			
			// if element if not empty
			
			if(sizeof($data) > 1){
				
				// Stringify array for file
				$lineText .= $key . ',';
				
				$i = 0;
				
				// For each sub-array element
				foreach($data as $sub => $val){
					$i++;
					
					if(!is_array($val)){
						
						// Stringify array for file
						$lineText .= $sub . ':' . $val . (($i < sizeof($data)) ? ',' : NULL);
					}
				}
				
			}else{
				
				// Stringify array for file
				$lineText .= $key . ':' . $data;
			}
			
			// Write data string to file
			fwrite($f, $lineText . PHP_EOL);
		}
		
		fclose($f);
	}
	
	/** 
	* Delete the map
	* 
	* @access 	public
	* @return 	boolean
	* @see 		delete()
	*/
	public function delete(){
		
		// Check if map file exsits
		if(file_exists($this->file . $this->session . '.db')){
			return unlink($this->file . $this->session . '.db');
		}
		
		return false;
	}
}
?>