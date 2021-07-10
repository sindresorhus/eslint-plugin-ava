const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/prefer-power-assert');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module'
	}
});

const errors = [{}];

function testNotAllowedMethod(methodName) {
	ruleTester.run('prefer-power-assert', rule, {
		valid: [],
		invalid: [
			{
				code: `import test from 'ava';\n test(t => { t.${methodName}; });`,
				errors
			},
			{
				code: `import test from 'ava';\n test(t => { t.skip.${methodName}; });`,
				errors
			}
		]
	});
}

const notAllowedMethods = [
	'truthy(foo)',
	'falsy(foo)',
	'true(foo)',
	'false(foo)',
	'is(foo, bar)',
	'not(foo, bar)',
	'regex(str, re)',
	'notRegex(str, re)',
	'ifError(err)'
];

for (const methodName of notAllowedMethods) {
	testNotAllowedMethod(methodName);
}

function testAllowedMethod(methodName) {
	ruleTester.run('prefer-power-assert', rule, {
		valid: [
			{
				code: `import test from 'ava';\n test(t => { t.${methodName}; });`
			},
			{
				code: `import test from 'ava';\n test(t => { t.skip.${methodName}; });`
			}
		],
		invalid: []
	});
}

const allowedMethods = [
	'assert(foo)',
	'deepEqual(foo, bar)',
	'notDeepEqual(foo, bar)',
	'like(foo, bar)',
	'throws(block)',
	'notThrows(block)',
	'pass(foo)',
	'fail(foo)'
];

for (const methodName of allowedMethods) {
	testAllowedMethod(methodName);
}

function testWithModifier(modifier) {
	ruleTester.run('prefer-power-assert', rule, {
		valid: [
			{
				code: `import test from 'ava';\n test.${modifier}(t => { t.assert(foo); });`
			}
		],
		invalid: [
			{
				code: `import test from 'ava';\n test.${modifier}(t => { t.is(foo); });`,
				errors
			}
		]
	});
}

for (const modifiers of ['skip', 'only', 'serial']) {
	testWithModifier(modifiers);
}

function testDeclaration(declaration) {
	ruleTester.run('prefer-power-assert', rule, {
		valid: [
			{
				code: `${declaration}\n test(t => { t.assert(foo); });`
			}
		],
		invalid: [
			{
				code: `${declaration}\n test(t => { t.is(foo); });`,
				errors
			}
		]
	});
}

for (const declaration of [
	'var test = require(\'ava\');',
	'let test = require(\'ava\');',
	'const test = require(\'ava\');',
	'import test from \'ava\';'
]) {
	testDeclaration(declaration);
}

const assertionInNestedCode = `
import test from 'ava';

test(t => {
	const foo = () => {
		t.is('foo', 'bar');
	};
	foo();
});
`;

ruleTester.run('prefer-power-assert', rule, {
	valid: [
		{
			code: 'import test from \'ava\';\n test(function (t) { t.assert(foo); });'
		},
		// Shouldn't be triggered since it's not a test file
		{
			code: 'test(t => {});'
		}
	],
	invalid: [
		{
			code: assertionInNestedCode,
			errors
		}
	]
});
