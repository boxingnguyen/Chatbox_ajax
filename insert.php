<?php

$uname = $_POST['username']; 
$msg = $_POST['message'];
$time = round(microtime(true), 4);
$type = $_POST['type'];


$_SESSION[$uname] = 1;

$m = new MongoClient();
// select a database
$db = $m->chatbox;
$collection = $db->logs;

$test = array ('username' => $uname, 'type' => $type, 'content' => $msg, 'time' => $time);

if($collection->insert($test)) {
	echo json_encode("true");	
} else {
	echo json_encode("false");
}
?> 