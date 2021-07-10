const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-todo-test');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const errors = [{}];
const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-todo-test', rule, {
	valid: [
		header + 'test("my test name", t => { t.pass(); });',
		header + 'test.only("my test name", t => { t.pass(); });',
		header + 'notTest.todo(t => { t.pass(); });',
		// Shouldn't be triggered since it's not a test file
		'test.todo("my test name");'
	],
	invalid: [
		{
			code: header + 'test.todo("my test name");',
			errors
		}
	]
});
