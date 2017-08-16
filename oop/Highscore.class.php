<?php
class Highscore{
	private $file;
	
	public function __construct($path){
		$this->file = $path . '/highscore.db';
	}
	
	private function getDefault(){
		return array(
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
		if(!isset($params['name']) || !isset($params['date']) || !isset($params['lvl']) || !isset($params['exp'])){
			return false;
		}
		
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
				$lineText .= 'date:' . $params['date'] . ',';
				$lineText .= 'lvl:' . $params['lvl'] . ',';
				$lineText .= 'exp:' . $params['exp'];
				
				fwrite($f, $lineText . PHP_EOL);
			}
			
			fwrite($f, $line . PHP_EOL);
		}
		
		fclose($f);
		
		return true;
	}
	
	public function delete(){
		return unlink($this->file);
	}
}
?>