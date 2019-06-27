import { Map } from 'immutable';

const PNCounter = (initId = new Date().toISOString()) => {
	const id = initId;
	let counter = [Map({ [id]: 0 }), Map({ [id]: 0 })];

	const initial = () => [Map(), Map()];

	const state = () => counter;

	const inc = () => {
		const delta = [Map({ [id]: counter[0].get(id) + 1 }), Map()];
		counter = join(counter, delta);
		return delta;
	};

	const dec = () => {
		const delta = [Map(), Map({ [id]: counter[1].get(id) + 1 })];
		counter = join(counter, delta);
		return delta;
	};

	const value = () =>
		counter[0].reduce((accum, val) => accum + val) -
		counter[1].reduce((accum, val) => accum + val);

	const join = (s1, s2) => [
		s1[0].mergeWith((s1Val, s2Val) => Math.max(s1Val, s2Val), s2[0]),
		s1[1].mergeWith((s1Val, s2Val) => Math.max(s1Val, s2Val), s2[1])
	];

	const apply = delta => (counter = join(counter, delta));

	PNCounter.initial = initial;
	PNCounter.join = join;

	return Object.freeze({ state, inc, dec, value, apply });
};

export default PNCounter;
