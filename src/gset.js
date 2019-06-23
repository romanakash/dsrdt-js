import { Set } from 'immutable';

const GSet = () => {
	let s = Set();

	const initial = () => Set();

	const state = () => s;

	const insert = elem => {
		s = s.add(elem);
		return Set([elem]);
	};

	const elements = () => s;

	const join = (s1, s2) => s1.union(s2);

	const apply = delta => (s = join(s, delta));

	GSet.initial = initial;
	GSet.join = join;

	return Object.freeze({ state, insert, elements, apply });
};

export default GSet;
