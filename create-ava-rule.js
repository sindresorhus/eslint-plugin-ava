'use strict';
const espurify = require('espurify');
const enhance = require('enhance-visitors');
const deepStrictEqual = require('deep-strict-equal');
const util = require('./util');

const avaImportDeclarationAsts = [{
	type: 'ImportDeclaration',
	specifiers: [
		{
			type: 'ImportDefaultSpecifier',
			local: {
				type: 'Identifier',
				name: 'test'
			}
		}
	],
	source: {
		type: 'Literal',
		value: 'ava'
	}
}, {
	type: 'ImportDeclaration',
	specifiers: [
		{
			type: 'ImportSpecifier',
			imported: {
				type: 'Identifier',
				name: 'serial'
			},
			local: {
				type: 'Identifier',
				name: 'test'
			}
		}
	],
	source: {
		type: 'Literal',
		value: 'ava'
	}
}, {
	type: 'ImportDeclaration',
	specifiers: [
		{
			type: 'ImportSpecifier',
			imported: {
				type: 'Identifier',
				name: 'serial'
			},
			local: {
				type: 'Identifier',
				name: 'test'
			}
		}
	],
	source: {
		type: 'Literal',
		value: 'ava'
	}
}, {
	type: 'ImportDeclaration',
	specifiers: [
		{
			type: 'ImportSpecifier',
			imported: {
				type: 'Identifier',
				name: 'serial'
			},
			local: {
				type: 'Identifier',
				name: 'serial'
			}
		}
	],
	source: {
		type: 'Literal',
		value: 'ava'
	}
}];

const avaVariableDeclaratorAsts = [{
	type: 'VariableDeclarator',
	id: {
		type: 'Identifier',
		name: 'test'
	},
	init: {
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
	}
}, {
	type: 'VariableDeclarator',
	id: {
		type: 'ObjectPattern',
		properties: [{
			type: 'Property',
			key: {
				type: 'Identifier',
				name: 'serial'
			},
			value: {
				type: 'Identifier',
				name: 'serial'
			},
			kind: 'init',
			method: false,
			shorthand: true,
			computed: false
		}]
	},
	init: {
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
	}
}, {
	type: 'VariableDeclarator',
	id: {
		type: 'ObjectPattern',
		properties: [{
			type: 'Property',
			key: {
				type: 'Identifier',
				name: 'serial'
			},
			value: {
				type: 'Identifier',
				name: 'test'
			},
			kind: 'init',
			method: false,
			shorthand: false,
			computed: false
		}]
	},
	init: {
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
	}
}];

function isTestFunctionCall(node) {
	if (node.type === 'Identifier') {
		return node.name === 'test';
	}

	if (node.type === 'MemberExpression') {
		return isTestFunctionCall(node.object);
	}

	return false;
}

function getTestModifierNames(node) {
	return util.getTestModifiers(node).map(property => property.name);
}

module.exports = () => { // eslint-disable-line eslint-plugin/prefer-object-rule
	let isTestFile = false;
	let currentTestNode;

	/* eslint quote-props: [2, "as-needed"] */
	const predefinedRules = {
		ImportDeclaration: node => {
			if (!isTestFile && avaImportDeclarationAsts.some(ast => deepStrictEqual(espurify(node), ast))) {
				isTestFile = true;
			}
		},
		VariableDeclarator: node => {
			if (!isTestFile && avaVariableDeclaratorAsts.some(ast => deepStrictEqual(espurify(node), ast))) {
				isTestFile = true;
			}
		},
		CallExpression: node => {
			if (isTestFunctionCall(node.callee)) {
				// Entering test function
				currentTestNode = node;
			}
		},
		'CallExpression:exit': node => {
			if (currentTestNode === node) {
				// Leaving test function
				currentTestNode = undefined;
			}
		},
		'Program:exit': () => {
			isTestFile = false;
		}
	};

	return {
		hasTestModifier: mod => getTestModifierNames(currentTestNode).includes(mod),
		hasNoUtilityModifier: () => {
			const modifiers = getTestModifierNames(currentTestNode);
			return !modifiers.includes('before') &&
				!modifiers.includes('beforeEach') &&
				!modifiers.includes('after') &&
				!modifiers.includes('afterEach') &&
				!modifiers.includes('macro');
		},
		isInTestFile: () => isTestFile,
		isInTestNode: () => currentTestNode,
		isTestNode: node => currentTestNode === node,
		merge: customHandlers => enhance.mergeVisitors([predefinedRules, customHandlers])
	};
};
