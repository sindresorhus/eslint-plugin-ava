const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/use-t');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		sourceType: 'module'
	}
});

const parameterNotNamedTErrors = [{
	message: 'Test parameter should be named `t`.'
}];

const header = 'const test = require(\'ava\');\n';

ruleTester.run('use-t', rule, {
	valid: [
		header + 'test();',
		header + 'test(() => {});',
		header + 'test(t => {});',
		header + 'test("test name", t => {});',
		header + 'test((t, foo) => {});',
		header + 'test(function (t) {});',
		header + 'test(testFunction);',
		header + 'test.macro(testFunction);',
		header + 'test.macro(t => {});',
		header + 'test.macro({exec: t => {}, title: () => "title"});',
		header + 'test.todo("test name");',
		// Shouldn't be triggered since it's not a test file
		'test(foo => {});',
		header + 'test(macro, arg1, (p1) => {})',
		header + 'test("name", macro, arg1, (p1) => {})',
		header + 'test("name", macro, (p1) => {})'
	],
	invalid: [
		{
			code: header + 'test(foo => {});',
			errors: parameterNotNamedTErrors
		},
		{
			code: header + 'test("test name", foo => {});',
			errors: parameterNotNamedTErrors
		},
		{
			code: header + 'test(function (foo) {});',
			errors: parameterNotNamedTErrors
		},
		{
			code: header + 'test.macro(function (foo) {});',
			errors: parameterNotNamedTErrors
		},
		{
			code: header + 'test.macro({ exec(foo) {} });',
			errors: parameterNotNamedTErrors
		}
	]
});
