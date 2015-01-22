(function ($) {
	$(document).ready(function () {
		$('.do-splitflap')
				.splitFlap();

		$('.click-splitflap')
				.splitFlap({
					textInit: 'Click me to start',
					autoplay: false
				})
				.click(function () {
					$(this).splitFlap('splitflap').animate();
				});
	});
})(jQuery);
