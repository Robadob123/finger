<!DOCTYPE html>
<html lang="nb">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<link rel="stylesheet" type="text/css" href="css/style.css">
		<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">		<link href='https://fonts.googleapis.com/css?family=Open Sans' rel='stylesheet'>
		<link rel="stylesheet" href="https://use.typekit.net/bib2bqz.css">
		<script type="text/javascript" src="jquery-3.2.0.min.js"></script>
		<script type="text/javascript" src="plugindetect.js"></script>
		<script type="text/javascript" src="swfobject/swfobject.js"></script>
		<script type="text/javascript" src="js/clientcheck.js"></script>
	  <title>Maskintest</title>
    </head>
	<body>
	<div class="clientcheck">
		<div class="MASKINTEST">MASKINTEST</div>
		<div class="Ofte-stilte-sprsml"><a href="https://digilaer.no/ofte-stilte-sporsmal" target="_blank">Ofte stilte spørsmål (åpnes i nytt vindu).</a></div>
	</div>
	<div class="Rectangle">
		<div id="clientcheck_main_result" class="Topp---maskinen-din">
	    </div>
		<div class="client_check_result_area">
			<div id="clientcheck_info" class="clientcheck_info">
			</div>
			<div id="client_check_javascript_test" class="client_check_tests">
				<div class="clientcheck_test">
					<ul class="fa-ul">
					<li class="clientcheck_test_heading">
					Javascript
					</li>
					<li>
						<span class="fa-li" ><i class="fas fa-info-circle erlend"></i></span>
						<span class="clientcheck_test_info">
						Javascript er påkrevd for å viser deler av innholdet på digilær.
						</span>
					</li>
					<li>
						<span class="fa-li"><i class="fas fa-times-circle" style="color:#d0021b"></i></span>
						<span class="clientcheck_test_failure">
						Javascript er ikke slått på, men påkrevd. 
						</span>
					</li>
					<li>
						<span class="fa-li"><i class="fas fa-arrow-circle-right" style="color:#439126"></i></span>
						<span class="clientcheck_test_action">
						Du må aktivere Javascript i nettleseren din.
						</span>
					</li>
					</ul> 
				</div>
			</div>
			<div id="client_check_other_tests" class="client_check_tests">
			</div>
			<div id="clientcheck_success_info" class="clientcheck_info">
			</div>
			<div id="client_check_success_tests" class="client_check_tests">
			</div>

			<div class="container">
				<canvas class="graphics" id="solarsystem" width="300px" height="300px"></canvas>
				<canvas class="graphics"  id="clock" width="150px" height="150px"></canvas>
				<canvas class="graphics"  id="scene" width="500px" height="300px"></canvas>
			</div>

		
			<button class="clientcheck_ny_test">
    			Kjør automatisk test av maskinen på nytt
	    	</button>
		</div>
		<p class="maskintest_status"></p>
	</div>
  </body>
</html>
