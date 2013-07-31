(function($){
	function ie8StripSizes() {
		$('.ie8 img').each(function(){
			this.removeAttribute('width');
			this.removeAttribute('height');
		});
	};
	
	$(document).ready(function(){
		ie8StripSizes();
	});
	
	Drupal.behaviors.ie8StripSizes = {
		attach: function (context, settings) {
			ie8StripSizes()
		}
	};
})(jQuery);
