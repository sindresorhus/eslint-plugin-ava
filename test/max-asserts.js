const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/max-asserts');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	}
});

const errors = [{}];
const header = 'const test = require(\'ava\');\n';

function nbAssertions(n) {
	return Array.from({length: n}).map(() => 't.is(1, 1);').join('\n');
}

ruleTester.run('max-asserts', rule, {
	valid: [
		`${header} test(t => { ${nbAssertions(3)} });`,
		`${header}
			test(t => { ${nbAssertions(3)} });
			test(t => { ${nbAssertions(3)} });
		`,
		`${header} test(t => { t.plan(5); ${nbAssertions(5)} });`,
		`${header} test(t => { t.is.skip(1, 1); ${nbAssertions(4)} });`,
		{
			code: `${header} test(t => { ${nbAssertions(3)} });`,
			options: [3]
		},
		{
			code: `${header} test(t => { notT.is(1, 1); notT.is(1, 1); notT.is(1, 1); });`,
			options: [2]
		},
		`${header} test(t => { t.context.bar(); ${nbAssertions(5)} });`,
		`${header} test(t => { ${'t.context.is(1, 1); '.repeat(6)}});`,
		`${header} test(t => { ${'foo.t.is(1, 1); '.repeat(6)}});`,
		// Shouldn't be triggered since it's not a test file
		`test(t => { ${nbAssertions(10)} });`
	],
	invalid: [
		{
			code: `${header} test(t => { ${nbAssertions(6)} });`,
			errors
		},
		{
			code: `${header}
				test(t => { ${nbAssertions(3)} });
				test(t => { ${nbAssertions(6)} });
			`,
			errors
		},
		{
			code: `${header} test(t => { t.plan(5); ${nbAssertions(6)} });`,
			errors
		},
		{
			code: `${header} test(t => { t.skip.is(1, 1); ${nbAssertions(5)} });`,
			errors
		},
		{
			code: `${header} test(t => { ${nbAssertions(4)} });`,
			options: [3],
			errors
		},
		{
			code: `${header} test(t => { ${nbAssertions(10)} });`,
			errors
		},
		{
			code: `${header} test(t => { ${nbAssertions(10)} }); test(t => { ${nbAssertions(10)} });`,
			errors: [...errors, ...errors] // Should have two errors, one per test
		}
	]
});
