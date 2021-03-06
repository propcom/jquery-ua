var UA = (function() {

	var pageviewSent = false;
	var required = {
		'ec': false
	};

	function initLibraries() {
		(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
		m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
		})(window,document,'script','//www.google-analytics.com/analytics.js','ga');
	}


	/* PRODUCTS impressions and actions */

	function impressions() {
		if (! $(".ua_addImpression").size()) return;

		var batchSize = 20;
		var counter = 0;

		var properties = ['id', 'name', 'list', 'brand', 'category', 'variant', 'position', 'price'];

		$(".ua_addImpression").each(function() {
			markAsSent($(this), 'ua_addImpression');
			var fieldsObj = {};
			for (var i in properties) {
				var p = properties[i];
				if ($(this).data(p)) {
					fieldsObj[p] = $(this).data(p);
				}
			}
			ga('ec:addImpression', fieldsObj);

			counter++;
			if (! (counter % batchSize)) {
				gaSendNI();
			}
		});

		// The data is processed in batches of 'batchSize' so there will be
		// some left-overs - calling an event here will send them over.
		gaSendNI();
	}


	function productActions() {
		$(".ua_addProduct").each(function() {
			var actions = $(this).data('ua-ec-actions')
			if (! actions) return;

			actionsArray = actions.split(' ');
			for (var i in actionsArray) {
				singleProductAction(actionsArray[i], $(this));
				//if (isBulkAction(actions[i])) singleProductAction(actions[i], $(this));
			}
			markAsSent($(this), 'ua_addProduct');
		});
	}


	function singleProductAction(action, $element, callback) {
		ga('ec:addProduct', buildAddproductPropertiesObject($element));

		var obj = buildActionPropertiesObject($element);
		if ($.isEmptyObject(obj)) {
			ga('ec:setAction', action)
		} else {
			ga('ec:setAction', action, obj);
		}

		gaSendNI(callback);
	}


	/* PROMOTIONS impressions and actions */

	function promoImpressions() {
		var className = "ua_addPromoImpression";

		if (! $("." + className).size()) return;

		var properties = ['id', 'name', 'creative', 'position'];

		$("." + className).each(function() {
			markAsSent($(this), className);
			var fieldsObj = {};
			for (var i in properties) {
				var p = properties[i];
				if ($(this).data(p)) {
					fieldsObj[p] = $(this).data(p);
				}
			}
			ga('ec:addPromo', fieldsObj);
		});

		gaSendNI();
	}


	function promoClicks() {
		$(".ua_addPromoClick").each(function() {
			singlePromoAction('promo_click', $(this));
			markAsSent($(this), 'ua_addPromo');
		});
	}


	function singlePromoAction(action, $element, callback) {
		ga('ec:addPromo', buildAddpromoPropertiesObject($element));

		var obj = buildActionPropertiesObject($element);
		if ($.isEmptyObject(obj)) {
			ga('ec:setAction', action)
		} else {
			ga('ec:setAction', action, obj);
		}

		gaSendNI(callback);
	}



	/* HELPERS */

	var productActionsSingle = [
		'click',
		'add',
		'remove',
		'checkout_option',
		'promo_click'
	];

	var productActionsBulk = [
		'detail',
		'checkout',
		'purchase',
		'refund'
	];


	function markAsSent($element, className) {
		$element.removeClass(className);
		$element.addClass(className + '-sent');
	}

	function isBulkAction(action_name) {
		var isBulkAction = false;

		for (var i in productActionsBulk) {
			if (productActionsBulk[i] == action_name) {
				isBulkAction = true;
				break;
			}
		}

		return isBulkAction;
	}


	function buildAddproductPropertiesObject($element) {
		var properties = [
			'id', // SKU
			'name',
			'brand',
			'category',
			'variant',
			'position',
			'price',
			'quantity'
		];

		return dataAttributesIntoObject($element, properties, 'product-');
	}


	function buildActionPropertiesObject($element) {
		var properties = [
			'id', // for purchase/refund only
			'affiliation',
			'revenue',
			'tax',
			'shipping',
			'coupon',
			'list',
			'step',
			'option'
		];

		return dataAttributesIntoObject($element, properties, 'action-');
	}


	function buildAddpromoPropertiesObject($element) {
		var properties = [
			'id',
			'name',
			'creative',
			'position'
		];

		return dataAttributesIntoObject($element, properties);
	}

	/**
	 * <div ... data-product-id="123" ...>
	 * <div ... data-action-id="123" ...>
	 */
	function dataAttributesIntoObject($element, properties, prefix) {
		var obj = {};
		var dataAttributePrefix = prefix || '';

		for (var i in properties) {
			var p = properties[i];
			if ($element.data(dataAttributePrefix + p)) {
				obj[p] = $element.data(dataAttributePrefix + p);
			} else if (p != 'id' && $element.data(p)) {
				obj[p] = $element.data(p);
			}
		}

		return obj;
	}


	function gaSendNI(callback) {
		var fieldsObj = {
			'hitType': 'event',
			'eventCategory': 'prop_ua',
			'eventAction': 'prop_ua_action',
			'nonInteraction': 1
		}

		if (callback) {
			fieldsObj.hitCallback = function() { callback(); }
		}
		gaSend(fieldsObj);
	}


	function gaSend(fieldsObject) {
		var command = 'send';
		ga(command, fieldsObject);
	}


	function gaRequire(library) {
		if (! required[library]) {
			ga('require', library);
			required[library] = true;
		}
	}


	function properCase(str) {
		var upper = str.charAt(0).toUpperCase();
		var lower = str.substr(1).toLowerCase();
		return upper + lower;
	}



	/* PUBLIC */

	var publicMethods = {

		// e.g. UA.init('UA-40945150-3');
		init: function(tracking_code) {
			initLibraries();
		  ga('create', tracking_code, 'auto');
		},

		sendImpressions: function() {
			$(function() {
				gaRequire('ec');
				impressions();
			});
		},

		sendProductActions: function() {
			$(function() {
				gaRequire('ec');
				productActions();
			});
		},

		sendSingleProductAction: function(action, $element, callback) {
			$(function() {
				gaRequire('ec');
				singleProductAction(action, $element, callback);
			});
		},

		sendPromoImpressions: function() {
			$(function() {
				gaRequire('ec');
				promoImpressions();
			});
		},

		sendPromoClicks: function() {
			$(function() {
				gaRequire('ec');
				promoClicks();
			});
		},

		sendSinglePromoClick: function($element, callback) {
			$(function() {
				gaRequire('ec');
				singlePromoAction("promo_click", $element, callback);
			});
		},

		sendPageview: function(forceSend) {
			if (pageviewSent && ! forceSend) {
				console.warn("[UA] 'pageview' was already sent - use 'forceSend'.");
			} else {
				pageviewSent = true;
				$(function() {
					gaSend({hitType: 'pageview'});
				});
			}
		}

	}

	return publicMethods;

})();
