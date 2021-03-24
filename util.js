'use strict';
const path = require('path');
const pkgDir = require('pkg-dir');
const resolveFrom = require('resolve-from');
const pkg = require('./package');

exports.loadAvaHelper = (filename, overrides) => {
	const rootDir = pkgDir.sync(filename);
	if (!rootDir) {
		return undefined;
	}

	const avaHelperPath = resolveFrom.silent(rootDir, 'ava/eslint-plugin-helper');
	if (!avaHelperPath) {
		return undefined;
	}

	const avaHelper = require(avaHelperPath);
	return avaHelper.load(rootDir, overrides);
};

const functionExpressions = new Set([
	'FunctionExpression',
	'ArrowFunctionExpression'
]);

exports.getRootNode = node => {
	if (node.object.type === 'MemberExpression') {
		return exports.getRootNode(node.object);
	}

	return node;
};

exports.getNameOfRootNodeObject = node => {
	return exports.getRootNode(node).object.name;
};

exports.isPropertyUnderContext = node => {
	return exports.getRootNode(node).property.name === 'context';
};

exports.isFunctionExpression = node => node && functionExpressions.has(node.type);

function getTestModifiers(node) {
	if (node.type === 'CallExpression') {
		return getTestModifiers(node.callee);
	}

	if (node.type === 'MemberExpression') {
		return getTestModifiers(node.object).concat(node.property);
	}

	return [];
}

exports.getTestModifiers = getTestModifiers;

exports.getTestModifier = (node, mod) => {
	return getTestModifiers(node).find(property => property.name === mod);
};

exports.removeTestModifier = parameters => {
	const modifier = parameters.modifier.trim();
	const range = exports.getTestModifier(parameters.node, modifier).range.slice();
	const replacementRegExp = new RegExp(`\\.|${modifier}`, 'g');
	const source = parameters.context.getSourceCode().getText();
	let dotPosition = range[0] - 1;
	while (source.charAt(dotPosition) !== '.') {
		dotPosition -= 1;
	}

	let snippet = source.slice(dotPosition, range[1]);
	snippet = snippet.replace(replacementRegExp, '');
	return [[dotPosition, range[1]], snippet];
};

const getMembers = node => {
	const {name} = node.property;

	if (node.object.type === 'MemberExpression') {
		return getMembers(node.object).concat(name);
	}

	return [name];
};

exports.getMembers = getMembers;

const repoUrl = 'https://github.com/avajs/eslint-plugin-ava';

const getDocsUrl = (filename, commitHash) => {
	const ruleName = path.basename(filename, '.js');
	commitHash = commitHash || `v${pkg.version}`;
	return `${repoUrl}/blob/${commitHash}/docs/rules/${ruleName}.md`;
};

exports.getDocsUrl = getDocsUrl;

const assertionMethodsNumberArguments = new Map([
	['assert', 1],
	['deepEqual', 2],
	['fail', 0],
	['false', 1],
	['falsy', 1],
	['ifError', 1],
	['is', 2],
	['like', 2],
	['not', 2],
	['notDeepEqual', 2],
	['notRegex', 2],
	['notThrows', 1],
	['notThrowsAsync', 1],
	['pass', 0],
	['regex', 2],
	['snapshot', 1],
	['throws', 1],
	['throwsAsync', 1],
	['true', 1],
	['truthy', 1],
	['try', 1]
]);

const assertionMethodNames = [...assertionMethodsNumberArguments.keys()];

exports.assertionMethodsNumArguments = assertionMethodsNumberArguments;
exports.assertionMethods = new Set(assertionMethodNames);
exports.executionMethods = new Set(assertionMethodNames.concat(['end', 'plan', 'log', 'teardown', 'timeout']));

exports.testModifierNames = new Set([
	'after',
	'afterEach',
	'always',
	'before',
	'beforeEach',
	'cb',
	'only',
	'serial',
	'skip',
	'todo',
	'failing'
]);
