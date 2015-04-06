<?php
// THIS IS A NEW DATABASE.
// the database object is created by the class   
class Database {
	// this code only is accessed in this class because its private. others are public
	// we dont want other files accessing this information within the database class
	private $connection;
	private $host;
	private $username;
	private $password;
	private $database;
	public $error;
// create a constructer. 
// a constructer is important because it allows us to bulid objects of type database.
// when we construct our object, we are going to pass the information to the host, username, password, database.
	public function __construct($host, $username, $password, $database) {
		$this->host = $host;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;

$this->connection = new mysqli($host, $username, $password);
	
// if no connection, you will recieve an error messege, and website will die.
if($this->connection->connect_error) {
     die("<p>Error: " . $this->connection->connect_error . "</p>");
}

$exists = $this->connection->select_db($database);
// code below lets you know the database doesnt exist
if(!$exists) {
	$query = $this->connection->query("CREATE DATABASE $database");
    // if exists it will say successfully created.
	if($query) {
        echo "<p>Successfully created database: " . $database . "</p>";
}
	}
	else {
		echo "<p>Database already exists</p>";
	}
	}
// added more functions
// these are important to use information to perform actions on our database.
// this opens the connection
	public function openConnection() {
		//this is a new sqli variable object. 
		// this will check whether we have a connection or not.
		// WE want to establish a connection to the database.
		$this->connection = new mysqli($this->host, $this->username, $this->password, $this->database);
     // if no connection, you will recieve an error messege, and website will die.
	if($this->connection->connect_error) {
     die("<p>Error: " . $this->connection->connect_error . "</p>");
}
	}
	// this closes the connection above
	public function closeConnection() {
		// if there is no information in the varible will return no.
		// if there is information in the varible will return yes.
		// isset checks if the varible has been set or not.
		if (isset($this->connection)) {
				$this->connection->close();
		}
	}
// below will tell you if the query was successful or not.
	public function query($string) {
		$this->openConnection();
// this is to open up a connection to the database.
//this is to query the database
		$query = $this->connection->query($string);
// this below connects it to the varible
		if (!$query) {
			$this->error = $this->connection->error;
		}
//	closes the connection to the database
		$this->closeConnection();
//this returns the result as being successful;true or not being successful;false
		return $query;
	}
}