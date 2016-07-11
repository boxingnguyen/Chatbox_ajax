<?php
$m = new MongoClient();
// select a databases
$db = $m->chatbox;
$collection = $db->logs;
$username = $_POST['username'];

$result = $collection->find(array('avatar' => $username))->sort(array('time'=>-1));
foreach ($result as $value) {
	echo json_encode($value);
	return true;
}