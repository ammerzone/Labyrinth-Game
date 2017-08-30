<?php
class Highscore{
	private $file;
	
	public function __construct($path){
		$this->file = $path . '/highscore.db';
	}
	
	private function getDefault(){
		return array(
			'id' => 	'', 
			'name' => 	'',
			'date' => 	'', 
			'lvl' => 	'', 
			'exp' => 	''
		);
	}
	
	public function get(){
		$highscore = array();
		
		if(!file_exists($this->file))
			$this->add();
		
		foreach(file($this->file) as $key => $line){
			
			$highscore[$key] = array();
			
			foreach(explode(',', $line) as $sub => $data){
				$val = explode(':', $data);
				
				$highscore[$key][$val[0]] = isset($val[1]) ? $val[1] : '';
			}
		}
		
		return $highscore;
	}
	
	public function add(){
		$f = fopen($this->file, 'wb');
		fclose($f);
	}
	
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
		/*
		$f = fopen($this->file, 'wb');
		
		$i = 0;
		
		foreach(file($this->file) as $key => $line){
			$i++;
			
			if($i >= 100){
				break;
			}
			
			foreach(explode(',', $line) as $sub => $data){
				$val = explode(':', $data);
				
				$isBetter = false;
				
				if($val[0] === 'exp'){
					if(isset($val[1])){
						if($val[1] >= $params['exp']){
							$isBetter = true;
						}
					}
				}
			}
			
			if($isBetter === true){
				$i++;
				
				$lineText = '';
				$lineText .= 'name:' . $params['name'] . ',';
				$lineText .= 'date:' . date('d.m.Y', time()) . ',';
				$lineText .= 'lvl:' . $params['lvl'] . ',';
				$lineText .= 'exp:' . $params['exp'];
				
				fwrite($f, $lineText . PHP_EOL);
			}
			
			fwrite($f, $line . PHP_EOL);
		}
		
		fclose($f);
		*/
		return true;
	}
	
	public function delete(){
		return unlink($this->file);
	}
}
?>