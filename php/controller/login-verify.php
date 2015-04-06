<?php
	require_once (__DIR__ . "/../model/config.php");

	function authenticateUser() {
		if(!isset ($_SESSION["authenticated"])) {
			return false;
		}
		else {
	if($_SESSION["authenticated"] != true) {
		return false;
	}
	// this will say true if we already logged in.
		else {
			return true;
	}
		}
	}
	
	?>