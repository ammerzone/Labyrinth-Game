<?php
class Map{
	private $session;
	private $path;
	private $file;
	private $lab;
	
	public function __construct($session, $path){
		$this->session = 	$session;
		$this->file = $path . '/map/';
		$this->path = $path;
		$this->lab = array(
			'width' => 		5, 
			'height' => 	5, 
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
	
	public function get(){
		$map = array();
		
		if(!file_exists($this->file . $this->session . '.db'))
			$this->add();
		
		foreach(file($this->file . $this->session . '.db') as $key => $file){
			$out = explode(',', $file);
			
			if(sizeof($out) > 1){
				$map[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					$map[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = isset($sub[1]) ? preg_replace('#\r|\n#', '', $sub[1]) : '';
				}
			}else{
				$out = explode(':', $file);
				$map[preg_replace('#\r|\n#', '', $out[0])] = isset($out[1]) ? preg_replace('#\r|\n#', '', $out[1]) : '';
			}
		}
		
		return $map;
	} 
	
	public function create(){
		$this->setStartEnd();
		$this->initField();
		$this->buildField();
		
		$map = $this->getDefault();
		$map['size']['x'] = $this->lab['width'];
		$map['size']['y'] = $this->lab['height'];
		$map['start'] = 	$this->lab['start'];
		$map['end'] = 		$this->lab['end'];
		
		foreach($this->lab['field'] as $y => $data){
			foreach($this->lab['field'][$y] as $x => $data){
				$map[$x . ':' . $y] = $data;
			}
		}
		
		return $map;
	}
	
	private function setStartEnd(){
		while(true){
			$this->lab['start']['x'] = 	rand(0, $this->lab['width'] - 1);
			$this->lab['start']['y'] = 	rand(0, $this->lab['height'] - 1);
			
			$this->lab['end']['x'] = 	rand(0, $this->lab['width'] - 1);
			$this->lab['end']['y'] = 	rand(0, $this->lab['height'] - 1);
			
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
			
			//if($vector >= min($this->lab['width'], $this->lab['height'])){
				break;
			//}
		}
	}
	
	private function initField(){
		for($i = 0; $i < $this->lab['height']; $i++){
			
			$this->lab['field'][$i] = array();

			for($j = 0; $j < $this->lab['width']; $j++){
				$this->lab['field'][$i][$j] = NULL;
			}
		}
		
		$this->fillField(
			'start', 
			$this->lab['start']['x'], 
			$this->lab['start']['y'], 
			NULL
		);
		
		$this->fillField(
			'end', 
			$this->lab['end']['x'], 
			$this->lab['end']['y'], 
			NULL
		);
	}
	
	private function buildField(){
		// init 
		$this->initField();
		
		$this->buildSolutionPath(
			$this->lab['start']['x'], 
			$this->lab['start']['y'], 
			array(), 
			array()
		);
		
		$groundPath = array();
		$wallPath = array();
		
		for($i = 0; $i < $this->lab['height']; $i++){
			
			for($j = 0; $j < $this->lab['width']; $j++){
				
				// act field is 30% ground, 70% wall
				if(rand(0, 9) <= 3)
					$groundPath = $this->fillField('ground', $j, $i, $groundPath);
				else
					$wallPath = $this->fillField('wall', $j, $i, $wallPath);
			}
		}
	}
	
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
		
		return $this->buildSolutionPath(
			$actX, 
			$actY, 
			$directionPath, 
			$groundPath
		);
	}
	
	private function getSolutionDirections($actX, $actY){
		$dirs = array();
		
		if($this->getNeighbours($actX + 1, $actY) == 1 || $this->hasEndNeigbour($actX + 1, $actY)){
			if($actX < $this->lab['width'] - 1){
				array_push($dirs, 'R');
			}
		}
		if($this->getNeighbours($actX - 1, $actY) == 1 || $this->hasEndNeigbour($actX - 1, $actY)){
			if($actX > 0){
				array_push($dirs, 'L');
			}
		}
		if($this->getNeighbours($actX, $actY + 1) == 1 || $this->hasEndNeigbour($actX, $actY + 1)){
			if($actY < $this->lab['height'] - 1){
				array_push($dirs, 'D');
			}
		}
		if($this->getNeighbours($actX, $actY - 1) == 1 || $this->hasEndNeigbour($actX, $actY - 1)){
			if($actY > 0){
				array_push($dirs, 'T');
			}
		}
		
		return $dirs;
	}
	
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
	
	private function getMonster(){
		$monster = new Monster($this->path);
		
		$list = array();
		
		foreach($monster->get() as $key => $data){
			array_push($list, $key);
		}
		
		return $list[rand(0, sizeof($list) - 1)];
	}
	
	private function getItem(){
		$item = new Item($this->path);
		
		$list = array();
		
		foreach($item->get() as $key => $data){
			array_push($list, $key);
		}
		
		return $list[rand(0, sizeof($list) - 1)];
	}
	
	private function getNeighbours($x, $y){
		$x = intval($x);
		$y = intval($y);
		
		$neighbours = 0;
		
		if(array_key_exists($y, $this->lab['field'])){
			if(array_key_exists($x - 1, $this->lab['field'][$y])){
				if($this->lab['field'][$y][$x - 1] != NULL){ // check left
					$neighbours++;
				}
			}
			
			if(array_key_exists($x + 1, $this->lab['field'][$y])){
				if($this->lab['field'][$y][$x + 1] != NULL){ // check right
					$neighbours++;
				}
			}
		}
		
		if(array_key_exists($y - 1, $this->lab['field'])){
			if(array_key_exists($x, $this->lab['field'][$y - 1])){
				if($this->lab['field'][$y - 1][$x] != NULL){ // check top
					$neighbours++;
				}
			}
		}
		
		if(array_key_exists($y + 1, $this->lab['field'])){
			if(array_key_exists($x, $this->lab['field'][$y + 1])){
				if($this->lab['field'][$y + 1][$x] != NULL){ // check down
					$neighbours++;
				}
			}
		}
		
		return $neighbours;
	}
	
	private function hasEndNeigbour($x, $y){
		if($x === $this->lab['end']['x']){
			if($y === $this->lab['end']['y'] + 1)
				return true;
			if($y === $this->lab['end']['y'] - 1)
				return true;
		}
		if($y === $this->lab['end']['y']){
			if($x === $this->lab['end']['x'] + 1)
				return true;
			if($x === $this->lab['end']['x'] - 1)
				return true;
		}
		
		if($x === $this->lab['end']['x'] && $y === $this->lab['end']['y'])
			return true;
		
		return false;
	}
	
	public function add(){
		$params = $this->create();
		
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		foreach($params as $key => $data){
			
			$lineText = '';
			
			if(sizeof($data) > 1){
				$lineText .= $key . ',';
				
				$i = 0;
				foreach($data as $sub => $val){
					$i++;
					
					if(!is_array($val))
						$lineText .= $sub . ':' . $val . (($i < sizeof($data)) ? ',' : NULL);
				}
				
			}else{
				$lineText .= $key . ':' . $data;
			}
			
			fwrite($f, $lineText . PHP_EOL);
		}
		
		fclose($f);
	}
	
	public function edit($params){
		$arr = $this->get();
		
		if(array_key_exists('size', $params)){
			if(array_key_exists('x', $params['size'])){
				$arr['size']['x'] = $params['size']['x'];
			}
			
			if(array_key_exists('y', $params['size'])){
				$arr['size']['y'] = $params['size']['y'];
			}
		}
		
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
		
		for($i = 0; $i < $this->lab['height']; $i++){
			
			for($j = 0; $j < $this->lab['width']; $j++){
				if(array_key_exists($j . ':' . $i, $params)){
					if(array_key_exists('texture', $params[$j . ':' . $i])){
						$arr[$j . ':' . $i]['texture'] = $params[$j . ':' . $i]['texture'];
					}
					
					if(array_key_exists('type', $params[$j . ':' . $i])){
						$arr[$j . ':' . $i]['type'] = $params[$j . ':' . $i]['type'];
					}
					
					if(array_key_exists('monster', $params[$j . ':' . $i])){
						$arr[$j . ':' . $i]['monster'] = $params[$j . ':' . $i]['monster'];
					}
					
					if(array_key_exists('item', $params[$j . ':' . $i])){
						$arr[$j . ':' . $i]['item'] = $params[$j . ':' . $i]['item'];
					}
				}
			}
		}
		
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		foreach($arr as $key => $data){
			
			$lineText = '';
			
			if(sizeof($data) > 1){
				$lineText .= $key . ',';
				
				$i = 0;
				foreach($data as $sub => $val){
					$i++;
					
					if(!is_array($val))
						$lineText .= $sub . ':' . $val . (($i < sizeof($data)) ? ',' : NULL);
				}
				
			}else{
				$lineText .= $key . ':' . $data;
			}
			
			fwrite($f, $lineText . PHP_EOL);
		}
		
		fclose($f);
	}
	
	public function delete(){
		if(file_exists($this->file . $this->session . '.db')){
			return unlink($this->file . $this->session . '.db');
		}
		
		return false;
	}
}
?>