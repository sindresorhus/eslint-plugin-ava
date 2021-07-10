const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-identical-title');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const message = 'Test title is used multiple times in the same file.';

const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-identical-title', rule, {
	valid: [
		header + 'test("my test name", t => {});',
		header + 'test("a", t => {}); test("b", t => {});',
		header + 'test.todo("a"); test.todo("b");',
		header + 'test("a", t => {}); notTest("a", t => {});',
		// eslint-disable-next-line no-template-curly-in-string
		header + 'test(`foo ${name}`, t => {}); test(`foo ${name}`,  t => {});',
		header + 'const name = "foo"; test(name + " 1", t => {}); test(name + " 1", t => {});',
		header + 'test("a", t => {}); notTest("a", t => {});',
		header + 'notTest("a", t => {}); notTest("a", t => {});',
		header + 'test.before(t => {}); test.before(t => {});',
		header + 'test.after(t => {}); test.after(t => {});',
		header + 'test.beforeEach(t => {}); test.beforeEach(t => {});',
		header + 'test.afterEach(t => {}); test.afterEach(t => {});',
		// Macros
		` ${header}
			const macro = (t, value) => { t.true(value); };

			test(macro, true);
			test('should work', macro, true);
			test('should fail', macro, false);
		`,
		` ${header}
			const macro = (t, value) => { t.true(value); };

			test('same title', macro, true);
			test('same title', macro, false);
		`,
		// Shouldn't be triggered since it's not a test file
		'test(t => {}); test(t => {});',
		'test("a", t => {}); test("a", t => {});'
	],
	invalid: [
		{
			code: header + 'test("a", t => {}); test("a", t => {});',
			errors: [{
				message,
				type: 'Literal',
				line: 2,
				column: 26
			}]
		},
		{
			code: header + 'test(`a`, t => {}); test(`a`, t => {});',
			errors: [{
				message,
				type: 'TemplateLiteral',
				line: 2,
				column: 26
			}]
		},
		{
			code: header + 'test("foo" + 1, t => {}); test("foo" + 1, t => {});',
			errors: [{
				message,
				type: 'BinaryExpression',
				line: 2,
				column: 32
			}]
		},
		{
			// eslint-disable-next-line no-template-curly-in-string
			code: header + 'test(`${"foo" + 1}`, t => {}); test(`${"foo" + 1}`, t => {});',
			errors: [{
				message,
				type: 'TemplateLiteral',
				line: 2,
				column: 37
			}]
		},
		{
			code: header + 'test.todo("a"); test.todo("a");',
			errors: [{
				message,
				type: 'Literal',
				line: 2,
				column: 27
			}]
		}
	]
});
