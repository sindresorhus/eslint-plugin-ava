# Ensure test functions use `t` as their parameter

Translations: [Français](https://github.com/avajs/ava-docs/blob/main/fr_FR/related/eslint-plugin-ava/docs/rules/use-t.md)

The convention is to have the parameter in AVA's test function be named `t`. Most rules in `eslint-plugin-ava` are based on that assumption.

### Fail

```js
const test = require('ava');

test('foo', foo => { // Incorrect name
	t.pass();
});
```

### Pass

```js
const test = require('ava');

test('foo', () => {
	// ...
});

test('bar', t => {
	t.pass();
});
```
