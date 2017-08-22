<?php require_once('autoload.php'); ?>
<?php $_SESSION['gameId'] = isset($_SESSION['gameId']) ? $_SESSION['gameId'] : uniqid(); ?>
<!DOCTYPE>
<html>
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta name="robots" content="index, follow, archive">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title></title>
	
	<link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
  
	<script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
	<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	<script>
		var gameId = '<?=$_SESSION['gameId'];?>';
	</script>
</head>
<body>
	<div class="" id="game-canvas"></div>
	<div class="" id="game-navigation">
		<div class="container">
			<div class="col-xs-6">
				<ul class="nav nav-pills navbar-left">
					<li class="">
						<a class="navButton" id="buttonAccount"><span class="glyphicon glyphicon-user" title="Account"></span></a>
					</li>
					<li class="">
						<a class="navButton" id="buttonInventory"><span class="glyphicon glyphicon-book" title="Inventar"></span></a>
					</li>
				</ul>
				
				<div class="pull-right">
					<table>
						<tr>
							<th>LVL: </th>
							<td>
								<span id="lvl">1</span>
							</td>
							
							<td>&emsp;&emsp;</td>
							
							<th>EXP: </th>
							<td class="text-center">
								<span id="actEXP">0</span>
							</td>
						</tr>
						<tr>
							<th>GOLD: </th>
							<td>
								<span id="gold">0</span>
							</td>
							
							<td>&emsp;&emsp;</td>
							
							<th>TP: </th>
							<td style="min-width: 100px;">
								<div class="progress">
									<div class="progress-text">
										<span id="actTP">100</span> / <span id="maxTP">100</span>
									</div>
									<div class="progress-bar" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div>
								</div>
							</td>
						</tr>
					</table>
				</div>
			</div>
			<div class="col-xs-6">
				<ul class="nav nav-pills navbar-right">
					<li class="">
						<a class="navButton" id="buttonSettings"><span class="glyphicon glyphicon-cog" title="Einstellungen"></span></a>
					</li>
					<li class="">
						<a class="navButton" id="buttonHighscore"><span class="glyphicon glyphicon-king" title="Highscore"></span></a>
					</li>
					<li class="">
						<a class="navButton" id="buttonHelp"><span class="glyphicon glyphicon-question-sign" title="Hilfe"></span></a>
					</li>
				</ul>
			</div>
		</div>
	</div>
	<div id="game-popup-background"></div>
	<div id="game-popup"></div>
	<div id="game-help-background"></div>
	<div id="game-help"></div>
	<img class="hidden" id="hero-image" src="media/img/player/hero1.png">
	
	<link rel="stylesheet" href="css/main.css">
	<script src="js/main.js"></script>
	<script src="js/canvas.js"></script>
	<script src="js/gameCanvas.js"></script>
	<script src="js/heroCanvas.js"></script>
	<script src="js/monsterCanvas.js"></script>
	<script src="js/itemCanvas.js"></script>
	<script src="js/ajax.js"></script>
</body>
</html>