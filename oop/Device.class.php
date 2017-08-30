<?php
/**
* Class to detect the actual device
* 
* @author 			Jules Rau <admin@jules-rau.de>
* @copyright 		Jules Rau
* @license 			MIT license
* @origin 			https://github.com/ammerzone/labyrinth
* @version 	1.0		30.08.2017
*/
class Device{
	
	/** 
	* Check if device is tablet
	* 
	* @access 	private
	* @return 	boolean
	* @see 		isTablet()
	*/
	public function isTablet(){
		if(preg_match('/(tablet|ipad|playbook)|(android(?!.*(mobi|opera mini)))/i', strtolower($_SERVER['HTTP_USER_AGENT']))){
			return true;
		}
		
		if(strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'opera mini') > 0){
			
			//Check for tablets on opera mini alternative headers
			$stock_ua = strtolower(
				isset($_SERVER['HTTP_X_OPERAMINI_PHONE_UA']) ? $_SERVER['HTTP_X_OPERAMINI_PHONE_UA'] : (
					isset($_SERVER['HTTP_DEVICE_STOCK_UA']) ? $_SERVER['HTTP_DEVICE_STOCK_UA'] : ''
				)
			);
			
			if(preg_match('/(tablet|ipad|playbook)|(android(?!.*mobile))/i', $stock_ua)){
				return true;
			}
		}
		
		return false;
	}
	
	/** 
	* Check if device is mobile phone
	* 
	* @access 	private
	* @return 	boolean
	* @see 		isMobile()
	*/
	public function isMobile(){
		if(preg_match('/(up.browser|up.link|mmp|symbian|smartphone|midp|wap|phone|android|iemobile)/i', strtolower($_SERVER['HTTP_USER_AGENT']))){
			return true;
		}
		 
		if((strpos(strtolower($_SERVER['HTTP_ACCEPT']),'application/vnd.wap.xhtml+xml') > 0) or ((isset($_SERVER['HTTP_X_WAP_PROFILE']) or isset($_SERVER['HTTP_PROFILE'])))){
			return true;
		}
		
		$mobile_ua = strtolower(substr($_SERVER['HTTP_USER_AGENT'], 0, 4));
		
		$mobile_agents = array(
			'w3c ','acs-','alav','alca','amoi','audi','avan','benq','bird','blac',
			'blaz','brew','cell','cldc','cmd-','dang','doco','eric','hipt','inno',
			'ipaq','java','jigs','kddi','keji','leno','lg-c','lg-d','lg-g','lge-',
			'maui','maxo','midp','mits','mmef','mobi','mot-','moto','mwbp','nec-',
			'newt','noki','palm','pana','pant','phil','play','port','prox',
			'qwap','sage','sams','sany','sch-','sec-','send','seri','sgh-','shar',
			'sie-','siem','smal','smar','sony','sph-','symb','t-mo','teli','tim-',
			'tosh','tsm-','upg1','upsi','vk-v','voda','wap-','wapa','wapi','wapp',
			'wapr','webc','winw','winw','xda ','xda-'
		);
		 
		if(in_array($mobile_ua,$mobile_agents)){
			return true;
		}
		 
		if(strpos(strtolower($_SERVER['HTTP_USER_AGENT']),'opera mini') > 0){
			return true;
		}
		
		return false;
	}
	
	/** 
	* Check if device is desktop
	* 
	* @access 	private
	* @return 	boolean
	* @see 		isDesktop()
	*/
	public function isDesktop(){
		if($this->isMobile === true || $this->isTablet === true){
			return false;
		}
		
		return true;
	}
}
?>