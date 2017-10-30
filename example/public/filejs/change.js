(function(angular) {
	var app = angular.module('changer', []);

	app.controller('changeCtrl', function($scope, $routeParams) {
		$(".submit").on("click", function(e) {
			var sort = $(".form-control").eq(0).val();
			e.preventDefault();
			$.post('/consult', {
				"sort": sort,
			}, function(data) {
				$scope.data = data;
				$scope.$apply();

				$(".change-ul-change").one('click', function() {
					var id = $(this).parent('ul').index()-2;
					$(".form").css('display', 'inline');
					$(this).parent().siblings('ul').css('display', 'none');
					$scope.change = $scope.data[id];
					UE.getEditor('editor').setContent($scope.change.content);
					$scope.$apply();
					$('.form-control').eq(2).attr('src', '/uploads/' + 　$scope.change.img);
				})

				$(".change-back").one('click', function() {
					$(".form").css('display', 'none');
					$(this).parent().siblings('ul').css('display', 'block');
				})
				$(".change-ul-delete").one('click', function(e) {
					e.preventDefault();
					console.log("sss");
					var id = $(this).parent('ul').index() - 2;
					var img = $(this).siblings('.none').html();
					$.post('/admin/delete', {
						"img": img,
						'classify': $scope.data[id].classify,
					}, function(data) {
						if (data = '删除成功') {
							alert(data);
							$(".change-ul-delete").eq(id).parent().css('display', 'none');
						}else{
							alert("删除失败");
						}
					});
				})
				$(".change-ul-index").one('click', function(e) {
					e.preventDefault();
					var id = $(this).parent('ul').index() - 2;
					var img = $(this).siblings('.none').html();
					$.post('/admin/index', {
						"img": img,
						'classify': $scope.data[id].classify,
					}, function(data) {
						if (data = '推荐成功') {
							alert(data);
						};
					});
				})
			});
		})



	});

})(angular);