import { Set } from 'immutable';

const TwoPSet = () => {
	let pset = [Set(), Set()];

	const initial = () => [Set(), Set()];

	const state = () => pset;

	const insert = elem => {
		const addSet = pset[0].add(elem);
		pset[0] = addSet;
		return [addSet, Set()];
	};

	const remove = elem => {
		const removeSet = pset[1].add(elem);
		pset[1] = removeSet;
		return [Set(), removeSet];
	};

	const elements = () => pset[0].subtract(pset[1]);

	const join = (s1, s2) => {
		const [addSet1, removeSet1] = s1;
		const [addSet2, removeSet2] = s2;
		return [addSet1.union(addSet2), removeSet1.union(removeSet2)];
	};

	const apply = delta => (pset = join(pset, delta));

	TwoPSet.initial = initial;
	TwoPSet.join = join;

	return Object.freeze({
		state,
		insert,
		remove,
		elements,
		apply
	});
};

export default TwoPSet;
