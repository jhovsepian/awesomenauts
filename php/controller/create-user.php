<?php
	require_once (__DIR__ . "/../model/config.php");
// create the user and store the user with the new database table.
	$username = filter_input(INPUT_POST, "username", FILTER_SANITIZE_STRING);
	$password = filter_input(INPUT_POST, "password", FILTER_SANITIZE_STRING);

// this is too give random numbers for the password so no one knows it.
	$salt = "$5$" . "rounds=5000$" . uniqid(mt_rand(), true) . "$";

	$hashedpassword = crypt($password, $salt);
// this querry is inserting to our users and it will set values
	$query = $_SESSION["connection"]->query("INSERT INTO users SET "
		. "username = '$username',"
		. "password = '$hashedpassword',"
		. "salt = '$salt', "
		. "exp = 0, "
		. "exp1 = 0, "
		. "exp2= 0, "
		. "exp3 = 0, "
		. "exp4 = 0");

	$_SESSION["name"] = $username;

	if($query) {
		//need this for Ajax on index.php
		echo "true";
	}
	else {
		echo "<p>" . $_SESSION["connection"]->error . "</p>";
	}