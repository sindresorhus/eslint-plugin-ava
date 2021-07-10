'use strict';
const {visitIf} = require('enhance-visitors');
const util = require('../util');
const createAvaRule = require('../create-ava-rule');

const modifiers = new Set([
	'after',
	'afterEach',
	'always',
	'before',
	'beforeEach',
	'only',
	'serial',
	'skip',
	'todo',
	'failing',
	'macro'
]);

const unknownModifiers = node => util.getTestModifiers(node)
	.filter(modifier => !modifiers.has(modifier.name));

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isTestNode
		])(node => {
			const unknown = unknownModifiers(node);

			if (unknown.length > 0) {
				context.report({
					node: unknown[0],
					message: `Unknown test modifier \`.${unknown[0].name}\`.`
				});
			}
		})
	});
};

module.exports = {
	create,
	meta: {
		docs: {
			url: util.getDocsUrl(__filename)
		},
		type: 'problem'
	}
};
