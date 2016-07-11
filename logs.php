
<?php 
session_start();
// connect to mongodb
$m = new MongoClient();
// select a databases
$db = $m->chatbox;
$collection = $db->logs;

// lấy ra tin nhắn
$numberOfData = 5;

$result = $collection->find();
$result->sort(array('time' => -1));
$result->limit($numberOfData);
$total = count($result);

$newestData = array();

foreach ($result as  $value) {
	$newestData[] = $value;
}
$newestData = array_reverse($newestData);

$newest_time = $newestData[$total - 1]['time']; // lưu giá trị thời gian mới nhất vào biến newest time
$newestData['newest_time'] = $newest_time;
echo json_encode($newestData);

?>