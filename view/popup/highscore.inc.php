<?php
require('autoload.php');

$highscore = new Highscore('../../media/game');

// Get highscore data
$data = $highscore->get();
?>

<h2>Highscore</h2>

<div class="highscore-scroll">
	<table class="table table-striped">
		<tr>
			<th class="text-left">&emsp;</th>
			<th class="text-left">Name&emsp;</th>
			<th class="text-left">Datum&emsp;</th>
			<th class="text-center">LVL</th>
			<th class="text-center">EXP</th>
		</tr>
		<?php foreach($data as $key => $item): ?>
			<tr>
				<td class="text-left"><?=$key + 1;?>.</td>
				<td class="text-left"><?=$item['name'];?></td>
				<td class="text-left"><?=$item['date'];?></td>
				<td class="text-center"><?=$item['lvl'];?></td>
				<td class="text-center"><?=$item['exp'];?></td>
			</tr>
		<?php endforeach; ?>
	</table>
</div>