'use strict';
const {visitIf} = require('enhance-visitors');
const createAvaRule = require('../create-ava-rule');
const util = require('../util');

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isTestNode,
			ava.hasNoUtilityModifier
		])(node => {
			const firstArgumentIsFunction = node.arguments.length === 0 || util.isFunctionExpression(node.arguments[0]);

			if (firstArgumentIsFunction) {
				context.report({
					node,
					message: 'Test should have a title.'
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
