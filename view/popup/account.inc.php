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

// Get player data
$data = $player->get();
?>

<h2>Account</h2>
<div class="pull-left">
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
</div>
<div class="pull-right">
	<div class="account-hero">
		<img src="media/img/player/silhuette.png" height="200px">
		<div class="weapon">
			<?php if(isset($data['equiped']['weapon'])): ?>
				<?php if(strlen($data['equiped']['weapon']) > 0 && file_exists('../../media/img/player/equipment/' . $data['equiped']['weapon'] . '.png')): ?>
					<img src="../../media/img/player/equipment/<?=$data['equiped']['weapon'];?>.png" width="" height="">
				<?php endif; ?>
			<?php endif; ?>
		</div>
		<div class="armour">
			<?php if(isset($data['equiped']['armour'])): ?>
				<?php if(strlen($data['equiped']['armour']) > 0 && file_exists('../../media/img/player/equipment/' . $data['equiped']['armour'] . '.png')): ?>
					<img src="../../media/img/player/equipment/<?=$data['equiped']['armour'];?>.png" width="" height="">
				<?php endif; ?>
			<?php endif; ?>
		</div>
		<div class="shield">
			<?php if(isset($data['equiped']['shield'])): ?>
				<?php if(strlen($data['equiped']['shield']) > 0 && file_exists('../../media/img/player/equipment/' . $data['equiped']['shield'] . '.png')): ?>
					<img src="../../media/img/player/equipment/<?=$data['equiped']['shield'];?>.png" width="" height="">
				<?php endif; ?>
			<?php endif; ?>
		</div>
	</div>
</div>