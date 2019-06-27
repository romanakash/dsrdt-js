import { Map } from 'immutable';

const LexCounter = (initId = new Date().toISOString()) => {
	const id = initId;
	let counter = Map({ [id]: [0, 0] });

	const initial = () => Map();

	const state = () => counter;

	const inc = () => {
		const lex = counter.get(id);
		const delta = Map({ [id]: [lex[0], lex[1] + 1] });
		counter = join(counter, delta);
		return delta;
	};

	const dec = () => {
		const lex = counter.get(id);
		const delta = Map({ [id]: [lex[0] + 1, lex[1] - 1] });
		counter = join(counter, delta);
		return delta;
	};

	const value = () =>
		counter.valueSeq().reduce((accum, lex) => {
			return accum + lex[1];
		}, 0);

	const join = (s1, s2) =>
		s1.mergeWith((s1Lex, s2Lex) => {
			if (s1Lex[0] == s2Lex[0]) {
				return [s1Lex[0], Math.max(s1Lex[1], s2Lex[1])];
			}
			// dec wins over inc
			else if (s1Lex[0] < s2Lex[0]) {
				return s2Lex;
			} else {
				return s1Lex;
			}
		}, s2);

	const apply = delta => (counter = join(counter, delta));

	LexCounter.initial = initial;
	LexCounter.join = join;

	return Object.freeze({ state, inc, dec, value, apply });
};

export default LexCounter;
