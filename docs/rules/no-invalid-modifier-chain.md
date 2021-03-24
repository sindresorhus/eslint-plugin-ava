# Ensure valid modifier chains in tests and hooks

Translations: [Français](https://github.com/avajs/ava-docs/blob/master/fr_FR/related/eslint-plugin-ava/docs/rules/no-invalid-modifier-chain.md)

Disallow the invalid combinations, order, and names of modifiers in tests and hooks.


## Fail

```js
const test = require('ava');

// Mispelled .todo
test.todu(t => {})
// Modifiers can't be repeated
test.failing.failing(t => {})
// .todo can't be chained (except after .serial)
test.todo.only(t => {})
// .failing can only be suceeded by .only and .skip
test.failing.serial(t => {})
// .only must be last
test.only.skip(t => {})
// .skip must be last
test.skip.only(t => {})
// .always is only available in .after* hooks
test.before.always(t => {})
// .always must suceed .after
test.always.after(t => {})
// .only is not available in hooks
test.before.only(t => {})
```


## Pass

```js
const test = require('ava');

test(t => {});
test.serial(t => {})
test.serial.todo(t => {})
test.failing.only(t => {})
test.serial.cb.skip(t => {})
test.after.always.cb.skip(t => {})
```
