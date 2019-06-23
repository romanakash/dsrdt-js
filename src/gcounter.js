import { Map } from 'immutable';

const GCounter = (initId = new Date().toISOString()) => {
	const id = initId;
	let m = Map({ [id]: 0 });

	const initial = () => Map({});

	const state = () => m;

	const inc = () => {
		const delta = Map({ [id]: m.get(id) + 1 });
		m = m.merge(delta);
		return delta;
	};

	const value = () => m.reduce((reducer, val) => reducer + val);

	const join = (s1, s2) =>
		s1.mergeWith((mVal, deltaVal) => Math.max(mVal, deltaVal), s2);

	const apply = delta => (m = join(m, delta));

	GCounter.initial = initial;
	GCounter.join = join;

	return Object.freeze({ state, inc, value, apply });
};

export default GCounter;
