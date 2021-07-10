# Ensure tests do not have duplicate modifiers

Translations: [Français](https://github.com/avajs/ava-docs/blob/main/fr_FR/related/eslint-plugin-ava/docs/rules/no-duplicate-modifiers.md)

Prevent the use of duplicate [test modifiers](https://github.com/avajs/ava/blob/main/docs/01-writing-tests.md).

## Fail

```js
const test = require('ava');

test.only.only(t => {});
test.serial.serial(t => {});
test.beforeEach.beforeEach(t => {});
```

## Pass

```js
const test = require('ava');

test.only(t => {});
test.serial(t => {});
test.beforeEach(t => {});
```
