(function() {

		var border = parseInt($('.index-group-content').css('border-top-width').split('px')[0]);

		if ($(".others-group-title").height()) {
				var height = $(".index-top").outerHeight(true) + $(".index-title").outerHeight(true) + $(".index-nav").outerHeight(true) + border + 45 + $(".others-group-tite").outerHeight(true);
			}else{
				var height = $(".index-top").outerHeight(true) + $(".index-title").outerHeight(true) + $(".index-nav").outerHeight(true) + border;
			}

		$(window).scroll(function() {
			var top = $(window).scrollTop() + 20;
			var contentHeight = height;
			$(".left-content").eq(0).css('opacity', '1');
			var content = $(".left-content").length;
			if (top - 20 > 15 + $(".index-title").outerHeight(true)) {
				$(".index-title").css({
				'opacity': '0',
				'transform': 'translateX(24px)'
				});
			}else{
				$(".index-title").css({
				'opacity': '1',
				'transform': 'translateX(0px)'
				});
			}
			for (var i = 0; i < content; i++) {	
				var scrollHeight = $(window).height() + $(window).scrollTop() - 40 + 5*i - border;						
					for (var j = 0; j <= i; j++) {
						contentHeight = contentHeight + $(".left-content").eq(i).outerHeight(true);
					};
					if (contentHeight-$(".left-content").eq(i).outerHeight(true) > scrollHeight) {
						$(".left-content").eq(i).css({
							'opacity': '0',
							'transform': 'translateX(24px)'
						});
					}else{
						if (contentHeight > top) {
							$(".left-content").eq(i).css({
								'opacity': '1',
								'transform': 'translateX(0px)'
							});
						}else{
							$(".left-content").eq(i).css({
								'opacity': '0',
								'transform': 'translateX(24px)'
							});
						}
					}
					contentHeight = height;
			};
		});

		function test() {
			// console.log("ssss");
			var top = $(window).scrollTop() + 10;
			var contentHeight = height;
			$(".left-content").eq(0).css('opacity', '1');
			var content = $(".left-content").length;

			$(".index-title").css({
				'opacity': '1',
				'transform': 'translateX(0px)'
			});

			for (var i = 0; i < content; i++) {	
				var scrollHeight = $(window).height() + $(window).scrollTop() -20*i;			
					for (var j = 0; j < i; j++) {
						contentHeight = contentHeight + $(".left-content").eq(i).outerHeight(true);
					};
					
					if (contentHeight > scrollHeight) {
						$(".left-content").eq(i).css({
							'opacity': '0',
							'transform': 'translateX(24px)'
						});
					}else{
						if (contentHeight+$(".left-content").eq(i).outerHeight(true) > top) {
							$(".left-content").eq(i).css({
								'opacity': '1',
								'transform': 'translateX(0px)'
							});
						}else{
							$(".left-content").eq(i).css({
								'opacity': '0',
								'transform': 'translateX(24px)'
							});
						}
					}
					contentHeight = height;
			};
		}


	test();

})()