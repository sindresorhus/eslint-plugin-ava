const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-todo-implementation');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const errors = [{
	message: '`test.todo()` should not be passed an implementation function.'
}];
const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-todo-implementation', rule, {
	valid: [
		header + 'test(t => {});',
		header + 'test("title", t => {});',
		header + 'test.todo("title");',
		header + 'notTest.todo(t => {});',
		// Shouldn't be triggered since it's not a test file
		'test.todo("title", t => {});'
	],
	invalid: [
		{
			code: header + 'test.todo("title", t => {});',
			errors
		},
		{
			code: header + 'test.todo(t => {});',
			errors
		},
		{
			code: header + 'test.todo("title", function (t) {});',
			errors
		},
		{
			code: header + 'test.todo(function (t) {});',
			errors
		},
		{
			code: header + 'test.todo("title", function foo(t) {});',
			errors
		},
		{
			code: header + 'test.todo(function foo(t) {});',
			errors
		}
	]
});
