'use strict';
const {visitIf} = require('enhance-visitors');
const createAvaRule = require('../create-ava-rule');
const util = require('../util');
/**
 * @name TypedefData
 */
const TypedefData = Symbol('Data for the Mock Typedefs');
/**
 * @enum {number}
 */
const TypedefTypes = {
	HOOK: 1,
	TEST: 2,
	ANY: 3
};
/** @typedef typedef
 * @type {{
 * 	[TypedefData]: {
 * 		depth: number,
 * 		isTerminal?: boolean,
 * 		type: TypedefTypes,
 * 		time?: Map<number, number>
 * 	},
 *  [s: string]: typedef
 * }}
 */
/**
 * @type {Object<string, typedef>}
 */
const typedefs = (
	/**
	 * @returns {Object<string, typedef>}
	 */
	() => {
		const CbOnly = {
			[TypedefData]: {
				depth: 5,
				isTerminal: true,
				type: TypedefTypes.ANY
			}
		};
		const CbSkip = {
			[TypedefData]: {
				depth: 5,
				isTerminal: true,
				type: TypedefTypes.ANY
			}
		};
		const Only = {
			[TypedefData]: {
				depth: 3,
				isTerminal: true,
				type: TypedefTypes.TEST
			}
		};
		const Skip = {
			[TypedefData]: {
				depth: 3,
				isTerminal: true,
				type: TypedefTypes.ANY
			}
		};
		const Todo = {
			[TypedefData]: {
				depth: 2,
				isTerminal: true,
				type: TypedefTypes.TEST
			}
		};

		const Failing = {
			only: Only,
			skip: Skip,
			[TypedefData]: {
				depth: 2,
				type: TypedefTypes.TEST
			}
		};

		const CbFailing = {
			only: CbOnly,
			skip: CbSkip,
			[TypedefData]: {
				depth: 4,
				type: TypedefTypes.ANY
			}
		};

		const Cb = {
			...CbFailing,
			failing: CbFailing,
			[TypedefData]: {
				depth: 2,
				type: TypedefTypes.TEST
			}
		};

		const Serial = {
			...Failing,
			cb: Cb,
			failing: Failing,
			todo: Todo,
			[TypedefData]: {
				depth: 1,
				type: TypedefTypes.ANY
			}
		};

		const HookCb = {
			...CbFailing,
			failing: CbFailing,
			[TypedefData]: {
				depth: 3,
				type: TypedefTypes.HOOK
			}
		};

		const Always = {
			cb: HookCb,
			skip: Skip,
			[TypedefData]: {
				depth: 2,
				type: TypedefTypes.HOOK
			}
		};

		const After = {
			...Always,
			always: Always,
			[TypedefData]: {
				depth: 1,
				type: TypedefTypes.HOOK
			}
		};

		const Before = {
			...Always,
			[TypedefData]: {
				depth: 1,
				type: TypedefTypes.HOOK
			}
		};

		const Test = {
			...Serial,
			after: After,
			afterEach: After,
			before: Before,
			beforeEach: Before,
			serial: Serial,
			[TypedefData]: {
				depth: 0,
				// Test by default, but may become a hook with .after or .before
				type: TypedefTypes.ANY
			}
		};

		return {
			Test,
			After,
			Always,
			Before,
			Cb,
			CbFailing,
			CbOnly,
			CbSkip,
			Failing,
			HookCb,
			Only,
			Serial,
			Skip,
			Todo
		};
	})();
{ // Calculate In Time and Out Times of each node
	let timer = 0;
	/**
	 * @param {typedef} typedef
	 */
	(function iterate(typedef) {
		if (!typedef[TypedefData].time) {
			typedef[TypedefData].time = new Map();
		}

		const inTime = timer++;
		Object.values(typedef).forEach(value => iterate(value));

		const outTime = timer++;
		typedef[TypedefData].time.set(inTime, outTime);
	})(typedefs.Test);
}

/**
 * @param {typedef} typdefA
 * @param {typedef} typedefB
 */
function typedefsAreCompatible(typdefA, typedefB) {
	const dataA = typdefA[TypedefData];
	const dataB = typedefB[TypedefData];

	if (dataA.depth === dataB.depth) {
		return false;
	}

	if (dataA.isTerminal && dataB.isTerminal) {
		return false;
	}

	if ((dataA.type & dataB.type) === 0) {
		return false;
	}

	for (const [inA, outA] of dataA.time) {
		for (const [inB, outB] of dataB.time) {
			// For any given node, all of its children must have an in and out time value that is exclusively between its own in and out time
			if (inA > inB ? outA < outB : outA > outB) {
				return true;
			}
		}
	}

	return false;
}

/**
 * @type {Map<string, Set<typedef>>}
 */
const ModifierNames = new Map();

for (const typedef of Object.values(typedefs)) {
	for (const [name, type] of Object.entries(typedef)) {
		if (ModifierNames.has(name)) {
			ModifierNames.get(name).add(type);
		} else {
			ModifierNames.set(name, new Set().add(type));
		}
	}
}

/**
 * @param {string} name
 */
function inferTypedef(name) {
	/* eslint-ignore-next-line capitalized-comment */
	/* c8 ignore next 3 */
	if (!ModifierNames.has(name)) {
		throw new Error('No typedefs found');
	}

	return [...ModifierNames.get(name)];
}

/**
 * @typedef Tree
 * @type {{[x: string]: Tree}}
 */
/** Searches tree for the props using Breadth-first search
 * @param {Tree} object
 * @param {{name: string, typedef: Tree?}[]?} props
 */
function findProps(object, props) {
	/** @type {Set<string>} */
	const propNames = new Set();
	/** @type {Set<Tree>} */
	const propTypedefs = new Set();
	for (const {name, typedef} of props) {
		if (typedef) {
			propTypedefs.add(typedef);
		} else {
			propNames.add(name);
		}
	}

	const queue = [{
		/** @type {{name: string?, object: Tree}[]} */
		path: [{name: 'test', object}],
		remaining: propNames.size + propTypedefs.size
	}];
	while (queue.length > 0) {
		const data = queue.shift();

		for (const [key, value] of Object.entries(data.path[data.path.length - 1].object)) {
			const result = {
				path: data.path.concat({name: key, object: value}),
				remaining: data.remaining,
				object: value
			};
			if (propNames.has(key) || propTypedefs.has(value)) {
				result.remaining--;
			}

			if (result.remaining === 0) {
				return result;
			}

			queue.push(result);
		}
	}

	return null;
}

const create = context => {
	const ava = createAvaRule();

	return ava.merge({
		CallExpression: visitIf([
			ava.isInTestFile,
			ava.isTestNode
		])(node => {
			/** @type {Object<string, any>[]} */
			const modifiers = util.getTestModifiers(node);

			// Pass 1: Validate modifier names and check for duplicate names
			const usedNames = new Set();
			let allValidNames = true;
			for (const modifier of modifiers.values()) {
				if (!ModifierNames.has(modifier.name)) {
					allValidNames = false;
					context.report({
						node: modifier,
						messageId: 'unknown',
						data: {
							name: modifier.name
						}
					});
				} else if (usedNames.has(modifier.name)) {
					allValidNames = false;
					context.report({
						node: modifier,
						messageId: 'duplicate',
						data: {
							name: modifier.name
						}
					});
				} else {
					usedNames.add(modifier.name);
				}
			}

			if (!allValidNames) {
				return;
			}

			// Pass 2: Check that modifier names don't conflict with each other
			// Add modifiers that are inherited from its parent
			/** @type {{modifier: Object<string, any>?, typedef: typedef}[]} */
			const knownTypedefs = [{modifier: null, typedef: typedefs.Test}];
			for (const [i, modifier] of modifiers.entries()) {
				const parentTypedef = knownTypedefs[i].typedef;
				const typedef = parentTypedef[modifier.name];

				if (!typedef) {
					break;
				}

				knownTypedefs.push({
					modifier,
					typedef
				});
			}

			if (knownTypedefs.length - 1 === modifiers.length) {
				return;
			}

			// If modifier name can only refer to one typdef, add it to the chain
			const unknownModifiers = [];
			for (let i = knownTypedefs.length - 1; i < modifiers.length; i++) {
				const modifier = modifiers[i];
				const inferences = inferTypedef(modifier.name);

				if (inferences.length > 1) {
					for (let j = inferences.length; j--;) {
						const inference = inferences[j];
						// Skip checking compatibility with 'test' since it's always true
						for (let k = 1; k < knownTypedefs.length; k++) {
							const typedef = knownTypedefs[k];
							if (typedefsAreCompatible(inference, typedef.typedef)) {
								continue;
							}

							inferences.splice(j, 1);

							if (inferences.length === 0) {
								return context.report({
									node: modifier,
									messageId: 'conflict',
									data: {
										nameB: typedef.modifier.name
									}
								});
							}
						}
					}

					if (inferences.length > 1) {
						unknownModifiers.push(modifier.name);

						continue;
					}
				}

				const [typedef] = inferences;
				const indexB = findLastIndex(
					knownTypedefs,
					({typedef: tdef}) => tdef[TypedefData].depth <= typedef[TypedefData].depth
				) + 1;
				if (!typedefsAreCompatible(typedef, knownTypedefs[indexB - 1].typedef)) {
					return context.report({
						node: modifier,
						messageId: 'conflict',
						data: {
							nameB: knownTypedefs[indexB - 1].modifier.name
						}
					});
				}

				if (indexB < knownTypedefs.length && !typedefsAreCompatible(typedef, knownTypedefs[indexB].typedef)) {
					return context.report({
						node: modifier,
						messageId: 'conflict',
						data: {
							nameB: knownTypedefs[indexB].modifier.name
						}
					});
				}

				knownTypedefs.splice(indexB, 0, {modifier, typedef});
			}

			// Pass 3: Make sure all modifier are in a valid order
			/** @type {string[]} */
			let expectedOrder;
			if (unknownModifiers.length === 0) {
				expectedOrder = knownTypedefs.slice(1).map(t => t.modifier.name);
			} else {
				const props = knownTypedefs.slice(1).map(t => ({typedef: t.typedef, name: null}))
					.concat(unknownModifiers.map(name => ({typedef: null, name})));

				const match = findProps(typedefs.Test, props);
				//
				/* c8 ignore next 3 */
				if (!match) {
					throw new Error('Should never happen');
				}

				expectedOrder = match.path.map(item => item.name);
			}

			/** @type {Map<string, number>} */
			const incorrect = new Map();
			for (let i = 0; i < expectedOrder.length;) {
				const name = expectedOrder[i];

				if (name !== modifiers[i].name) {
					incorrect.set(name, i - incorrect.size);
				}

				i++;
			}

			for (let i = 0; i < modifiers.length && incorrect.size > 0; i++) {
				const modifier = modifiers[i];
				const {name} = modifier;

				if (incorrect.has(name)) {
					context.report({
						node: modifier,
						messageId: 'position',
						data: {
							name,
							position: incorrect.get(name)
						}
					});
					incorrect.delete(name);
				}
			}

			for (const [name, position] of incorrect) {
				context.report({
					node,
					messageId: 'missing',
					data: {
						name,
						position
					}
				});
			}
		})
	});
};

module.exports = {
	create,
	meta: {
		messages: {
			conflict: 'This modifier conflicts with another modifier `{{ nameB }}`',
			duplicate: 'This modifier already exists in the modifier chain `{{ name }}',
			missing: 'Expected Test Modifier `{{ name }}` at position {{ position }}',
			position: 'Test Modifier {{ name }} is in the wrong position',
			unknown: 'Unknown Test Modifier `{{ name }}`'
		},
		docs: {
			url: util.getDocsUrl(__filename)
		},
		type: 'problem'
	}
};

/**
 * @param {any[]} array
 * @param {(item: any, i: number, array: any[]) => boolean} cb
 */
/* c8 ignore next 9 */
function findLastIndex(array, cb) {
	for (let i = array.length; i--;) {
		if (cb(array[i], i, array)) {
			return i;
		}
	}

	return -1;
}
