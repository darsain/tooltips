'use strict';

/**
 * Dependencies.
 */
var evt = require('event');
var indexOf = require('indexof');
var Tooltip = require('tooltip');
var dataset = require('dataset');

/**
 * Transport.
 */
module.exports = Tooltips;

/**
 * Globals.
 */
var MObserver = window.MutationObserver || window.WebkitMutationObserver;

/**
 * Prototypal inheritance.
 *
 * @param {Object} o
 *
 * @return {Object}
 */
var objectCreate = Object.create || (function () {
	function F() {}
	return function (o) {
		F.prototype = o;
		return new F();
	};
})();

/**
 * Poor man's shallow object extend.
 *
 * @param {Object} a
 * @param {Object} b
 *
 * @return {Object}
 */
function extend(a, b) {
	for (var key in b) {
		a[key] = b[key];
	}
	return a;
}

/**
 * Capitalize the first letter of a string.
 *
 * @param {String} string
 *
 * @return {String}
 */
function ucFirst(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Tooltips constructor.
 *
 * @param {Element} container
 * @param {Object}  options
 *
 * @return {Tooltips}
 */
function Tooltips(container, options) {
	if (!(this instanceof Tooltips)) {
		return new Tooltips(container, options);
	}

	var self = this;
	var observer, TID;

	/**
	 * Show tooltip attached to an element.
	 *
	 * @param {Element} element
	 *
	 * @return {Tooltips}
	 */
	self.show = function (element) {
		return callTooltipMethod(element, 'show');
	};

	/**
	 * Hide tooltip attached to an element.
	 *
	 * @param {Element} element
	 *
	 * @return {Tooltips}
	 */
	self.hide = function (element) {
		return callTooltipMethod(element, 'hide');
	};

	/**
	 * Toggle tooltip attached to an element.
	 *
	 * @param {Element} element
	 *
	 * @return {Tooltips}
	 */
	self.toggle = function (element) {
		return callTooltipMethod(element, 'toggle');
	};

	/**
	 * Retrieve tooltip attached to an element and call it's method.
	 *
	 * @param {Element} element
	 * @param {String}  method
	 *
	 * @return {Tooltips}
	 */
	function callTooltipMethod(element, method) {
		var tip = self.get(element);
		if (tip) {
			tip[method]();
		}
		return self;
	}

	/**
	 * Return a tooltip attached to an element. Tooltip is created if it doesn't exist yet.
	 *
	 * @param {Element} element
	 *
	 * @return {Tooltip}
	 */
	self.get = function (element) {
		var tip = !!element && (element[TID] || createTip(element));
		if (tip && !element[TID]) {
			element[TID] = tip;
		}
		return tip;
	};

	/**
	 * Add element(s) to Tooltips instance.
	 *
	 * @param {[type]} element Can be element, or container containing elements to be added.
	 *
	 * @return {Tooltips}
	 */
	self.add = function (element) {
		if (!element || element.nodeType !== 1) {
			return self;
		}
		if (dataset(element).get(options.key)) {
			bindElement(element);
		} else if (element.children) {
			bindElements(element.querySelectorAll(self.selector));
		}
		return self;
	};

	/**
	 * Remove element(s) from Tooltips instance.
	 *
	 * @param {Element} element Can be element, or container containing elements to be removed.
	 *
	 * @return {Tooltips}
	 */
	self.remove = function (element) {
		if (!element || element.nodeType !== 1) {
			return self;
		}
		if (dataset(element).get(options.key)) {
			unbindElement(element);
		} else if (element.children) {
			unbindElements(element.querySelectorAll(self.selector));
		}
		return self;
	};

	/**
	 * Reload Tooltips instance.
	 *
	 * Unbinds current tooltipped elements, than selects the
	 * data-key elements from container and binds them again.
	 *
	 * @return {Tooltips}
	 */
	self.reload = function () {
		// Unbind old elements
		unbindElements(self.elements);
		// Bind new elements
		bindElements(self.container.querySelectorAll(self.selector));
		return self;
	};

	/**
	 * Destroy Tooltips instance.
	 *
	 * @return {Void}
	 */
	self.destroy = function () {
		unbindElements(this.elements);
		if (observer) {
			observer.disconnect();
		}
		this.container = this.elements = this.options = observer = null;
	};

	/**
	 * Create a tip from element data attributes.
	 *
	 * @param {Element} element
	 *
	 * @return {Tooltip}
	 */
	function createTip(element) {
		var data = dataset(element);
		var content = data.get(options.key);
		if (!content) {
			return false;
		}
		var tipOptions = objectCreate(options.tooltip);
		var keyData;
		for (var key in Tooltip.defaults) {
			keyData = data.get(options.key + ucFirst(key.replace(/Class$/, '')));
			if (!keyData) {
				continue;
			}
			tipOptions[key] = keyData;
		}
		return new Tooltip(content, tipOptions).attach(element);
	}

	/**
	 * Bind Tooltips events to Array/NodeList of elements.
	 *
	 * @param {Array} elements
	 *
	 * @return {Void}
	 */
	function bindElements(elements) {
		for (var i = 0, l = elements.length; i < l; i++) {
			bindElement(elements[i]);
		}
	}

	/**
	 * Bind Tooltips events to element.
	 *
	 * @param {Element} element
	 *
	 * @return {Void}
	 */
	function bindElement(element) {
		if (element[TID] || ~indexOf(self.elements, element)) {
			return;
		}
		evt.bind(element, options.showOn, eventHandler);
		evt.bind(element, options.hideOn, eventHandler);
		self.elements.push(element);
	}

	/**
	 * Unbind Tooltips events from Array/NodeList of elements.
	 *
	 * @param {Array} elements
	 *
	 * @return {Void}
	 */
	function unbindElements(elements) {
		if (self.elements === elements) {
			elements = elements.slice();
		}
		for (var i = 0, l = elements.length; i < l; i++) {
			unbindElement(elements[i]);
		}
	}

	/**
	 * Unbind Tooltips events from element.
	 *
	 * @param {Element} element
	 *
	 * @return {Void}
	 */
	function unbindElement(element) {
		var index = indexOf(self.elements, element);
		if (!~index) {
			return;
		}
		if (element[TID]) {
			element[TID].destroy();
			delete element[TID];
		}
		evt.unbind(element, options.showOn, eventHandler);
		evt.unbind(element, options.hideOn, eventHandler);
		self.elements.splice(index, 1);
	}

	/**
	 * Tooltips events handler.
	 *
	 * @param {Event} event
	 *
	 * @return {Void}
	 */
	function eventHandler(event) {
		/*jshint validthis:true */
		if (options.showOn === options.hideOn) {
			self.toggle(this);
		} else {
			self[event.type === options.showOn ? 'show' : 'hide'](this);
		}
	}

	/**
	 * Mutations handler.
	 *
	 * @param {Array} mutations
	 *
	 * @return {Void}
	 */
	function mutationsHandler(mutations) {
		var added, removed, i, l;
		for (var m = 0, ml = mutations.length; m < ml; m++) {
			added = mutations[m].addedNodes;
			removed = mutations[m].removedNodes;
			for (i = 0, l = added.length; i < l; i++) {
				self.add(added[i]);
			}
			for (i = 0, l = removed.length; i < l; i++) {
				self.remove(removed[i]);
			}
		}
	}

	// Construct
	(function () {
		self.container = container;
		self.options = options = extend(objectCreate(Tooltips.defaults), options);
		self.ID = TID = options.key + Math.random().toString(36).slice(2);
		self.elements = [];

		// Create tips selector
		self.selector = '[data-' + options.key + ']';

		// Load tips
		self.reload();

		// Create mutations observer
		if (options.observe && MObserver) {
			observer = new MObserver(mutationsHandler);
			observer.observe(self.container, {
				childList: true,
				subtree: true
			});
		}
	}());
}

/**
 * Expose Tooltip.
 */
Tooltips.Tooltip = Tooltip;

/**
 * Default Tooltips options.
 *
 * @type {Object}
 */
Tooltips.defaults = {
	tooltip:    {},          // Options for individual Tooltip instances.
	key:       'tooltip',    // Tooltips data attribute key.
	showOn:    'mouseenter', // Show tooltip event.
	hideOn:    'mouseleave', // Hide tooltip event.
	observe:   0             // Enable mutation observer (used only when supported).
};