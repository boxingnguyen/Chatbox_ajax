var xxx;

$(document).ready(function() { 
	var uname = prompt("Enter your chat name:", "Guest");
        
    //  Mặc định tên người dùng sẽ là Guest
	if (!uname || uname === ' ') {
	   uname = "Guest";
	}

	$form = $('<form/>').attr('name', 'form1'); 
	$form.text("CHAT HERE:   ");

	$textarea=$('<textarea/>').attr({
		name: 'msg',
		id: 'textbox'
	}).addClass('form-control modal-content')
								.width("100%")
								.height("100px");
	$send = $('<a/>').attr({
		id: 'submit',
		href: '#'
	}).text('Send');
	$form.append($textarea,$send);
	// hiển thị tin nhắn

	$chatlogs=$('<div/>')
					.addClass('col-xs-16')
					.width("100%")
					.height("400px")
					.css('overflow', 'scroll');
	$chatlogs.attr('id', 'chatlogs');
	$form3 =$('<form/>').addClass('caption logs');
	$form3.append($chatlogs);

	// form upload ảnh, avatar
	$form2 = $('<form/>').attr({
		method: 'POST',
		enctype: 'multipart/form-data',
		action: '#'
	});
	$input_upload = $('<input/>');
	$input_upload.attr({
		type:'file',
		name:'image',
		id: 'input_image'
	});

	// nút upload ảnh
	$input_submit = $('<input/>').addClass('btn-primary');
	$input_submit.attr({
		type: 'submit',
		value: 'Upload Image',
		id: 'click_image'
	});
		// nút thay avatar
	// $image_default=$('<img/>')
	// 				.attr('src','avatars/default.jpg')
	// 				.width("50px");
	
	// var $avatar = $('<span/>').addClass('avatar').append($image_default);

	$input_avatar= $('<input/>').addClass('btn-primary');
	$input_avatar.attr({
		type: 'submit',
		value: 'Add Avatar',
		id:    'click_avatar'
	});
	// $input_submit.append($input_upload);
	// $input_avatar.append($input_upload);
	$form2.append($input_upload,$input_submit,$input_avatar);


	$('body').append($form3,$form,$form2);

	function submitChat() {

		var msg = form1.msg.value; // store the values into js variable
		var type = 'text';
		var test = $.trim($('#textbox').val()); // check value of image input
	   	if (test == '')  {
	   		return false;
	   	}
	   	// else if(/[^a-zA-Z0-9\-\/]/.test(test)) {
     //    alert('Sorry You can not insert Special Character');
     //    return false;
    	// }
	   	else{
	   		$.ajax({ 
			url: 'insert.php',
			dataType: "json",
			type: "POST",
			data: {					//  truyen du lieu tu js sang php
		        username: uname,	// bien uname (tu js) truyen sang php (lay bang $_POST['username'])
		        message: msg,
		        type: type
			},
				success: function(data) {
					if(data == "true") {
						$("#textbox").val(''); // cho phan textarea empty xong khi truyen data
					}
				}
			});
	   	}
		
	}

	setInterval(function(){ // đưa ra tin nhắn mới nhất
		$.ajax({ 
			url: 'currentMsg.php',
			dataType: "json",
			type: "POST",
			data: {
		        time: new_time	// time: ten bien ben php duoc luu vao new_time ben js, newest_time: ten bien can truyen tu js sang php
			},
			error: function() {
				console.log('err');
			},
			success: function(data) {
				new_time = data.newest_time;
				delete data.newest_time;
				$.each( data, function( key, value ) {
					$safe_user_name = $('<span/>').text( value.username + ': ');
					if (value.type == "text") {
			   			
						$safe_text = $('<span/>').text( value.content);

					 		$image_default=$('<img/>')
											 .attr('src','avatars/default.jpg')
											 .width("50px");

					 		var $avatar = $('<span/>').addClass('avatar').append($image_default);


						// $avatar = '<span class = "avatar"><img src= "avatars/default.jpg", width = "50px"></img></span>';

						$safe_chat_log_line = $('<div/>')
													.addClass('msg')
													.addClass( value.username)
													.append( $avatar)
													.append( $safe_user_name )
													.append( $safe_text );

						// append
						$chatlogs.append( $safe_chat_log_line );

				  		var elem = document.getElementById('chatlogs');
				 	 	elem.scrollTop = elem.scrollHeight;

					}
					else if(value.type == "image"){
						$image_default=$('<img/>')
											 .attr('src','avatars/default.jpg')
											 .width("50px");

					 	var $avatar = $('<span/>').addClass('avatar').append($image_default);
						$img = $('<img/>').attr('src',value.content).width("100px");
						$div = $('<div/>')
										.addClass('msg').addClass(value.username)
										.append($avatar)
										.append($safe_user_name)
										.append($img);
						$chatlogs.append($div);

				  		var elem = document.getElementById('chatlogs');
				 	 	elem.scrollTop = elem.scrollHeight;

					}
					$.ajax({
				   		url: 'getAvatar.php',
				   		dataType: "json",
				   		type: "POST",
				   		data: {					//  truyen du lieu tu js sang php
			        		username: value.username,	// bien uname (tu js) truyen sang php (lay bang $_POST['username'])
					
						},
			   			success: function(data) {

			   				$('.' + data.username + ' span img').attr('src', data.content);
				   		}
			   		});
				});				
			}

		});
	}, 100); 

	var new_time; // đưa ra 5 tin nhắn gần nhất khi bắt đầu
	$.ajax({
   		url: 'logs.php',
   		dataType: "json",
   		type: "POST",
   		success: function(data) {
   			$.each( data, function( key, value ) {
   				$image_default=$('<img/>')
											 .attr('src','avatars/default.jpg')
											 .width("50px");

					 		var $avatar = $('<span/>').addClass('avatar').append($image_default);
   				avatar_image = '';
   				if(typeof value.username == 'undefined') {
   					return false;
   				}
				// lay anh tu db = value.username
				$.ajax({
			   		url: 'getAvatar.php',
			   		dataType: "json",
			   		type: "POST",
			   		data: {					//  truyen du lieu tu js sang php
		        		username: value.username	// bien uname (tu js) truyen sang php (lay bang $_POST['username'])
					},
			   		success: function(data) {
			   			if(uname == value.username){
			   				avatar_image = data.content;
			   			$('.' + value.username).attr('src', avatar_image);
			   			}
			   		}
			   	});
			   	$safe_user_name = $('<span/>').text( value.username + ': ');
				if(value.type == "image") {
   					// $chatlogs.append('<div class="msg ' + value.username + '">'+ avatar + value.username + ':  ' + '<img src= "' + value.content + ' "  width= "100px" >','<br/>');
   					$img = $('<img/>').attr('src',value.content).width("100px");
					$div = $('<div/>')
									.addClass('msg').addClass(value.username)
									.append($avatar)
									.append($safe_user_name)
									.append($img);
					$chatlogs.append($div);
   				}

		   		else if(value.type == "text") {
		 			$safe_text = $('<span/>').text( value.content );
					
					$safe_chat_log_line = $('<div/>')
												.addClass('msg')
												.addClass( value.username)
												.append( $avatar)
												.append( $safe_user_name )
												.append( $safe_text );

					// append
					$chatlogs.append( $safe_chat_log_line );

		   		}
			
			});
			 new_time = data.newest_time; //
   		}
	});
	// đưa ảnh đã upload ra màn 

	$('#click_image').click(function(e) {
		e.preventDefault();

	   	var test = $.trim($('#input_image').val()); // check value of image input
	   	if (test == '') {
	   		alert('Please choose image first !');
	   		return false;
	   	}
	   	else{
	   		// lấy dữ liệu của ảnh qua js
			var f = $('#input_image')[0].files[0],
			imageName = f['name']; // lấy tên của ảnh 
		    r = new FileReader();
			r.onloadend = function(event){
			imageData = event.target.result;
	
			// gui du lieu anh sang upload.php
			$.ajax({
				url: 'upload.php',
				type: "POST",
				dataType: "json",
				data: {
					input_image: imageData,
					image_name:  imageName,
					username: 	 uname
				// dữ liệu dưới dạng base64

				},
				success: function(data){
					$("#input_image").val('');
				},
			});
		}
		r.readAsDataURL(f);
	   	}
		
		
	});


	// add avatar
	$('#click_avatar').click(function(e) { 
		e.preventDefault();
	   	var test = $.trim($('#input_image').val());
	   	if (test == '') {
	   		alert('Please choose image first !');
	   		return false;
	   	}
	   	else{
	   		var f = $('#input_image')[0].files[0],
		    r = new FileReader();
			r.onload = function(event){
			dulieu_anh = event.target.result;
			$.ajax({
				url: 'avatar.php',
				type: 'POST',
				data: {
					input_image: dulieu_anh,
					username: 	 uname
				},
				// data is avatar'src
				success: function(data){
				$("#input_image").val('');

				},
			
			});
		}	
		r.readAsDataURL(f);
	   	}
		
	});


// click hay enter deu nhay ve function submitchat()
	$('#submit').click(function(){ submitChat(); return false; });
				
	$(document).keypress(function (e) {
		var key = e.which;
		if(key==13 && !e.shiftKey) {
			e.preventDefault();
			submitChat(); return false; 
		}
	});

});	


