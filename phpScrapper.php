<?php

	$url = "http://www.football-data.co.uk/mmz4281/1314/" . $_POST['id'] . ".csv";
	
	$scrap = file_get_contents($url);
	
	echo $scrap;
?>