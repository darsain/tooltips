'use strict';

var Tooltips = require('tooltips');
var $ = require('jquery');

// Main examples
var tips = window.tips = new Tooltips(document, {
	tooltip: {
		effectClass: 'slide',
		auto: 1
	},
	key: 'tip',
	observe: 1
});

// Dynamic test
(function () {
	var $dynamic = $('#dynamic');
	var $targets = $dynamic.find('.targets');

	$dynamic.on('click', 'button', function () {
		var action = $(this).data('action');
		switch (action) {
			case 'add':
				$targets.append('<li class="target" data-tip="A new tip appeared!">new</li>');
				break;
			case 'remove':
				$targets.children().eq(-1).remove();
				break;
		}
	});
}());

// Movable test
(function () {
	$('.target.movable').each(function (i, target) {
		var tip = tips.get(target);

		// Dragging
		var dragger = new DragAndReset(target);
		dragger.onMove = function reposition() {
			tip.position();
		};
	});
}());

// Focusable test
window.ftips = new Tooltips(document, {
	key: 'ftip',
	showOn: 'focus',
	hideOn: 'blur',
	tooltip: {
		place: 'right'
	}
});

// Helpers
var rAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
	return setTimeout(callback, 17);
};
var getProp = window.getComputedStyle ? function getProp(element, name) {
	return window.getComputedStyle(element, null)[name];
} : function getProp(element, name) {
	return element.currentStyle[name];
};
function parsePx(value) {
	return 0 | Math.round(String(value).replace(/[^\-0-9.]/g, ''));
}

/**
 * Dragging class
 *
 * @param {Element} element
 */
function DragAndReset(element) {
	if (!(this instanceof DragAndReset)) {
		return new DragAndReset(element);
	}

	var self = this;
	var $document = $(document);
	var frameID = 0;
	self.element = element;
	self.initialized = 0;
	self.path = {
		left: 0,
		top: 0
	};

	function move(event) {
		self.path.left = event.pageX - self.origin.left;
		self.path.top = event.pageY - self.origin.top;
		if (!self.initialized && (Math.abs(self.path.left) > 10 || Math.abs(self.path.top) > 10)) {
			self.initialized = 1;
		}
		if (self.initialized) {
			requestReposition();
		}
		return false;
	}

	function requestReposition() {
		if (!frameID) {
			frameID = rAF(reposition);
		}
	}

	function reposition() {
		frameID = 0;
		element.style.left = (self.originPos.left + self.path.left) + 'px';
		element.style.top = (self.originPos.top + self.path.top) + 'px';
		if (self.onMove) {
			self.onMove();
		}
	}

	function init(event) {
		self.origin = {
			left: event.pageX,
			top: event.pageY
		};
		self.originPos = {
			left: parsePx(getProp(element, 'left')),
			top: parsePx(getProp(element, 'top'))
		};
		$document.on('mousemove', move);
		$document.on('mouseup', self.end);
		return false;
	}

	self.end = function () {
		self.initialized = 0;
		self.path.top = self.path.left = 0;
		requestReposition();
		$document.off('mousemove', move);
		$document.off('mouseup', self.end);
	};

	(function () {
		$(element).on('mousedown', init);
	}());
}
