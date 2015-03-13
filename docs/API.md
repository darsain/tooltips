# API

```js
var tips = new Tooltips(container, [options]);
```

### container

Type: `Element`

Tooltips container. Tooltips will be bound to `data-{key}` elements that are descendants of this element.

### [options]

Type: `Object`

Tooltips options object.

Default options are stored in `Tooltips.defaults`, and look like this:

```js
Tooltips.defaults = {
	tooltip:    {},          // Options for individual Tooltip instances.
	key:       'tooltip',    // Tooltips data attribute key.
	showOn:    'mouseenter', // Show tooltip event.
	hideOn:    'mouseleave', // Hide tooltip event.
	observe:   0             // Enable mutation observer (used only when supported).
};
```

##### tooltip

Type `Object` Default `{}`

[`Tooltip`](https://github.com/darsain/tooltip) options that will be used for every Tooltip in this instance, unless overridden by element's `data-{key}-{optionName}` attribute.

##### key

Type `String` Default `tooltip`

Data key name used to recognize elements with tooltips, and retrieve the Tooltip content & options.

```html
<div data-tooltip="This is tooltip" data-tooltip-type="success"></div>
```

##### showOn

Type `String` Default `mouseenter`

Event that - when triggered on an element with `data-{key}` attribute - should show a tooltip.

##### hideOn

Type `String` Default `mouseleave`

Event that - when triggered on an element with `data-{key}` attribute - should hide a tooltip.

##### observe

Type `Boolean` Default `false`

Whether to use Mutation Observer to keep track of dynamic elements inside `container`.

## Methods

Unless stated otherwise, all methods return tooltips object, making them chainable.

#### #show(element)

`Element` **element**

Show Tooltip associated to an `element`. If Tooltip doesn't exist yet, it will be created using current instance's options.

#### #hide(element)

`Element` **element**

Hide Tooltip associated to an `element`.

#### #toggle(element)

`Element` **element**

Hide/Show Tooltip associated to an `element`.

#### #get(element)

`Element` **element**

Get Tooltip associated to an `element`.

#### #add(element)

`Element` **element**

When not using Mutation Observer, you can use this method to notify Tooltips instance that element has been added. Tooltips will than look at the element and its children for elements with `data-{key}` attributes and attach tooltips to them.

#### #remove(element)

`Element` **element**

When not using Mutation Observer, you can use this method to notify Tooltips instance that element has been removed. Tooltips will than look at the element and its children for elements with `data-{key}` attributes and detach tooltips from them.

#### #reload()

Unbinds all current attached tooltips, clears event listeners, and than reapplies everything to elements with `data-{key}` attributes inside `container`.

Use this when you are changing DOM, not using Mutation Observer, and don't want to bother with `.add()` and `.remove()` methods. Using this instead of `.add()` & `.remove()` is less efficient.

#### #destroy()

Destroys the Tooltips instance. Clears all event listeners, destroys all tooltips, and clears objects.

## Properties

#### #container

Container element of a current instance.

#### #elements

Array of elements with `data-{key}` attributes the current instance is keeping track of.

#### #options

Tooltips options object.

## HTML

Tooltips looks for elements with `data-{key}` attributes and creates tooltips for them. We will assume that key is a default value `tooltip`.

Tooltip content is retrieved from main `data-tooltip` attribute:

```html
<div data-tooltip="Tooltip text!">target</div>
```

You can also override options for individual tooltips with additional attributes:

```html
<div data-tooltip="Tooltip text!" data-tooltip-place="right" data-tooltip-type="light">target</div>
```