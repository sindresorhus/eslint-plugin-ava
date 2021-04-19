# No specifying error type in `t.notThrows()`

AVA will fail if error constructor is specified in the second argument of `t.notThrows()`.


## Fail

```js
const test = require('ava');

test('some test', t => {
    t.notThrows(() => {
        t.pass();
    }, TypeError);
});
```


## Pass

```js
const test = require('ava');

test('some test', t => {
    t.notThrows(() => {
        t.pass();
    });
});

test('some test', t => {
    t.throws(() => {
        t.pass();
    }, TypeError);
});
```
