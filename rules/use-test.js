'use strict';
const path = require('path');
const espurify = require('espurify');
const deepStrictEqual = require('deep-strict-equal');
const util = require('../util');

const avaVariableDeclaratorInitAst = {
	type: 'CallExpression',
	callee: {
		type: 'Identifier',
		name: 'require'
	},
	arguments: [
		{
			type: 'Literal',
			value: 'ava'
		}
	]
};

function report(context, node) {
	context.report({
		node,
		message: 'AVA should be imported as `test`.'
	});
}

const create = context => {
	const ext = path.extname(context.getFilename());
	const isTypeScript = ext === '.ts' || ext === '.tsx';

	return {
		ImportDeclaration: node => {
			const firstSpecifier = node.specifiers[0];
			if (
				firstSpecifier &&
				firstSpecifier.type === 'ImportDefaultSpecifier' &&
				node.source.value === 'ava'
			) {
				const {name} = firstSpecifier.local;
				if (name !== 'test' && (!isTypeScript || name !== 'anyTest')) {
					report(context, node);
				}
			}
		},
		VariableDeclarator: node => {
			if (
				node.id.type === 'Identifier' &&
				node.init &&
				deepStrictEqual(espurify(node.init), avaVariableDeclaratorInitAst)
			) {
				const {name} = node.id;
				if (name !== 'test' && (!isTypeScript || name !== 'anyTest')) {
					report(context, node);
				}
			}
		}
	};
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
