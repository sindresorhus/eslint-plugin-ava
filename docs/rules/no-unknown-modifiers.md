# Prevent the use of unknown test modifiers

Translations: [Français](https://github.com/avajs/ava-docs/blob/main/fr_FR/related/eslint-plugin-ava/docs/rules/no-unknown-modifiers.md)

Prevent the use of unknown [test modifiers](https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md).

## Fail

```js
const test = require('ava');

test.onlu(t => {});
test.seril(t => {});
test.beforeeach(t => {});
test.unknown(t => {});
```

## Pass

```js
const test = require('ava');

test.only(t => {});
test.serial(t => {});
test.beforeEach(t => {});
```
