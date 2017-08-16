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
			'image' => array(
				'width' => 	32, 
				'height' => 32
			), 
			'position' => array(
				'x' => 	0, 
				'y' => 	0
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
				'sword' => 		'', 
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
		$f = fopen($this->file . $this->session . '.db', 'wb');
		
		foreach(file($this->file . $this->session . '.db') as $key => $file){
			$out = explode(',', $file);
			
			$lineText = '';
			
			if(sizeof($out) > 1){
				$arrTitle = $out[0];
				$lineText .=  $arrTitle . ',';
				unset($out[0]);
				
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					if(array_key_exists($arrTitle, $params)){
						if(array_key_exists($sub[0], $params[$arrTitle])){
							$lineText .= $sub[0] . ':' . $params;
						}else{
							$lineText .= $sub[0] . ':' . $sub[1];
						}
					}else{
						$lineText .= $sub[0] . ':' . $sub[1];
					}
				}
			}else{
				$sub = explode(':', $data);
				
				if(array_key_exists($sub[0], $params)){
					$lineText .= $sub[0] . ':' . $params;
				}else{
					$lineText .= $sub[0] . ':' . $sub[1];
				}
			}
			
			fwrite($f, $lineText);
			
		}
		
		fclose($f);
	}
	
	public function delete(){
		return unlink($this->file . $this->session . '.db');
	}
}
?>