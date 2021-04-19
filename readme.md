# eslint-plugin-ava [![Coverage Status](https://coveralls.io/repos/github/avajs/eslint-plugin-ava/badge.svg?branch=main)](https://coveralls.io/github/avajs/eslint-plugin-ava?branch=main)

> ESLint rules for [AVA](https://avajs.dev)

Translations: [Français](https://github.com/avajs/ava-docs/blob/main/fr_FR/related/eslint-plugin-ava/readme.md)

This plugin is bundled in [XO](https://github.com/xojs/xo). No need to do anything if you're using it.

[**Propose or contribute a new rule ➡**](.github/contributing.md)

## Install

```
$ npm install --save-dev eslint eslint-plugin-ava
```

## Usage

Configure it in `package.json`.

```json
{
	"name": "my-awesome-project",
	"eslintConfig": {
		"env": {
			"es6": true
		},
		"parserOptions": {
			"ecmaVersion": 2021,
			"sourceType": "module"
		},
		"plugins": [
			"ava"
		],
		"rules": {
			"ava/assertion-arguments": "error",
			"ava/hooks-order": "error",
			"ava/max-asserts": [
				"off",
				5
			],
			"ava/no-async-fn-without-await": "error",
			"ava/no-cb-test": "off",
			"ava/no-duplicate-modifiers": "error",
			"ava/no-error-ctor-with-notthrows": "error",
			"ava/no-identical-title": "error",
			"ava/no-ignored-test-files": "error",
			"ava/no-import-test-files": "error",
			"ava/no-incorrect-deep-equal": "error",
			"ava/no-inline-assertions": "error",
			"ava/no-invalid-end": "error",
			"ava/no-nested-tests": "error",
			"ava/no-only-test": "error",
			"ava/no-skip-assert": "error",
			"ava/no-skip-test": "error",
			"ava/no-statement-after-end": "error",
			"ava/no-todo-implementation": "error",
			"ava/no-todo-test": "warn",
			"ava/no-unknown-modifiers": "error",
			"ava/prefer-async-await": "error",
			"ava/prefer-power-assert": "off",
			"ava/prefer-t-regex": "error",
			"ava/test-ended": "error",
			"ava/test-title": "error",
			"ava/test-title-format": "off",
			"ava/use-t": "error",
			"ava/use-t-throws-async-well": "error",
			"ava/use-t-well": "error",
			"ava/use-test": "error",
			"ava/use-true-false": "error"
		}
	}
}
```

## Rules

The rules will only activate in test files.

- [assertion-arguments](docs/rules/assertion-arguments.md) - Enforce passing correct arguments to assertions.
- [hooks-order](docs/rules/hooks-order.md) - Enforce test hook ordering. *(fixable)*
- [max-asserts](docs/rules/max-asserts.md) - Limit the number of assertions in a test.
- [no-async-fn-without-await](docs/rules/no-async-fn-without-await.md) - Ensure that async tests use `await`.
- [no-cb-test](docs/rules/no-cb-test.md) - Ensure no `test.cb()` is used.
- [no-duplicate-modifiers](docs/rules/no-duplicate-modifiers.md) - Ensure tests do not have duplicate modifiers.
- [no-error-ctor-with-notthrows](docs/rules/no-error-ctor-with-notthrows.md) - Ensure no error constructor is specified in `t.notThrows()`.
- [no-identical-title](docs/rules/no-identical-title.md) - Ensure no tests have the same title.
- [no-ignored-test-files](docs/rules/no-ignored-test-files.md) - Ensure no tests are written in ignored files.
- [no-import-test-files](docs/rules/no-import-test-files.md) - Ensure no test files are imported anywhere.
- [no-incorrect-deep-equal](docs/rules/no-incorrect-deep-equal.md) - Avoid using `deepEqual` with primitives. *(fixable)*
- [no-inline-assertions](docs/rules/no-inline-assertions.md) - Ensure assertions are not called from inline arrow functions. *(fixable)*
- [no-invalid-end](docs/rules/no-invalid-end.md) - Ensure `t.end()` is only called inside `test.cb()`.
- [no-nested-tests](docs/rules/no-nested-tests.md) - Ensure no tests are nested.
- [no-only-test](docs/rules/no-only-test.md) - Ensure no `test.only()` are present.
- [no-skip-assert](docs/rules/no-skip-assert.md) - Ensure no assertions are skipped.
- [no-skip-test](docs/rules/no-skip-test.md) - Ensure no tests are skipped.
- [no-statement-after-end](docs/rules/no-statement-after-end.md) - Ensure `t.end()` is the last statement executed.
- [no-todo-implementation](docs/rules/no-todo-implementation.md) - Ensure `test.todo()` is not given an implementation function.
- [no-todo-test](docs/rules/no-todo-test.md) - Ensure no `test.todo()` is used.
- [no-unknown-modifiers](docs/rules/no-unknown-modifiers.md) - Prevent the use of unknown test modifiers.
- [prefer-async-await](docs/rules/prefer-async-await.md) - Prefer using async/await instead of returning a Promise.
- [prefer-power-assert](docs/rules/prefer-power-assert.md) - Allow only use of the asserts that have no [power-assert](https://github.com/power-assert-js/power-assert) alternative.
- [prefer-t-regex](docs/rules/prefer-t-regex.md) - Prefer using `t.regex()` to test regular expressions. *(fixable)*
- [test-ended](docs/rules/test-ended.md) - Ensure callback tests are explicitly ended.
- [test-title](docs/rules/test-title.md) - Ensure tests have a title.
- [test-title-format](docs/rules/test-title-format.md) - Ensure test titles have a certain format.
- [use-t](docs/rules/use-t.md) - Ensure test functions use `t` as their parameter.
- [use-t-throws-async-well](docs/rules/use-t-throws-async-well.md) - Ensure that `t.throwsAsync()` and `t.notThrowsAsync()` are awaited. *(partly fixable)*
- [use-t-well](docs/rules/use-t-well.md) - Prevent the incorrect use of `t`. *(partly fixable)*
- [use-test](docs/rules/use-test.md) - Ensure that AVA is imported with `test` as the variable name.
- [use-true-false](docs/rules/use-true-false.md) - Ensure that `t.true()`/`t.false()` are used instead of `t.truthy()`/`t.falsy()`.

## Recommended config

This plugin exports a [`recommended` config](index.js) that enforces good practices.

Enable it in your `package.json` with the `extends` option:

```json
{
	"name": "my-awesome-project",
	"eslintConfig": {
		"extends": "plugin:ava/recommended"
	}
}
```

See the [ESLint docs](https://eslint.org/docs/user-guide/configuring#extending-configuration-files) for more information about extending config files.

**Note**: This config will also enable the correct [parser options](https://eslint.org/docs/user-guide/configuring#specifying-parser-options) and [environment](https://eslint.org/docs/user-guide/configuring#specifying-environments).
