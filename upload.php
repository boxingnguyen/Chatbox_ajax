<?php
$image_upload = $_POST['input_image']; // image_upload dang base64
$image_name = $_POST['image_name'].time(); 
$username = $_POST['username'];
$output_file= 'uploads/' . $image_name. ".jpg";
$time = round(microtime(true), 4);

$m = new MongoClient(); 
	$db = $m->chatbox;
	$collection = $db->logs;
	$array= array('username' =>$username,'image_name'=>$image_name, 'type' => 'image','content' => $output_file, 'time' =>$time);												
	$collection->insert($array);

$imageFile = base64_to_jpeg($image_upload, $output_file); // gọi hàm base64_to_jpeg ra, xử lý ảnh rồi lưu trong thư mục có đường dẫn $output_file
echo json_encode($imageFile);

// hàm convert chuỗi base64 nhận từ js thành ảnh 
function base64_to_jpeg($base64_string, $output_file) {
    $ifp = fopen($output_file, "wb"); 

    $data = explode(',', $base64_string);

    fwrite($ifp, base64_decode($data[1])); 
    fclose($ifp); 

    return $output_file; 
}

?>