const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-skip-test');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const message = 'No tests should be skipped.';
const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-skip-test', rule, {
	valid: [
		header + 'test("my test name", t => { t.pass(); });',
		header + 'test(t => { t.pass(); }); test(t => { t.pass(); });',
		header + 'test(t => { t.skip.is(1, 2); });',
		header + 'notTest.skip();',
		// Shouldn't be triggered since it's not a test file
		'test.skip(t => {});'
	],
	invalid: [
		{
			code: header + 'test.skip(t => { t.pass(); });',
			errors: [{
				message,
				type: 'Identifier',
				line: 2,
				column: 6,
				suggestions: [{
					desc: 'Remove the `.skip`',
					output: header + 'test(t => { t.pass(); });'
				}]
			}]
		}
	]
});
