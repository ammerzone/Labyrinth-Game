<?php
require('autoload.php');

$session = isset($_SESSION['gameId']) ? $_SESSION['gameId'] : NULL;

if($session === NULL){
	echo json_encode(
		array(
			'status' => false
		)
	);
	die();
}

$player = new Player($session, '../../media/game');

$data = $player->get();
?>

<h2>Account</h2>

<table>
	<tr>
		<th>Name: </th>
		<td>
			<?=isset($data['name']) ? $data['name'] : NULL;?>
		</td>
	</tr>
	<tr>
		<th>EXP: </th>
		<td>
			<?=isset($data['stats']['exp']) ? $data['stats']['exp'] : NULL;?>
		</td>
	</tr>
	<tr>
		<th>LVL: </th>
		<td>
			<?=isset($data['stats']['lvl']) ? $data['stats']['lvl'] : NULL;?>
		</td>
	</tr>
	<tr>
		<th>Gold: </th>
		<td>
			<?=isset($data['stats']['gold']) ? $data['stats']['gold'] : NULL;?>
		</td>
	</tr>
	<tr>
		<th>Leben: </th>
		<td>
			<?=isset($data['stats']['tp']) ? $data['stats']['tp'] : NULL;?> / <?=isset($data['stats']['maxTp']) ? $data['stats']['maxTp'] : NULL;?>
		</td>
	</tr>
	<tr>
		<th>Verteidigung: </th>
		<td>
			<?=isset($data['stats']['def']) ? $data['stats']['def'] : NULL;?>
		</td>
	</tr>
	<tr>
		<th>Angriff: </th>
		<td>
			<?=isset($data['stats']['atk']) ? $data['stats']['atk'] : NULL;?>
		</td>
	</tr>
</table>