(function(){
	$(".little-left").on("mouseenter",function(){
		var id = $(this).index()/2;
		$(".little-left-square").eq(id).css('border-top', '20px solid rgba(255,0,0,1)');
		$(".little-left-ball").eq(id).css('background-color', 'rgba(0,255,0,1)');
		$(".little-left-flower").eq(id).css({
			'border-radius':'0px 30px',
			'background-color':'#66ccff'
		})
	})
	$(".little-left").on("mouseleave",function(){
		var id = $(this).index()/2;
		$(".little-left-square").eq(id).css('border-top', '20px solid rgba(255,0,0,0)');
		$(".little-left-ball").eq(id).css('background-color', 'rgba(0,255,0,0)');
		$(".little-left-flower").eq(id).css({
			'border-radius':'0px',
			'background-color':'#99ffff'
		})
	})
})()