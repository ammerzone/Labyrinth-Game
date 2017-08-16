<?php
class Monster{
	private $file;
	
	public function __construct($path){
		$this->file = $path . '/monsterList.db';
	}
	
	private function getDefault(){
		return array(
			'tp' => 	0,
			'atk' => 	0,
			'def' => 	0,
			'exp' => 	0,
			'gold' => 	0
		);
	}
	
	public function get(){
		$monster = array();
		
		foreach(file($this->file) as $key => $file){
			$out = explode(',', $file);
			
			if(sizeof($out) > 1){
				$monster[preg_replace('#\r|\n#', '', $out[0])] = array();
				
				$arrTitle = preg_replace('#\r|\n#', '', $out[0]);
				unset($out[0]);
				
				foreach($out as $subkey => $data){
					$sub = explode(':', $data);
					
					$monster[$arrTitle][preg_replace('#\r|\n#', '', $sub[0])] = preg_replace('#\r|\n#', '', $sub[1]);
				}
			}else{
				$out = explode(':', $file);
				$monster[preg_replace('#\r|\n#', '', $out[0])] = preg_replace('#\r|\n#', '', $out[1]);
			}
		}
		
		return $monster;
	}
	
	public function add($params){
		$f = fopen($this->file, 'wb');
		fclose($f);
		
		$this->edit($params);
	}
	
	public function edit($params){
		$f = fopen($this->file, 'wb');
		
		foreach(file($this->file) as $key => $file){
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
		return unlink($this->file);
	}
}
?>