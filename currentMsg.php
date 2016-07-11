<?php
$m = new MongoClient();
// select a databases
$db = $m->chatbox;
$collection = $db->logs;

if(!isset($_POST['time']))
	$_POST['time'] = '944010061';			// 1/1/2000

$newest_time = floatval($_POST['time']); // lay du lieu thoi gian moi nhat tu ben js trong bien time va luu vao bien newest_tim

$result = $collection->find(array('time' => array('$gt' => $newest_time)));
$count = $result->count();

$new_msg_result = array();

foreach ($result as  $value) {
	$new_msg_result[] = $value;
	$newest_time = $value['time'];
}
$new_msg_result['newest_time'] = $newest_time;

echo json_encode($new_msg_result);
?>