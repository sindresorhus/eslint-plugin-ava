const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-duplicate-modifiers');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const header = 'const test = require(\'ava\');\n';

const modifiers = [
	'after',
	'afterEach',
	'always',
	'before',
	'beforeEach',
	'cb',
	'failing',
	'only',
	'serial',
	'skip',
	'todo'
];

const valid = modifiers.map(modifier => `${header}test.${modifier}(t => {});`);
const invalid = modifiers.map(modifier => ({
	code: `${header}test.${modifier}.${modifier}(t => {});`,
	errors: [
		{
			message: `Duplicate test modifier \`.${modifier}\`.`,
			type: 'Identifier',
			line: 2,
			column: 7 + modifier.length
		}
	]
}));

ruleTester.run('no-duplicate-modifiers', rule, {
	valid: [...valid,
		`${header}test(t => {});`,
		`${header}test.cb.only(t => {});`,
		`${header}test.after.always(t => {});`,
		`${header}test.afterEach.always(t => {});`,
		`${header}test.failing.cb(t => {});`,
		// Shouldn't be triggered since it's not a test file
		'test.serial.serial(t => {});'],
	invalid: [...invalid,
		{
			code: `${header}test.serial.cb.only.serial(t => {});`,
			errors: [
				{
					message: 'Duplicate test modifier `.serial`.',
					type: 'Identifier',
					line: 2,
					column: 21
				}
			]
		}]
});
