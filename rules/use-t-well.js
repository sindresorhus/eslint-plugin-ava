'use strict';
const visitIf = require('enhance-visitors').visitIf;
const util = require('../util');
const createAvaRule = require('../create-ava-rule');

const methods = util.assertionMethods.concat(['end', 'plan']);

const isMethod = name => methods.indexOf(name) !== -1;

const isCallExpression = node =>
	node.parent.type === 'CallExpression' &&
	node.parent.callee === node;

const getMemberStats = members => {
	const initial = {
		skip: [],
		method: [],
		other: []
	};

	return members.reduce((res, member) => {
		if (member === 'skip') {
			res.skip.push(member);
		} else if (isMethod(member)) {
			res.method.push(member);
		} else {
			res.other.push(member);
		}

		return res;
	}, initial);
};

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isInTestNode
		])(node => {
			if (node.callee.type !== 'MemberExpression' &&
					node.callee.name === 't') {
				context.report({
					node,
					message: '`t` is not a function.'
				});
			}
		}),
		MemberExpression: visitIf([
			ava.isInTestFile,
			ava.isInTestNode
		])(node => {
			if (node.parent.type === 'MemberExpression' ||
					util.nameOfRootObject(node) !== 't') {
				return;
			}

			const members = util.getMembers(node);
			const stats = getMemberStats(members);

			if (members[0] === 'context') {
				// anything is fine when of the form `t.context...`
				if (members.length === 1 && isCallExpression(node)) {
					// except `t.context()`
					context.report({
						node,
						message: 'Unknown assertion method `context`.'
					});
				}

				return;
			}

			if (isCallExpression(node)) {
				if (stats.other.length > 0) {
					context.report({
						node,
						message: `Unknown assertion method \`${stats.other[0]}\`.`
					});
				} else if (stats.skip.length > 1) {
					context.report({
						node,
						message: 'Too many chained uses of `skip`.'
					});
				} else if (stats.method.length > 1) {
					context.report({
						node,
						message: 'Can\'t chain assertion methods.'
					});
				} else if (stats.method.length === 0) {
					context.report({
						node,
						message: 'Missing assertion method.'
					});
				}
			} else if (stats.other.length > 0) {
				context.report({
					node,
					message: `Unknown member \`${stats.other[0]}\`. Use \`context.${stats.other[0]}\` instead.`
				});
			}
		})
	});
};

module.exports = {
	create,
	meta: {}
};
