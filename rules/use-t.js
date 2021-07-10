'use strict';
const {visitIf} = require('enhance-visitors');
const createAvaRule = require('../create-ava-rule');
const util = require('../util');

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isTestNode
		])(node => {
			const index = node.arguments.length - 1;
			if (index > 1) {
				return;
			}

			let implementationArg = node.arguments[index];
			if (ava.hasTestModifier('macro') && implementationArg.type === 'ObjectExpression') {
				const execProperty = implementationArg.properties.find(p => {
					return p.key.name === 'exec';
				});
				implementationArg = execProperty && execProperty.value;
			}

			if (!implementationArg || !implementationArg.params || implementationArg.params.length === 0) {
				return;
			}

			if (implementationArg.params[0].name !== 't') {
				context.report({
					node,
					message: 'Test parameter should be named `t`.'
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
		type: 'suggestion'
	}
};
