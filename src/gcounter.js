import { Map } from 'immutable';

const GCounter = (initId = new Date().toISOString()) => {
	const id = initId;
	let counter = Map({ [id]: 0 });

	const initial = () => Map();

	const state = () => counter;

	const inc = () => {
		const delta = Map({ [id]: counter.get(id) + 1 });
		counter = join(counter, delta);
		return delta;
	};

	const value = () => counter.reduce((reducer, val) => reducer + val);

	const join = (s1, s2) =>
		s1.mergeWith((mVal, deltaVal) => Math.max(mVal, deltaVal), s2);

	const apply = delta => (counter = join(counter, delta));

	GCounter.initial = initial;
	GCounter.join = join;

	return Object.freeze({ state, inc, value, apply });
};

export default GCounter;
