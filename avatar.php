<?php
// xử lý ảnh , convert từ base64 sang jpg, lưu đường dẫn vào db trong collection image rồi trả về đường dẫn $image_upload = $_POST['input_image']; // image_upload dang base64
$image_upload = $_POST['input_image'];
$image_name = $_POST['username'].time(); 
$username = $_POST['username'];
$output_file= 'avatars/' . $image_name. '.jpg';
$time = round(microtime(true), 4);

$m = new MongoClient(); 
	$db = $m->chatbox;
	$collection = $db->logs;
	$array= array('username' =>$username,'image_name'=>$image_name, 'type' => 'avatar', 'content' => $output_file, 'time' =>$time, 'avatar' => $username);												
	$collection->insert($array);

$imageFile = base64_to_jpeg($image_upload, $output_file); // gọi hàm base64_to_jpeg ra, xử lý ảnh rồi lưu trong thư mục có đường dẫn $output_file

// echo json_encode($imageFile);
echo $imageFile;

// hàm convert chuỗi base64 nhận từ js thành ảnh 
function base64_to_jpeg($base64_string, $output_file) {
    $ifp = fopen($output_file, "wb"); 

    $data = explode(',', $base64_string);

    fwrite($ifp, base64_decode($data[1])); 
    fclose($ifp); 

    return $output_file; 
}
?>