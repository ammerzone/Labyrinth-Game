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
$items = new Item('../../media/game');

$data = $player->get();

$inventory = array();

if(isset($data['items'])){
	if(is_array($data['items'])){
		$inventory = $data['items'];
	}
}
unset($data);
?>

<h2>Inventar</h2>

<div class="inventory-scroll">
	<?php if(sizeof($inventory) === 0): ?>
		<p>Du besitzt noch keine Gegenstände, geh hinaus in die weite Welt und Sammle Dinge auf.</p>
		<p>Bewege dich in die Nähe eines Gegenstands um es aufzusammeln und deinem Inventar hinzuzufügen.</p>
	<?php endif; ?>
	<?php foreach($inventory as $item => $amount): ?>
		<div class="inventory-item">
			<?php $data = $items->get($item); ?>
			<table>
				<tr>
					<td width="74px">
						<img src="media/icon/item/<?=$data['type'];?>/<?=$data['image'];?>" style="margin-left:5px; width: 64px; height: 64px;">
					</td>
					<td width="120px">
						<div class="col-xs-6">
							<b>Anzahl:</b>
						</div>
						<div class="col-xs-6">
							<span class="item-amount"><?=$amount;?></span>
						</div><br>
						
						<div class="col-xs-6">
							<b>ATK:</b>
						</div>
						<div class="col-xs-6">
							<span class="item-atk">+<?=$data['atk'];?></span>
						</div><br>
						
						<div class="col-xs-6">
							<b>DEF:</b>
						</div>
						<div class="col-xs-6">
							<span class="item-def">+<?=$data['def'];?></span>
						</div><br>
						
						<div class="col-xs-6">
							<b>TP:</b>
						</div>
						<div class="col-xs-6">
							<span class="item-tp">+<?=$data['tp'];?></span>
						</div><br>
					</td>
					<td width="250px">
						<b><?=$item;?></b>
						<p><?=$data['description'];?></p>
					</td>
					<td>
						<a href="" class="btn btn-success inventory-select" data-item="<?=$item;?>">
							Nutzen <span class="glyphicon glyphicon-plus"></span>
						</a>
						<br><br>
						<a href="" class="btn btn-danger inventory-delete" data-item="<?=$item;?>">
							Löschen <span class="glyphicon glyphicon-trash"></span>
						</a>
					</td>
				</tr>
			</table>
		</div>
	<?php endforeach; ?>
</div>