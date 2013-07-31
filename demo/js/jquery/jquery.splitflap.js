/* Split Flap Display for jQuery / Maxime Cousinou */
;(function($) {
	/***************************************************************************
	 * Letter
	 **************************************************************************/

	function Letter(settings) {
		this.settings = settings;

		this.domObject = document.createElement('div');
		$(this.domObject)
			.css('-webkit-transform-style', 'preserve-3d')
			.css(   '-moz-transform-style', 'preserve-3d')
			.css(    '-ms-transform-style', 'preserve-3d')
			.css(        'transform-style', 'preserve-3d')
			.addClass("char");

		this.upperObject = document.createElement('div');
		this.lowerObject = document.createElement('div');
		this.flippingObject = document.createElement('div');
		
		$(this.upperObject)
			.width(this.settings.charWidth)
			.height(this.settings.charHeight >> 1)
			.css('background-image', 'url(' + this.settings.image + ')')
			.addClass("upper");

		$(this.lowerObject)
			.width(this.settings.charWidth)
			.height(this.settings.charHeight >> 1)
			.css('background-image', 'url(' + this.settings.image + ')')
			.addClass("lower");

		$(this.flippingObject)
			.width(this.settings.charWidth)
			.height(this.settings.charHeight >> 1)
			.css('background-image', 'url(' + this.settings.image + ')')
			.css('position', 'absolute')
			.css('left', 0)
			.css('top', 0)
			.hide()
			.addClass("flipping");

		$(this.domObject).append(this.upperObject);
		$(this.domObject).append(this.lowerObject);
		$(this.domObject).append(this.flippingObject);
	}

	var lp = Letter.prototype;

	lp.getDOMObject = function() {
		return this.domObject;
	}

	lp.setChar = function(char, charFrom, ratio) {
		if (typeof ratio == 'undefined') {
			ratio = 1;
		}
		
		var offset = this.settings.charsMap.indexOf(char);
		$(this.upperObject).css('background-position', '-' + (offset * this.settings.charWidth) + 'px 0px');

		if (ratio >= 1) {
			$(this.lowerObject).css('background-position', '-' + (offset * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px');
			$(this.flippingObject).hide();
		}
		else if (ratio <= 0) {
			var offsetFrom = this.settings.charsMap.indexOf(charFrom);
			$(this.upperObject).css('background-position', '-' + (offsetFrom * this.settings.charWidth) + 'px 0px');
			$(this.lowerObject).css('background-position', '-' + (offsetFrom * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px');
			$(this.flippingObject).hide();
		}
		else {
			var offsetFrom = this.settings.charsMap.indexOf(charFrom);
			$(this.lowerObject).css('background-position', '-' + (offsetFrom * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px');
			
			var d;
			if (ratio < 0.5) {
				d = (90 * 2 * ratio);
				$(this.flippingObject)
					.css('top', 0)
					.css('z-index', Math.round(d))
					.css('-webkit-transform', 'rotateX(-' + d + 'deg)')
					.css(   '-moz-transform', 'rotateX(-' + d + 'deg)')
					.css(    '-ms-transform', 'rotateX(-' + d + 'deg)')
					.css(        'transform', 'rotateX(-' + d + 'deg)')
					.css('-webkit-transform-origin', 'bottom center 0')
					.css(   '-moz-transform-origin', 'bottom center 0')
					.css(    '-ms-transform-origin', 'bottom center 0')
					.css(        'transform-origin', 'bottom center 0')
					.css('background-position', '-' + (offsetFrom * this.settings.charWidth) + 'px 0px');
			}
			else {
				d = (90 * 2 * (1 - ratio));
				$(this.flippingObject)
					.css('top', (this.settings.charHeight >> 1) + 'px')
					.css('z-index', Math.round(d))
					.css('-webkit-transform', 'rotateX(' + d + 'deg)')
					.css(   '-moz-transform', 'rotateX(' + d + 'deg)')
					.css(    '-ms-transform', 'rotateX(' + d + 'deg)')
					.css(        'transform', 'rotateX(' + d + 'deg)')
					.css('-webkit-transform-origin', 'top center 0')
					.css(   '-moz-transform-origin', 'top center 0')
					.css(    '-ms-transform-origin', 'top center 0')
					.css(        'transform-origin', 'top center 0')
					.css('background-position', '-' + (offset * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px');
			}
			$(this.flippingObject).show();
		}
	}

	/***************************************************************************
	 * SplitFlap
	 **************************************************************************/

	function SplitFlap(settings) {
		this.settings = settings;

		this.domObject = document.createElement('div');
		this.letters = new Array();
		
		$(this.domObject).addClass("splitflap");
	}
	
	var sp = SplitFlap.prototype;

	sp.getDOMObject = function() {
		return this.domObject;
	}

	sp.build = function(size) {
		$(this.domObject)
			.css('position', 'relative')
			.width(size * this.settings.charWidth)
			.height(this.settings.charHeight);
		
		for ( var i = 0; i < size; i++) {
			var letter = new Letter(this.settings);
			
			var o = letter.getDOMObject();
			$(o).css('position', 'absolute')
				.css('left', i * this.settings.charWidth)
				.css('top', 0);

			$(this.domObject).append(o);
			
			this.letters[i] = letter;
		}
	}
	
	sp.setText = function(text, textFrom) {
		var animated;
		if (typeof textFrom == 'undefined') {
			textFrom = text;
			animated = false;
		}
		else {
			animated = true;
		}
		
		// Normalize text
		while (textFrom.length < this.letters.length) {
			if (this.settings.padDir == 'left') {
				textFrom = textFrom +  this.settings.padChar;
			}
			else {
				textFrom = this.settings.padChar + textFrom;
			}
		}
		
		// Initialise display
		var charsFrom = (new String(textFrom)).split("");
		
		for ( var i = 0, l = this.letters.length; i < l; i++) {
			var letter = this.letters[i];
			letter.setChar(charsFrom[i]);
		}
		
		// Animation
		if (animated) {
			// Normalize text
			while (text.length < this.letters.length) {
				if (this.settings.padDir == 'left') {
					text = text +  this.settings.padChar;
				}
				else {
					text = this.settings.padChar + text;
				}
			}
			
			var chars = (new String(text)).split("");
			
			this.animation = {
				time: new Date().getTime(),
				letters: new Array()
			};
			
			for ( var i = 0, l = this.letters.length; i < l; i++) {
				var al = {
					ratio: 0,
					speed: this.settings.speed + Math.random() * this.settings.speedVariation,
					letters: new Array(charsFrom[i])
				};
				
				var index = this.settings.charsMap.indexOf(charsFrom[i]);
				while (this.settings.charsMap.charAt(index) != chars[i]) {
					index = (index + 1) % this.settings.charsMap.length;
					al.letters.push(this.settings.charsMap.charAt(index));
				}
				
				this.animation.letters[i] = al;
			}
			
			this.animate();
		}
	}
	
	sp.animate = function() {
		var t  = new Date().getTime();
		var dt = 0.001 * (t - this.animation.time);
		
		var n = 0;
		
		for ( var i = 0, l = this.animation.letters.length; i < l; i++) {
			var letter 	= this.letters[i];
			var al 		= this.animation.letters[i];
			
			if (al.letters.length > 1) {
				al.ratio += al.speed * dt;
				if ((al.ratio > 1) && (al.letters.length > 1)) {
					al.ratio = 0;
					al.letters.shift();
				}
			}
			
			if (al.letters.length > 1) {
				letter.setChar(al.letters[1], al.letters[0], al.ratio);
				n++;
			}
			else {
				letter.setChar(al.letters[0]);
			}
		}
		
		this.animation.time = t;
		
		if (n > 0) {
			requestAnimationFrame(delegate(this.animate, this));
		}
	}

	/***************************************************************************
	 * jQuery
	 **************************************************************************/

	$.fn.splitFlap = function(options) {
		var settings = $.extend({
			'image' : 'images/chars.png',
			'charsMap' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789.,!?#@()+-=',
			'charWidth' : 50,
			'charHeight' : 100,
			'padDir' : 'left',
			'padChar' : ' ',
			'speed' : 3,
			'speedVariation' : 2
		}, options);

		return this.each(function() {
			var text = (new String($(this).html())).toUpperCase();
			var textInit = '';
			for (var i = 0, l = text.length; i < l; i++) {
				textInit = textInit + settings.charsMap.charAt(Math.floor(settings.charsMap.length * Math.random()));
			}
			
			var splitflap = new SplitFlap(settings);
			splitflap.build(text.length);
			
			$(this).empty().append(splitflap.getDOMObject());
			
			this.splitflap = splitflap;
			
			splitflap.setText(text, textInit);
		});
	};
})(jQuery);
