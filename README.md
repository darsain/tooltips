# [Tooltips](http://darsa.in/tooltips)

Wrapper for [`darsain/tooltip`](http://github.com/darsain/tooltip) library that provides simple bindings for DOM elements
with `data-{key}` attributes.

Tooltips can use mutation observers to handle dynamic elements, but also provides a fallback methods when you need to
support older browsers.

It works by attaching events defined in `showOn` & `hideOn` options to each element with `data-{key}` attribute. This is
way better for performance than attaching these events to `container` and handling them for all elements on a page.
Especially in case of events like `mouseenter` & `mouseleave`, which are the main focus of this library.

To save memory, `Tooltip` instances are created only when first `showOn` event is fired.

#### Compatibility

Browser support starts at IE8+, with an exception of automatic binding to dynamic elements via Mutation Observers, which
are used only when supported. Mutation Observers have been implemented in all modern browsers and IE11.

If you want to support browsers without Mutation Observers, you can fall back to `.reload()` method, or manage dynamic
elements as you add & remove them with `.add()` & `.remove()` methods.

### [Changelog](https://github.com/darsain/tooltips/releases)

Upholds the [Semantic Versioning Specification](http://semver.org/).

## Install

Tooltips is a [component](https://github.com/component/component):

```bash
component install darsain/tooltips
```

## Download

Standalone build of a latest stable version:

- [`tooltips.zip`](http://darsain.github.io/tooltips/dist/tooltips.zip) - combined archive
- [`tooltips.js`](http://darsain.github.io/tooltips/dist/tooltips.js) - 38 KB *sourcemapped*
- [`tooltips.min.js`](http://darsain.github.io/tooltips/dist/tooltips.min.js) - 14 KB, 2.8KB gzipped
- [`tooltips.css`](http://darsain.github.io/tooltips/dist/tooltips.css) - 4.5 KB *including transitions & types*

When isolating issues on jsfiddle, use the [`tooltips.js`](http://darsain.github.io/tooltips/dist/tooltips.js) URL above.

## Documentation

- **[Tooltips](https://github.com/darsain/tooltips/wiki/Tooltips)** - `Tooltips` API
- **[Examples](https://github.com/darsain/tooltips/wiki/Examples)** - usage examples

## Contributing

Please, read the [Contributing Guidelines](CONTRIBUTING.md) for this project.

## License

MIT