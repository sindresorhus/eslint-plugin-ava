const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-invalid-modifier-chain');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		ecmaVersion: 2021
	}
});

const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-invalid-modifier-chain', rule, {
	valid: [
		header + 'test(t => {})',
		header + 'test.only(t => {});',
		// Not using the test variable
		header + 'notTest.skap(t => {});',
		header + 'serial.test(t => {})',
		// Not a test file
		'test.skap(t => {});'
	],
	invalid: [
		{
			code: header + 'test.skap(t => {})',
			errors: [{
				messageId: 'unknown',
				data: {
					name: 'skap'
				}
			}]
		},
		{
			code: header + 'test.serial.skap(t => {})',
			errors: [{
				messageId: 'unknown',
				data: {
					name: 'skap'
				}
			}]
		},
		{
			code: header + 'test.failing.failing(t => {})',
			errors: [{
				messageId: 'duplicate',
				data: {
					name: 'failing'
				}
			}]
		},
		{
			code: header + 'test.todo.only(t => {})',
			errors: [{
				messageId: 'conflict',
				data: {
					nameB: 'todo'
				}
			}]
		},
		{
			code: header + 'test.only.todo(t => {})',
			errors: [{
				messageId: 'conflict',
				data: {
					nameB: 'only'
				}
			}]
		},
		{
			code: header + 'test.failing.serial(t => {})',
			errors: [{
				messageId: 'position',
				data: {
					name: 'failing'
					// Position: '2'
				}
			}, {
				messageId: 'position',
				data: {
					name: 'serial'
					// Position: '3'
				}
			}]
		},
		{
			code: header + 'test.only.skip(t => {})',
			errors: [{
				messageId: 'conflict',
				data: {
					nameB: 'only'
				}
			}]
		},
		{
			code: header + 'test.skip.only(t => {})',
			errors: [{
				messageId: 'conflict',
				data: {
					nameB: 'skip'
				}
			}]
		},
		{
			code: header + 'test.before.always(t => {})',
			errors: [{
				messageId: 'conflict',
				data: {
					nameB: 'before'
				}
			}]
		},
		{
			code: header + 'test.always.after(t => {})',
			errors: [{
				messageId: 'position',
				data: {
					name: 'always'
				}
			}, {
				messageId: 'position',
				data: {
					name: 'after'
				}
			}]
		},
		{
			code: header + 'test.before.only(t => {})',
			errors: [{
				messageId: 'missing',
				data: {
					name: 'cb',
					position: '2'
				}
			}]
		},
		{
			code: header + 'test.skip.failing.serial(t => {})',
			errors: [{
				messageId: 'position',
				data: {
					name: 'skip'
				}
			}, {
				messageId: 'position',
				data: {
					name: 'serial'
				}
			}]
		},
		{
			code: header + 'test.failing.cb(t => {})',
			errors: [{
				messageId: 'position',
				data: {
					name: 'failing'
				}
			}, {
				messageId: 'position',
				data: {
					name: 'cb'
				}
			}]
		},
		{
			code: header + 'test.after.todo(t => {})',
			errors: [{
				messageId: 'conflict',
				data: {
					nameB: 'after'
				}
			}]
		}
	]
});
