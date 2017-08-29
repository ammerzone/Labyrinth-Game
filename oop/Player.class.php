<?php
class Player{
	private $session;
	private $file;
	
	public function __construct($session, $path){
		$this->session = $session;
		$this->file = $path . '/player/';
	}
	
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
	
	public function get(){
		$player = array();
		
		if(!file_exists($this->file . $this->session . '.db'))
			$this->add();
		
		foreach(file($this->file . $this->session . '.db') as $key => $file){
			$out = explode(',', $file);
			
			if(sizeof($out) > 1){
				$player[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					$player[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = isset($sub[1]) ? preg_replace('#\r|\n#', '', $sub[1]) : '';
				}
			}else{
				$out = explode(':', $file);
				$player[preg_replace('#\r|\n#', '', $out[0])] = isset($out[1]) ? preg_replace('#\r|\n#', '', $out[1]) : '';
			}
		}
		
		return $player;
	}
	
	public function add($name = NULL){
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		$arr = $this->getDefault();
		
		if($name != NULL){
			$arr['name'] = $name;
		}
		
		foreach($arr as $key => $val){
			$lineText = '';
			
			if(!is_array($val)){
				$lineText .= $key . ':' . $val;
			}else{
				$lineText .= $key;
				
				if(sizeof($val) > 0){
					$lineText .= ',';
					
					$i = 0;
					foreach($val as $sub => $data){
						$i++;
						
						$lineText .= $sub . ':' . $data;
						
						if($i < sizeof($val)){
							$lineText .= ',';
						}
					}
				}
			}
			
			fwrite($f, $lineText . PHP_EOL);
		}
		
		fclose($f);
	}
	
	public function edit($params){
		$arr = $this->get();
		
		if(!is_array($arr['items'])){
			$arr['items'] = array();
		}
		
		if(array_key_exists('name', $params)){
			$arr['name'] = $params['name'];
		}
		
		if(array_key_exists('settings', $params)){
			foreach($params['settings'] as $key => $data){
				if(array_key_exists($key, $arr['settings'])){ 
					$arr['settings'][$key] = $data;
				}
			}
		}
		
		if(array_key_exists('stats', $params)){
			foreach($params['stats'] as $key => $data){
				if(array_key_exists($key, $arr['stats'])){
					if($key === 'Gold' || $key === 'gold'){
						$arr['stats'][$key] = intval($arr['stats'][$key]) + $data;
					}else{
						$arr['stats'][$key] = $data;
					}
				}
			}
		}
		
		if(array_key_exists('equiped', $params)){
			foreach($params['equiped'] as $key => $data){
				if(array_key_exists($key, $arr['equiped'])){
					$arr['equiped'][$key] = $data;
				}
			}
		}
		
		if(array_key_exists('items', $params)){
			foreach($params['items'] as $item => $amount){
				if(array_key_exists($item, $arr['items'])){
					$arr['items'][$item] = intval($arr['items'][$item]) + $amount;
				}else{
					$arr['items'][$item] = $amount;
				}
			}
		}
		
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		foreach($arr as $key => $val){
			$lineText = '';
			
			if(!is_array($val)){
				$lineText .= $key . ':' . $val;
			}else{
				$lineText .= $key;
				
				if(sizeof($val) > 0){
					$lineText .= ',';
					
					$i = 0;
					foreach($val as $sub => $data){
						$i++;
						
						$lineText .= $sub . ':' . $data;
						
						if($i < sizeof($val)){
							$lineText .= ',';
						}
					}
				}
			}
			
			fwrite($f, $lineText . PHP_EOL);
		}
		
		fclose($f);
	}
	
	public function delete(){
		return unlink($this->file . $this->session . '.db');
	}
}
?>