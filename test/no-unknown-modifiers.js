const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-unknown-modifiers');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-unknown-modifiers', rule, {
	valid: [
		`${header}test(t => {});`,
		`${header}test.after(t => {});`,
		`${header}test.afterEach(t => {});`,
		`${header}test.before(t => {});`,
		`${header}test.beforeEach(t => {});`,
		`${header}test.only(t => {});`,
		`${header}test.serial(t => {});`,
		`${header}test.skip(t => {});`,
		`${header}test.todo(t => {});`,
		`${header}test.after.always(t => {});`,
		`${header}test.afterEach.always(t => {});`,
		`${header}test.failing(t => {});`,
		`${header}test.macro(t => {});`,
		// Shouldn't be triggered since it's not a test file
		'test.foo(t => {});'
	],
	invalid: [
		{
			code: `${header}test.foo(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.foo`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.onlu(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.onlu`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.beforeeach(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.beforeeach`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.c.only(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.c`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.cb(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.cb`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.foo.bar.baz(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.foo`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.default(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.default`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		},
		{
			code: `${header}test.test(t => {});`,
			errors: [{
				message: 'Unknown test modifier `.test`.',
				type: 'Identifier',
				line: 2,
				column: 6
			}]
		}
	]
});
