;(function($){
	/* hoverIntent by Brian Cherne */
	$.fn.hoverIntent = function(f,g) {
		// default configuration options
		var cfg = {
			sensitivity: 7,
			interval: 100,
			timeout: 0
		};
		// override configuration options with user supplied object
		cfg = $.extend(cfg, g ? { over: f, out: g } : f );

		// instantiate variables
		// cX, cY = current X and Y position of mouse, updated by mousemove event
		// pX, pY = previous X and Y position of mouse, set by mouseover and polling interval
		var cX, cY, pX, pY;

		// A private function for getting mouse position
		var track = function(ev) {
			cX = ev.pageX;
			cY = ev.pageY;
		};

		// A private function for comparing current and previous mouse position
		var compare = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			// compare mouse positions to see if they've crossed the threshold
			if ( ( Math.abs(pX-cX) + Math.abs(pY-cY) ) < cfg.sensitivity ) {
				$(ob).unbind("mousemove",track);
				// set hoverIntent state to true (so mouseOut can be called)
				ob.hoverIntent_s = 1;
				return cfg.over.apply(ob,[ev]);
			} else {
				// set previous coordinates for next time
				pX = cX; pY = cY;
				// use self-calling timeout, guarantees intervals are spaced out properly (avoids JavaScript timer bugs)
				ob.hoverIntent_t = setTimeout( function(){compare(ev, ob);} , cfg.interval );
			}
		};

		// A private function for delaying the mouseOut function
		var delay = function(ev,ob) {
			ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
			ob.hoverIntent_s = 0;
			return cfg.out.apply(ob,[ev]);
		};

		// A private function for handling mouse 'hovering'
		var handleHover = function(e) {
			// next three lines copied from jQuery.hover, ignore children onMouseOver/onMouseOut
			var p = (e.type == "mouseover" ? e.fromElement : e.toElement) || e.relatedTarget;
			while ( p && p != this ) { try { p = p.parentNode; } catch(e) { p = this; } }
			if ( p == this ) { return false; }

			// copy objects to be passed into t (required for event object to be passed in IE)
			var ev = jQuery.extend({},e);
			var ob = this;

			// cancel hoverIntent timer if it exists
			if (ob.hoverIntent_t) { ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t); }

			// else e.type == "onmouseover"
			if (e.type == "mouseover") {
				// set "previous" X and Y position based on initial entry point
				pX = ev.pageX; pY = ev.pageY;
				// update "current" X and Y position based on mousemove
				$(ob).bind("mousemove",track);
				// start polling interval (self-calling timeout) to compare mouse coordinates over time
				if (ob.hoverIntent_s != 1) { ob.hoverIntent_t = setTimeout( function(){compare(ev,ob);} , cfg.interval );}

			// else e.type == "onmouseout"
			} else {
				// unbind expensive mousemove event
				$(ob).unbind("mousemove",track);
				// if hoverIntent state is true, then call the mouseOut function after the specified delay
				if (ob.hoverIntent_s == 1) { ob.hoverIntent_t = setTimeout( function(){delay(ev,ob);} , cfg.timeout );}
			}
		};

		// bind the function to the two event listeners
		return this.mouseover(handleHover).mouseout(handleHover);
	};
	
})(jQuery);

/*!
 * jQuery DropDownMenu Plugin
 * version: 1.0 11:20 2011-7-1
 * author: xu <qihuaxu@qq.com>
 * @requires jQuery v1.3.2 or later
 *
 * Examples and documentation at: http://www.thiscuz.com/archives/jquery-dropdownmenu-plugin/
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {
$.fn.dropDownMenu = function(options) {
	var OPTIONS = {			//default setting
		direction : '' 		// horizontal  vertical 
		,speed : 'fast' 	// spead
		,disableHI : true 	// 是否使用hoverIndent
		,type : 'hover' 	// hover click 有子菜单的现实方式 hover或click
		,css : { 	//CSS
			prefix : 'dmm'
			,level : 'dmm-level'
			,hover : 'dmm-hover'
			,child : 'dmm-child'
		}
	}
	var _this = $(this),
		options = $.extend({},OPTIONS, options);
	function init(level) {
		$(this).addClass(options.css.level+'-'+level);
		if(level>1) {
			$(this).hide();
        }
		$(this).children().each(function(){
			var ul = $(this).find('>ul');
			if(ul.length) {
				$(this).addClass(options.css.child);
				init.call(ul,level+1);
            }
			$(this)[($.fn.hoverIntent && !options.disableHI) ? 'hoverIntent' : 'hover'](function () {
                var obj = $(this);
                obj.addClass(options.css.hover);
				if(obj.hasClass(options.css.child)) {
                    setTimeout(function() {
                        if (obj.hasClass(options.css.hover)) {
                            obj.find('>ul').slideDown({
                                progress: function(animation, progress, remainingMs) {
                                    if (!obj.hasClass(options.css.hover)) {
                                        obj.find('>ul').hide();
                                    }
                                }
                            });
                        }
                    }, 100);
				}
			},
			function () {
				$(this).removeClass(options.css.hover);
				if($(this).hasClass(options.css.child)) {
					$(this).find('>ul').hide();
				}
			});
		});
	}
	init.call(_this,1);
	return _this;
}
})(jQuery);