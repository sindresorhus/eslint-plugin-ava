const test = require('ava');
const avaRuleTester = require('eslint-ava-rule-tester');
const rule = require('../rules/no-error-ctor-with-notthrows');

const ruleTester = avaRuleTester(test, {
	env: {
		es6: true
	},
	parserOptions: {
		ecmaVersion: 2019
	}
});

const errors = [{}];

const header = 'const test = require(\'ava\');\n';

ruleTester.run('no-error-ctor-with-notthrows', rule, {
	valid: [
		`${header}
		test('some test', t => {
			t.notThrows(() => {
				t.pass();
			});
		});`,

		`${header}
		test(t => {
			t.notThrows(() => {
				t.pass();
			});
		});`,

		`${header}
		test(t => {
			t.throws(() => {
				t.pass();
			}, TypeError);
		});`,

		`${header}
		test(t => { t.end(); })`,

		`${header}
		test('some test', t => {
			t.notThrows(() => {
				t.pass();
			}, true);
		});`,

		`${header}
		test('some test', t => {
			t.notThrows(() => {
				t.pass();
			}, 'some string');
		});`,

		`${header}
		test('some test', t => {
			t.notThrows(() => {
				t.pass();
			}, {firstName:'some', lastName: 'object'});
		});`,

		`${header}
		test('some test', t => {
			t.notThrowsAsync(() => {
				t.pass();
			});
		});`,

		`${header}
		test(t => {
			t.notThrowsAsync(() => {
				t.pass();
			});
		});`,

		`${header}
		test('some test', t => {
			t.notThrowsAsync(() => {
				t.pass();
			}, {firstName:'some', lastName: 'object'});
		});`,

		`${header}
		test('some test', t => {
			notThrows(foo);
		});`,

		`${header}
		test('some test', t => {
			myCustomNotThrows.notThrows(foo);
		});`,

		`${header}
		t.notThrows(() => {
			t.pass();
		}, void 0);`,

		// Shouldn't be triggered since it's not a test file
		`test('some test', t => {
			t.notThrowsAsync(() => {
				t.pass();
			}, TypeError);
		});`
	],
	invalid: [
		{
			code: `${header}
			test(t => {
				t.notThrows(() => {
					t.pass();
				}, TypeError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrows(() => {
					t.pass();
				}, TypeError);
			});`,
			errors
		},
		{
			code: `${header}
			test(t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, TypeError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, TypeError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, Error);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, SyntaxError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, AssertionError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, ReferenceError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, RangeError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, SystemError);
			});`,
			errors
		},
		{
			code: `${header}
			test('some test', t => {
				t.notThrowsAsync(() => {
					t.pass();
				}, $DOMError);
			});`,
			errors
		}
	]
});
