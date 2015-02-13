/* Split Flap Display for jQuery / Maxime Cousinou */
(function ($) {
	'use strict';

	/***************************************************************************
	 * Tools
	 **************************************************************************/

		// Date.now Polyfill
	Date.now = (Date.now || function () {
		return (new Date()).getTime();
	});

	// requestAnimationFrame polyfill by Erik Möller, fixes from Paul Irish and Tino Zijdel
	(function () {
		var lastTime = 0;
		var vendors = [ 'ms', 'moz', 'webkit', 'o' ];

		for ( var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x ) {
			window.requestAnimationFrame = window[ vendors[ x ] + 'RequestAnimationFrame' ];
			window.cancelAnimationFrame = window[ vendors[ x ] + 'CancelAnimationFrame' ] || window[ vendors[ x ] + 'CancelRequestAnimationFrame' ];
		}

		if ( window.requestAnimationFrame === undefined ) {
			window.requestAnimationFrame = function (callback, element) {
				var currTime = Date.now(), timeToCall = Math.max(0, 16 - ( currTime - lastTime ));
				var id = window.setTimeout(function () {
					callback(currTime + timeToCall);
				}, timeToCall);
				lastTime = currTime + timeToCall;
				return id;
			};
		}

		window.cancelAnimationFrame = window.cancelAnimationFrame || function (id) {
			window.clearTimeout(id);
		};
	}());

	// Bind
	var bind = function (method, instance) {
		return function () {
			return method.apply(instance, arguments);
		};
	};

	/***************************************************************************
	 * Letter
	 **************************************************************************/

	/**
	 * Letter Constructor
	 *
	 * @param settings
	 * @constructor
	 */
	function Letter(settings) {
		this.settings = settings;

		this.domObject = document.createElement('div');
		$(this.domObject)
				.css({
					'-webkit-transform-style': 'preserve-3d',
					'-moz-transform-style':    'preserve-3d',
					'-ms-transform-style':     'preserve-3d',
					'transform-style':         'preserve-3d'
				})
				.addClass("char");

		this.upperObject = document.createElement('div');
		this.lowerObject = document.createElement('div');
		this.flippingObject = document.createElement('div');

		var c = {
			'background-image': 'url(' + this.settings.image + ')'
		};
		if ( this.settings.imageSize != '' ) {
			c[ 'background-size' ] = this.settings.imageSize;
		}

		$(this.upperObject)
				.width(this.settings.charWidth)
				.height(this.settings.charHeight >> 1)
				.css(c)
				.addClass("upper");

		$(this.lowerObject)
				.width(this.settings.charWidth)
				.height(this.settings.charHeight >> 1)
				.css(c)
				.addClass("lower");

		$(this.flippingObject)
				.width(this.settings.charWidth)
				.height(this.settings.charHeight >> 1)
				.css($.extend(c, {
					'position': 'absolute',
					'left':     0,
					'top':      0
				}))
				.hide()
				.addClass("flipping");

		$(this.domObject).append(this.upperObject);
		$(this.domObject).append(this.lowerObject);
		$(this.domObject).append(this.flippingObject);
	}

	var lp = Letter.prototype;

	/**
	 * Return DOM Object
	 *
	 * @returns {HTMLElement|*}
	 */
	lp.getDOMObject = function () {
		return this.domObject;
	}

	lp.getCharOffset = function (char) {
		return Math.max(0, this.settings.charsMap.indexOf(char));
	}

	/**
	 * Set Letter character
	 * @param char
	 * @param charFrom
	 * @param ratio
	 */
	lp.setChar = function (char, charFrom, ratio) {
		if ( typeof ratio == 'undefined' ) {
			ratio = 1;
		}

		var offset = this.getCharOffset(char);

		$(this.upperObject).css({
			'background-position': '-' + (offset * this.settings.charWidth) + 'px 0px'
		});

		if ( ratio >= 1 ) {
			$(this.lowerObject).css({
				'background-position': '-' + (offset * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px'
			});
			$(this.flippingObject).hide();
		}
		else if ( ratio <= 0 ) {
			var offsetFrom = this.getCharOffset(charFrom);
			$(this.upperObject).css({
				'background-position': '-' + (offsetFrom * this.settings.charWidth) + 'px 0px'
			});
			$(this.lowerObject).css({
				'background-position': '-' + (offsetFrom * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px'
			});
			$(this.flippingObject).hide();
		}
		else {
			var offsetFrom = this.getCharOffset(charFrom);
			$(this.lowerObject).css({
				'background-position': '-' + (offsetFrom * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px'
			});

			var d;
			if ( ratio < 0.5 ) {
				d = (90 * 2 * ratio);
				$(this.flippingObject)
						.css({
							'top':                      0,
							'z-index':                  Math.round(d),
							'-webkit-transform':        'rotateX(-' + d + 'deg)',
							'-moz-transform':           'rotateX(-' + d + 'deg)',
							'-ms-transform':            'rotateX(-' + d + 'deg)',
							'transform':                'rotateX(-' + d + 'deg)',
							'-webkit-transform-origin': 'bottom center 0',
							'-moz-transform-origin':    'bottom center 0',
							'-ms-transform-origin':     'bottom center 0',
							'transform-origin':         'bottom center 0',
							'background-position':      '-' + (offsetFrom * this.settings.charWidth) + 'px 0px'
						});
			}
			else {
				d = (90 * 2 * (1 - ratio));
				$(this.flippingObject)
						.css({
							'top':                      (this.settings.charHeight >> 1) + 'px',
							'z-index':                  Math.round(d),
							'-webkit-transform':        'rotateX(' + d + 'deg)',
							'-moz-transform':           'rotateX(' + d + 'deg)',
							'-ms-transform':            'rotateX(' + d + 'deg)',
							'transform':                'rotateX(' + d + 'deg)',
							'-webkit-transform-origin': 'top center 0',
							'-moz-transform-origin':    'top center 0',
							'-ms-transform-origin':     'top center 0',
							'transform-origin':         'top center 0',
							'background-position':      '-' + (offset * this.settings.charWidth) + 'px -' + (this.settings.charHeight >> 1) + 'px'
						});
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

	sp.getDOMObject = function () {
		return this.domObject;
	}

	sp.build = function (size) {
		$(this.domObject)
				.css({
					position: 'relative'
				})
				.width(size * this.settings.charWidth)
				.height(this.settings.charHeight);

		for ( var i = 0; i < size; i++ ) {
			var letter = new Letter(this.settings);

			var o = letter.getDOMObject();
			$(o).css({
				position: 'absolute',
				left:     i * this.settings.charWidth,
				top:      0
			});

			$(this.domObject).append(o);

			this.letters[ i ] = letter;
		}
	}

	sp.setText = function (text, textFrom) {
		var animated;
		if ( typeof textFrom == 'undefined' ) {
			textFrom = text;
			animated = false;
		}
		else {
			animated = true;
		}

		// Normalize text
		while ( textFrom.length < this.letters.length ) {
			if ( this.settings.padDir == 'left' ) {
				textFrom = textFrom + this.settings.padChar;
			}
			else {
				textFrom = this.settings.padChar + textFrom;
			}
		}

		// Initialise display
		var charsFrom = (new String(textFrom)).split("");

		for ( var i = 0, l = this.letters.length; i < l; i++ ) {
			var letter = this.letters[ i ];
			letter.setChar(charsFrom[ i ]);
		}

		// Animation
		if ( animated ) {
			// Normalize text
			while ( text.length < this.letters.length ) {
				if ( this.settings.padDir == 'left' ) {
					text = text + this.settings.padChar;
				}
				else {
					text = this.settings.padChar + text;
				}
			}

			var chars = (new String(text)).split("");

			this.animation = {
				letters: new Array()
			};

			for ( var i = 0, l = this.letters.length; i < l; i++ ) {
				var al = {
					ratio:   0,
					speed:   this.settings.speed + Math.random() * this.settings.speedVariation,
					letters: new Array(charsFrom[ i ])
				};

				var index = this.letters[ i ].getCharOffset(charsFrom[ i ]);
				while ( this.settings.charsMap.charAt(index) != chars[ i ] ) {
					index = (index + 1) % this.settings.charsMap.length;
					al.letters.push(this.settings.charsMap.charAt(index));
				}

				this.animation.letters[ i ] = al;
			}

			if ( this.settings.autoplay ) {
				this.animate();
			}
		}
	}

	sp.animate = function () {
		var t = new Date().getTime();
		if ( typeof this.animation.time == 'undefined' ) {
			this.animation.time = t;
		}

		var dt = 0.001 * (t - this.animation.time);

		var n = 0;

		for ( var i = 0, l = this.animation.letters.length; i < l; i++ ) {
			var letter = this.letters[ i ];
			var al = this.animation.letters[ i ];

			if ( al.letters.length > 1 ) {
				al.ratio += al.speed * dt;
				if ( (al.ratio > 1) && (al.letters.length > 1) ) {
					al.ratio = 0;
					al.letters.shift();
				}
			}

			if ( al.letters.length > 1 ) {
				letter.setChar(al.letters[ 1 ], al.letters[ 0 ], al.ratio);
				n++;
			}
			else {
				letter.setChar(al.letters[ 0 ]);
			}
		}

		this.animation.time = t;

		if ( n > 0 ) {
			requestAnimationFrame(bind(this.animate, this));
		}
		else {
			this.settings.onComplete(this);
		}
	}

	/***************************************************************************
	 * jQuery
	 **************************************************************************/

	$.fn.splitFlap = function (options) {
		if ( options == 'splitflap' ) {
			if ( this.length < 0 ) {
				return false;
			}

			var o = this.get(0);
			if ( typeof o.splitflap == 'undefined' ) {
				return false;
			}

			return o.splitflap;
		}

		var settings = $.extend({
			image:          'images/chars.png',
			imageSize:      '',
			charsMap:       'ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789.,!?#@()+-=',
			charWidth:      50,
			charHeight:     100,
			charSubstitute: ' ',
			padDir:         'left',
			padChar:        ' ',
			speed:          3,
			speedVariation: 2,
			text:           '',
			textInit:       '',
			autoplay:       true,
			onComplete:     function () {}
		}, options);

		return this.each(function () {
			var text = (new String(settings.text)).toUpperCase();
			if ( text == '' ) {
				text = (new String($(this).html())).toUpperCase();
			}

			// Verify chars
			for ( var i = 0, l = text.length; i < l; i++ ) {
				var c = text.charAt(i);
				if ( settings.charsMap.indexOf(c) < 0 ) {
					text = text.replace(c, settings.charSubstitute);
				}
			}

			var textInit = settings.textInit.toUpperCase().substr(0, text.length);
			// Verify chars
			for ( var i = 0, l = textInit.length; i < l; i++ ) {
				var c = textInit.charAt(i);
				if ( settings.charsMap.indexOf(c) < 0 ) {
					textInit = textInit.replace(c, settings.charSubstitute);
				}
			}

			while ( textInit.length < text.length ) {
				textInit = textInit + settings.charsMap.charAt(Math.floor(settings.charsMap.length * Math.random()));
			}

			this.splitflap = new SplitFlap(settings);
			this.splitflap.build(text.length);

			$(this).empty().append(this.splitflap.getDOMObject());

			this.splitflap.setText(text, textInit);
		});
	};
})(jQuery);
