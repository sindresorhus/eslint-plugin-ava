const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/use-test');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		sourceType: 'module'
	}
});

const errors = [{}];

ruleTester.run('use-test', rule, {
	valid: [
		{code: 'var test = require(\'ava\');', filename: 'file.js'},
		{code: 'let test = require(\'ava\');', filename: 'file.js'},
		{code: 'const test = require(\'ava\');', filename: 'file.js'},
		{code: 'const a = 1, test = require(\'ava\'), b = 2;', filename: 'file.js'},
		{code: 'const test = require(\'foo\');', filename: 'file.js'},
		{code: 'const {} = require(\'ava\');', filename: 'file.js'},
		{code: 'import test from \'ava\';', filename: 'file.js'},
		{code: 'import test, {} from \'ava\';', filename: 'file.js'},
		{code: 'import test from \'foo\';', filename: 'file.js'},
		{code: 'import {TestInterface} from \'ava\';', filename: 'file.js'},
		{code: 'import \'ava\';', filename: 'file.js'},
		{code: 'var anyTest = require(\'ava\');', filename: 'file.ts'},
		{code: 'let anyTest = require(\'ava\');', filename: 'file.ts'},
		{code: 'const anyTest = require(\'ava\');', filename: 'file.ts'},
		{code: 'const a = 1, anyTest = require(\'ava\'), b = 2;', filename: 'file.ts'},
		{code: 'const anyTest = require(\'foo\');', filename: 'file.ts'},
		{code: 'const {} = require(\'ava\');', filename: 'file.ts'},
		{code: 'import anyTest from \'ava\';', filename: 'file.ts'},
		{code: 'import anyTest, {} from \'ava\';', filename: 'file.ts'},
		{code: 'import anyTest from \'foo\';', filename: 'file.ts'},
		{code: 'import {TestInterface} from \'ava\';', filename: 'file.ts'},
		{code: 'import \'ava\';', filename: 'file.ts'},
		{code: 'var anyTest = require(\'ava\');', filename: 'file.tsx'},
		{code: 'let anyTest = require(\'ava\');', filename: 'file.tsx'},
		{code: 'const anyTest = require(\'ava\');', filename: 'file.tsx'},
		{code: 'const a = 1, anyTest = require(\'ava\'), b = 2;', filename: 'file.tsx'},
		{code: 'const anyTest = require(\'foo\');', filename: 'file.tsx'},
		{code: 'const {} = require(\'ava\');', filename: 'file.tsx'},
		{code: 'import anyTest from \'ava\';', filename: 'file.tsx'},
		{code: 'import anyTest, {} from \'ava\';', filename: 'file.tsx'},
		{code: 'import anyTest from \'foo\';', filename: 'file.tsx'},
		{code: 'import {TestInterface} from \'ava\';', filename: 'file.tsx'},
		{code: 'import \'ava\';', filename: 'file.tsx'}
	],
	invalid: [
		{
			code: 'var ava = require(\'ava\');',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'let ava = require(\'ava\');',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'const ava = require(\'ava\');',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'const a = 1, ava = require(\'ava\'), b = 2;',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'import ava from \'ava\';',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'var anyTest = require(\'ava\');',
			errors,
			filename: 'file.js'
		},
		{
			code: 'var ava = require(\'ava\');',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'let ava = require(\'ava\');',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'const ava = require(\'ava\');',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'const a = 1, ava = require(\'ava\'), b = 2;',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'import ava from \'ava\';',
			errors,
			filename: 'file.ts'
		},
		{
			code: 'var ava = require(\'ava\');',
			errors,
			filename: 'file.tsx'
		},
		{
			code: 'let ava = require(\'ava\');',
			errors,
			filename: 'file.tsx'
		},
		{
			code: 'const ava = require(\'ava\');',
			errors,
			filename: 'file.tsx'
		},
		{
			code: 'const a = 1, ava = require(\'ava\'), b = 2;',
			errors,
			filename: 'file.tsx'
		},
		{
			code: 'import ava from \'ava\';',
			errors,
			filename: 'file.tsx'
		}
	]
});
