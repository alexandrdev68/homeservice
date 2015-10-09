function JSextra(par){
	this.showModal = function(params){
		params = params || {};
		params.mess = params.mess || 'no mess';
		params.title = params.title || '&nbsp;';
		params.options = params.options || {backdrop : true};
		params.buttonOk = params.buttonOk || 'Yes';
		params.buttonCancel = params.buttonCancel || 'No';
		params.okHandler = params.okHandler || function(){
			//$(windowModal).modal('hide');
			$(".fadebox,div._modalWindowSmall").hide();
		};
		params.cancelHandler = params.cancelHandler || function(){
			//$(windowModal).modal('hide');
			$(".fadebox,div._modalWindowSmall").hide();
		};
		var windowModal = document.querySelector('div._modalWindowSmall');
		if(windowModal === null){
			var html = '<div class="popup-box modal_box _modalWindowSmall"><div class="msgbox"><div class="msgbox-top">';
			html += '<h3 class="_titleText"></h3><span class="fade-close"></span></div><div class="msgbox-cont _messageText"></div>';
			html += '<div class="buttons_container top_margin20"><input type="button" value="Ok" style="display:inline-block" class="green-button right_margin10 _btnOkText"/>';
			html += '<input type="button" value="Cancel" style="display:inline-block" class="blue-button _btnCancelText"/></div></div></div>';
			$('.fadebox').append(html);
			$(document).toCenter('div._modalWindowSmall');
			$('input._btnOkText').on('click', params.okHandler);
			$('input._btnCancelText, div._modalWindowSmall .close').on('click', params.cancelHandler);
			$('div._modalWindowSmall .fade-close').on('click', function(){
				$(".fadebox,div._modalWindowSmall").hide();
			});
			windowModal = document.querySelector('div._modalWindowSmall');
		}
		$('div._modalWindowSmall ._titleText').text(params.title);
		$('div._modalWindowSmall ._messageText').text(params.mess);
		$('div._modalWindowSmall ._btnCancelText').text(params.buttonCancel);
		$('div._modalWindowSmall ._btnOkText').text(params.buttonOk);
		//$(windowModal).modal(params.options);
		$(".fadebox,div._modalWindowSmall").show();
		//$(windowModal).modal('show');
	};
}


function VTemplate(params){
	params = params || {};
	
	if(!!params.tmpName)
		this.tmpName = params.tmpName;
	else
		return false;
	
	if(!!params.functions)
		this.functions = params.functions;
	
	VTemplate.prototype.addTextNode = function(element, text){
		var textNode = document.createTextNode(text);
		element.appendChild(textNode);
	};
	
	VTemplate.prototype.textNode = function(element, text){
		if(element.childNodes.length > 0){
			for(var i = 0; i < element.childNodes.length; i++)
				element.removeChild(element.childNodes[i]);
		}
		element.appendChild(document.createTextNode(text));
	};
	
	this.workElement = {};
	
	this.afterRender = params.afterRender || function(tempElements){
		
	};
	
	VTemplate.prototype.render = function(data, element){
		element = element || null;
		var self = this;
		if(!!!data){
			console.log('data is not defined in template render function. template name: ' + self.tmpName);
			return false;
		}
		if(element !== null){
			if(element.length === undefined)
				element = [element];
			var tempElements = element;
		}else{
			var tempElements = document.querySelectorAll('[data-vtemplate_' + self.tmpName + ']');
		}
		var tmpSplit = [];
		var dataValue = '';
		var index = 'vtemplate_' + self.tmpName;
		var target = '';
		var targetVariable = '';
		//console.log(tempElements);
		for(var num = 0; num < tempElements.length; num++){
			
			dataValue = tempElements[num].dataset[index];
			tmpSplit = dataValue.split('=', 2);
			target = tmpSplit[0];
			targetVariable = tmpSplit[1];
			if(target != 'function'){
				targetVariable = 'data.' + targetVariable;
				if(!!!eval(targetVariable))
					continue;
				targetVariable = eval(targetVariable);
			}
			
			switch(target){
				case 'text':
					self.textNode(tempElements[num], targetVariable);
					break;
				case 'value':
					tempElements[num].value = targetVariable;
					break;
				case 'src':
					tempElements[num].setAttribute('src', targetVariable);
					break;
				case 'function':
					var fSplit = targetVariable.split(':', 2);
					if(fSplit[1] == '*'){
						fSplit[1] = 'data';
					}else{
						fSplit[1] = 'data.' + fSplit[1];
					}
					if(!!!eval(fSplit[1]))
						continue;
					fSplit[1] = eval(fSplit[1]);
					if(typeof(self.functions[fSplit[0]]) != 'function'){
						console.log('function: "' + fSplit[0] + '" not set in ' + tempElements[num].outerHTML);
						continue;
					}
					self.workElement = tempElements[num];
					self.functions[fSplit[0]](fSplit[1]);
					break;
			}
		}
		self.afterRender(tempElements);
	};
}

(function(){

	jQuery.fn.extend({
		toCenter : function (target_element){
		    var target = jQuery(target_element);
			if(jQuery instanceof Object) {
		        var containerHeight = jQuery(this).height();
		        var windowHeight = jQuery(window).height();
		        var containerWidth = jQuery(this).width();
		        var scrollLeft = jQuery(this).scrollLeft();
		        var scrollTop = jQuery(this).scrollTop();
		        var targetWidth = jQuery(target).width();
		        var targetHeight = jQuery(target).height();
				var elPosX = (containerWidth + scrollLeft) / 2 - targetWidth / 2;
		        var elPosY = (windowHeight > targetHeight ? (windowHeight - targetHeight) / 2 : 0);
		        jQuery(target).css({top : elPosY, left : elPosX, position : 'absolute'});
		    };
		},
		getJSONForm : function(){
			var fields = this.find('input, select, textarea');
			var JSONData = {};
			for(var num = 0; num < fields.length; num++){
				JSONData[jQuery(fields[num]).attr('name')] = jQuery(fields[num]).val();
			}
			return JSONData;
		},
		showAlert : function(params){
			var self = jQuery(this);
			params = params || {};
			params.name = params.name || 'noname';
			params.text = params.text || '';
			params.type = params.type || 'alert-success';
			params.warningText = params.warningText || 'Well done!';
			if(!!!params.fixed) 
				params.fixed = false;
			else
				params.fixed = true;
			var alert_element = jQuery(this).find('._' + params.name + '_AlertClass');
			if(alert_element.length > 0) alert_element.remove();
			var closeBtnClass = '_' + params.name + '_AlertCloseButtonClass';
			var messBodyClass = '_' + params.name + '_AlertClass';
			var html;
			html = '<div class="alert-container"><div class="' + closeBtnClass + ' alert ' + params.type + ' alert-dismissable ' + messBodyClass + (params.fixed ? ' ' + closeBtnClass : '') + '"';
			html += (params.fixed ? ' style="position:fixed;width:100%;z-index:10000;"' : '') + '>';
			if(!params.fixed)
				html += '<button type="button" class="' + closeBtnClass + ' close" data-dismiss="alert" aria-hidden="true"></button>';
			html += '<strong>' + params.warningText + '</strong> ' + params.text + '</div></div>';
			self.prepend(html);
			jQuery('.' + closeBtnClass).click(function(){
				jQuery('.' + messBodyClass).fadeOut('fast');
			});
				
			
			jQuery('._' + params.name + '_AlertClass').fadeIn('fast');
		},
		ajaxLoader : function(status){
			status = status || 'open';
			var shadow_element = jQuery(this).find('.shadow');
			if(shadow_element.length == 0){
				var loader = '<div class="loader"></div>';
				var shadow = '<div class="shadow">' + loader + '</div>';
				var width = jQuery(this).width();
				var height = jQuery(this).height();
				jQuery(this).prepend(shadow);
				shadow_element = jQuery(this).find('.shadow');
			}
			jQuery(this).toCenter('.loader');
			shadow_element.width(width);
			shadow_element.height(height);
			if(status == 'open'){
				shadow_element.show();
			}else if(status == 'close'){
				shadow_element.hide();
			}
			
		}
	});
			
	'use strict';

	var escape = /["\\\x00-\x1f\x7f-\x9f]/g,
		meta = {
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		hasOwn = Object.prototype.hasOwnProperty;

	/**
	 * jQuery.toJSON
	 * Converts the given argument into a JSON representation.
	 *
	 * @param o {Mixed} The json-serializable *thing* to be converted
	 *
	 * If an object has a toJSON prototype, that will be used to get the representation.
	 * Non-integer/string keys are skipped in the object, as are keys that point to a
	 * function.
	 *
	 */
	$.toJSON = typeof JSON === 'object' && JSON.stringify ? JSON.stringify : function (o) {
		if (o === null) {
			return 'null';
		}

		var pairs, k, name, val,
			type = $.type(o);

		if (type === 'undefined') {
			return undefined;
		}

		// Also covers instantiated Number and Boolean objects,
		// which are typeof 'object' but thanks to $.type, we
		// catch them here. I don't know whether it is right
		// or wrong that instantiated primitives are not
		// exported to JSON as an {"object":..}.
		// We choose this path because that's what the browsers did.
		if (type === 'number' || type === 'boolean') {
			return String(o);
		}
		if (type === 'string') {
			return $.quoteString(o);
		}
		if (typeof o.toJSON === 'function') {
			return $.toJSON(o.toJSON());
		}
		if (type === 'date') {
			var month = o.getUTCMonth() + 1,
				day = o.getUTCDate(),
				year = o.getUTCFullYear(),
				hours = o.getUTCHours(),
				minutes = o.getUTCMinutes(),
				seconds = o.getUTCSeconds(),
				milli = o.getUTCMilliseconds();

			if (month < 10) {
				month = '0' + month;
			}
			if (day < 10) {
				day = '0' + day;
			}
			if (hours < 10) {
				hours = '0' + hours;
			}
			if (minutes < 10) {
				minutes = '0' + minutes;
			}
			if (seconds < 10) {
				seconds = '0' + seconds;
			}
			if (milli < 100) {
				milli = '0' + milli;
			}
			if (milli < 10) {
				milli = '0' + milli;
			}
			return '"' + year + '-' + month + '-' + day + 'T' +
				hours + ':' + minutes + ':' + seconds +
				'.' + milli + 'Z"';
		}

		pairs = [];

		if ($.isArray(o)) {
			for (k = 0; k < o.length; k++) {
				pairs.push($.toJSON(o[k]) || 'null');
			}
			return '[' + pairs.join(',') + ']';
		}

		// Any other object (plain object, RegExp, ..)
		// Need to do typeof instead of $.type, because we also
		// want to catch non-plain objects.
		if (typeof o === 'object') {
			for (k in o) {
				// Only include own properties,
				// Filter out inherited prototypes
				if (hasOwn.call(o, k)) {
					// Keys must be numerical or string. Skip others
					type = typeof k;
					if (type === 'number') {
						name = '"' + k + '"';
					} else if (type === 'string') {
						name = $.quoteString(k);
					} else {
						continue;
					}
					type = typeof o[k];

					// Invalid values like these return undefined
					// from toJSON, however those object members
					// shouldn't be included in the JSON string at all.
					if (type !== 'function' && type !== 'undefined') {
						val = $.toJSON(o[k]);
						pairs.push(name + ':' + val);
					}
				}
			}
			return '{' + pairs.join(',') + '}';
		}
	};

	/**
	 * jQuery.evalJSON
	 * Evaluates a given json string.
	 *
	 * @param str {String}
	 */
	$.evalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		/*jshint evil: true */
		return eval('(' + str + ')');
	};

	/**
	 * jQuery.secureEvalJSON
	 * Evals JSON in a way that is *more* secure.
	 *
	 * @param str {String}
	 */
	$.secureEvalJSON = typeof JSON === 'object' && JSON.parse ? JSON.parse : function (str) {
		var filtered =
			str
			.replace(/\\["\\\/bfnrtu]/g, '@')
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
			.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered)) {
			/*jshint evil: true */
			return eval('(' + str + ')');
		}
		throw new SyntaxError('Error parsing JSON, source is not valid.');
	};

	/**
	 * jQuery.quoteString
	 * Returns a string-repr of a string, escaping quotes intelligently.
	 * Mostly a support function for toJSON.
	 * Examples:
	 * >>> jQuery.quoteString('apple')
	 * "apple"
	 *
	 * >>> jQuery.quoteString('"Where are we going?", she asked.')
	 * "\"Where are we going?\", she asked."
	 */
	$.quoteString = function (str) {
		if (str.match(escape)) {
			return '"' + str.replace(escape, function (a) {
				var c = meta[a];
				if (typeof c === 'string') {
					return c;
				}
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + str + '"';
	};

	})(jQuery);