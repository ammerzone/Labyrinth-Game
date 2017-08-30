<?php
require('autoload.php');

$session = 		isset($_SESSION['gameId']) ? 	$_SESSION['gameId'] : 	NULL;
$x = 			isset($_GET['x']) ? 			$_GET['x'] : 			NULL;
$y = 			isset($_GET['y']) ? 			$_GET['y'] : 			NULL;
$monsterName = 	isset($_GET['monster']) ? 		$_GET['monster'] : 		NULL;

if($session === NULL || $x === NULL || $y === NULL || $monsterName === NULL || $monsterName === false || $monsterName === 'false'){
	// close (victory)
	echo '<h2>Unerwarteter Fehler</h2>';
	echo '<p>Es ist ein unerwarteter Fehler aufgetreten, der Kampf kann so nicht stattfinden...</p>';
	echo '<button data-x="" data-y="" data-exp="0" data-gold="0" id="btn-win">Zur&uuml;ck zum Spiel</button>';
	die();
}

echo '<h2>Kampf gegen ' . $monsterName . '</h2>';

$player = new Player($session, '../../media/game');
$monster = new Monster('../../media/game');

// get player data
$playerData = $player->get();

// get monster data
$monsterData = $monster->get()[$monsterName];

// Add def to player tp
$playerData['stats']['tp'] += $playerData['stats']['def'];

// Add def to monster tp
$monsterData['tp'] += $monsterData['def'];

$result = null;

echo '<div id="battle-report">';
	while(true){
		// Player hit monster
		$playerHit = rand(floor($playerData['stats']['atk'] / 2), $playerData['stats']['atk']); 
		
		// Monster hit player
		$monsterHit = rand(floor($monsterData['atk'] / 2), $monsterData['atk']);
		
		// Monster tp down
		$monsterData['tp'] =- $playerHit;
		
		// Player tp down
		$playerData['stats']['tp'] -= $monsterHit; 
		
		echo '<p>' . $playerData['name'] . ' greift an. (' . $playerHit . ' Schaden, ' . $monsterData['tp'] . ' TP übrig)</p>';
		echo '<p>' . $monsterName . ' greift an. (' . $monsterHit . ' Schaden, ' . $playerData['stats']['tp'] . ' TP übrig)</p>';
		echo '<hr>';
		
		// if: monster tp <= 0 -> win (break loop)
		if($monsterData['tp'] <= 0){
			$result = 'win';
			break;
		}
		
		// if: my tp <= 0 -> lose (break loop)
		if($playerData['stats']['tp'] <= 0){
			$result = 'lose';
			break;
		}
	}
echo '</div>';

if($result === 'lose'){
	// Reset hero stats and equip and items
	$player->edit(
		array(
			'stats' => array(
				'tp' => 	$playerData['stats']['maxTp'], 
				'exp' => 	0, 
				'gold' => 	0
			), 
			'equiped' => array(
				'armour' => '', 
				'shield' => '', 
				'weapon' => ''
			),
			'items' => ''
		)
	);
	
	// Hide battle report
	echo '<script>$("#battle-report").slideUp(400);</script>';
	
	echo '<p>' . $monsterName . ' war leider stärker und hat dich im Kampf besiegt, was für eine Schande. Da du nun tod bist verlierst du sämtliche Spielfortschritte und beginnst nun von vorne</p>';
	
	// Close button
	echo '<button id="btn-lose">Zur&uuml;ck zum Spiel</button>';
}

if($result === 'win'){
	// Update hero exp, gold, tp
	$player->edit(
		array(
			'stats' => array(
				'tp' => 	min($playerData['stats']['tp'], $playerData['stats']['maxTp']), 
				'exp' => 	$playerData['stats']['exp'] + $monsterData['exp'], 
				'gold' => 	$playerData['stats']['gold'] + $monsterData['gold']
			), 
			'equiped' => array(
				'armour' => '', 
				'shield' => '', 
				'weapon' => ''
			)
		)
	);
	
	$map = new Map($session, '../../media/game');
	
	// Delete monster from map
	$map->edit(
		array(
			($x . ':' . $y) => array(
				'monster' => ''
			)
		)
	);
	
	// Hide battle report
	echo '<script>$("#battle-report").slideUp(400);</script>';
	
	echo '<p>Du hast den Kampf gegen ' . $monsterName . ' gewonnen, dir wird nun ' . $monsterData['exp'] . 'EXP und ' . $monsterData['gold'] . ' Gold gutgeschrieben.</p>';
	
	// Close button
	echo '<button data-x="' . $x . '" data-y="' . $y . '" data-exp="' . $monsterData['exp'] . '" data-gold="' . $monsterData['gold'] . '" id="btn-win">Zur&uuml;ck zum Spiel</button>';
}
?>