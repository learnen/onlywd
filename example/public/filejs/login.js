(function() {
	$("#submit").on("click", function(e) {
		e.preventDefault();
		if ($(".form-control").eq(0).val() && $(".form-control").eq(1).val()) {
			$.post('/login', {
				"number": $(".form-control").eq(0).val(),
				"password": $(".form-control").eq(1).val(),
			}, function(data) {
				if (data[0] == "1") {
					window.location = "/admin";
				};
				if (data[0] == "2") {
					$(".wrong").html("账号或者密码错误");
				};
			});
		}else{
			$(".wrong").html("用户名或密码不能为空");
		}

	})

	$(".form-control").on("focus",function(){
		$(".wrong").html("");
	})

})()