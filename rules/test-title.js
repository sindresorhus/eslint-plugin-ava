'use strict';
const {visitIf} = require('enhance-visitors');
const createAvaRule = require('../create-ava-rule');
const util = require('../util');

const create = context => {
	const ava = createAvaRule();
	const ifMultiple = context.options[0] !== 'always';
	let testCount = 0;

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isTestNode,
			ava.hasNoHookModifier
		])(node => {
			testCount++;

			const requiredLength = ava.hasTestModifier('todo') ? 1 : 2;
			const hasNoTitle = node.arguments.length < requiredLength;
			const isOverThreshold = !ifMultiple || testCount > 1;

			if (hasNoTitle && isOverThreshold) {
				context.report({
					node,
					message: 'Test should have a title.'
				});
			}
		}),
		'Program:exit': () => {
			testCount = 0;
		}
	});
};

const schema = [{
	type: 'string',
	default: 'if-multiple',
	enum: [
		'always',
		'if-multiple'
	]
}];

module.exports = {
	create,
	meta: {
		type: 'suggestion',
		docs: {
			url: util.getDocsUrl(__filename)
		},
		schema
	}
};
