(function(angular){
	$(".list-group").on("click","a",function(e){
		e.preventDefault();
		$(".active").removeClass('active');
		$(this).addClass('active').siblings().removeClass('active');
		if ($(this).index() == 1 || $(this).index() == 3) {
			var a= 0;
			if ($(this).index() == 1) {
				a = 0;
			}else{
				a = 1;
			}
			if ($(".left-list-hide").eq(a).css('display') == "block") {
				$(".left-list-hide").eq(a).css('display', 'none');
			}else{
				$(".left-list-hide").eq(a).css('display', 'block');
			}
			$(".form-control").eq(0).val('');	
		}else{
			$(".left-list-hide").eq(0).css('display', 'none');
			$(".left-list-hide").eq(1).css('display', 'none');
			$(".form-control").eq(0).val($(this).attr("data"));
		}
		
	})

	$(".left-list-hide").eq(0).on("click","li",function(){
		$(".list-group a").eq(1).removeClass('active');
		$(this).addClass('active').siblings().removeClass('active');
		$(".form-control").eq(0).val($(this).attr("data"));
	})
	$(".left-list-hide").eq(1).on("click","li",function(){
		$(".list-group a").eq(2).removeClass('active');
		$(this).addClass('active').siblings().removeClass('active');
		$(".form-control").eq(0).val($(this).attr("data"));
	})


var app = angular.module('starter', ['ngRoute','adder','changer']);

  
  app.config(['$routeProvider', function($routeProvider) {
      $routeProvider
       .when('/change', {
        templateUrl: '/views/change.ejs',
        controller: 'changeCtrl',
      })
        .when('/add', {
        templateUrl: '/views/add.ejs',
        controller: 'addCtrl',
      })
     $routeProvider.otherwise({ redirectTo: '/add' });

  }]);
  	app.controller('StarterCtrl', function($scope) {

	});	

})(angular)

 


