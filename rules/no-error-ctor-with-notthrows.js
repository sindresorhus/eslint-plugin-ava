'use strict';
const {visitIf} = require('enhance-visitors');
const util = require('../util');
const createAvaRule = require('../create-ava-rule');

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isInTestNode
		])(node => {
			const functionArgIndex = node.arguments.length - 1;

			if (typeof node.callee.property === 'undefined' || functionArgIndex !== 1 || node.callee.type !== 'MemberExpression' || node.arguments[1].type !== 'Identifier' || util.getNameOfRootNodeObject(node.callee) !== 't') {
				return;
			}

			const calleeProperty = node.callee.property.name;
			const functionArgName = node.arguments[1].name;
			if ((calleeProperty === 'notThrows' || calleeProperty === 'notThrowsAsync') && functionArgName.endsWith('Error')) {
				context.report({
					node,
					message: `Do not specify an error constructor in the second argument of \`t.${calleeProperty}()\``
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
