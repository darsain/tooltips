# Examples

Assuming:

```js
var Tooltips = require('tooltips');
```

Bind tooltips to all elements on a page with `data-tooltip` attribute:

```js
var tips = new Tooltips(document.body); // Using all default options
```

Tooltips will be attached to elements like this:

```html
<div data-tooltip="Tooltip text!">target</div>
```

Tooltip text is used as tooltip's `innerHTML` content, so you can use HTML, but escape it beforehand.

---

Use custom data key to create focus hints for form elements:

```js
var hints = new Tooltips(document.body, {
	key: 'hint',
	showOn: 'focus',
	hideOn: 'blur'
});
```

The tooltips will than show on elements with `data-hint` attribute when they are focused:

```html
<input type="text" data-hint="Focused!" placeholder="Focus me!">
```

---

To make Tooltips automatically keep track of dynamically added/removed elements, enable the `observe` option:

```js
var tips = new Tooltips(document.body, {
	observe: 1
});
```

When you need to support browsers without Mutation Observer support, you can either use `.reload()` method on each DOM manipulation:

```js
document.body.appendChild(newElement);
tips.reload();
```

But that is a nuclear option that destroys everything and rebuilds it again.

Way more efficient is to notify current Tooltips instance about added or removed elements:

```js
document.body.appendChild(newElement);
tips.add(newElement);
document.body.removeChild(newElement);
tips.remove(newElement);
```

This will tell tooltip to look for added/removed tooltips only within `newElement`. You need to notify about removed elements so Tooltips can clean up after them (unbind event listeners and destroy Tooltip instances).

If `newElement` doesn't have `data-{key}` attribute, Tooltips will look on its children. This means that when you insert element like this into the DOM:

```html
<ul id="foo">
	<li><a href="#" data-tooltip="Tooltip text!">target</a></li>
	<li><a href="#" data-tooltip="Tooltip text!">target</a></li>
	<li><a href="#" data-tooltip="Tooltip text!">target</a></li>
</ul>
```

You need to pass only the `ul#foo` element into the `.add()` or `.remove()` method.