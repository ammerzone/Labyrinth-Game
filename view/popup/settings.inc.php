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

<h2>Einstellungen</h2>
<table>
	<tr>
		<th>Sound:</th>
		<td>
			<label class="sliderLabel">
				<input type="checkbox" id="change-setting-sound" <?=isset($data['settings']['sound']) ? (($data['settings']['sound'] === 'on') ? 'checked' : NULL) : NULL;?>>
				<span class="slider">
					<span class="sliderOn">ON</span>
					<span class="sliderOff">OFF</span>
					<span class="sliderBlock"></span>
				</span>
			</label>
		</td>
	</tr>
	<tr>
		<th>Effekte</th>
		<td>
			<label class="sliderLabel">
				<input type="checkbox" id="change-setting-effects" <?=isset($data['settings']['effects']) ? (($data['settings']['effects'] === 'on') ? 'checked' : NULL) : NULL;?>>
				<span class="slider">
					<span class="sliderOn">ON</span>
					<span class="sliderOff">OFF</span>
					<span class="sliderBlock"></span>
				</span>
			</label>
		</td>
	</tr>
	<tr>
		<th>Hilfe</th>
		<td>
			<label class="sliderLabel">
				<input type="checkbox" id="change-setting-help" <?=isset($data['settings']['help']) ? (($data['settings']['help'] === 'on') ? 'checked' : NULL) : NULL;?>>
				<span class="slider">
					<span class="sliderOn">ON</span>
					<span class="sliderOff">OFF</span>
					<span class="sliderBlock"></span>
				</span>
			</label>
		</td>
	</tr>
</table>