<?php
require_once(__DIR__ . "/../model/Database.php");
session_start();
//this regenerates the id
//makes sure hacker doesnt get info
session_regenerate_id(true);
// this path is to all the project files
	$path = "/awesomenauts/php/";
	// this is code refactoring
	//what it does is that it maintains the code making it easy
	// we deleted our old database file to emerge it with this file.
	$host = "localhost";
	$username = "root";
	$password = "root";
	$database = "awesomenauts_db"; 

if(!isset($_SESSION["connection"])) {
//this is to access the open connection, close connection, and even the query function
	// this will help to query the database
	$connection = new Database($host, $username, $password, $database);
	$_SESSION["connection"] = $connection;
}