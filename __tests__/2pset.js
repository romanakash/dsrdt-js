import { Set } from 'immutable';
import TwoPSet from '../src/2pset';

describe('TwoPSet', () => {
	describe('Local', () => {
		describe('Check initialisation', () => {
			const pset = TwoPSet();

			test('object methods', () => {
				expect(pset).toEqual({
					state: expect.any(Function),
					insert: expect.any(Function),
					remove: expect.any(Function),
					elements: expect.any(Function),
					apply: expect.any(Function)
				});
			});

			test('initial state', () => {
				expect(pset.elements()).toEqual(Set());
			});

			test('initial elements', () => {
				expect(pset.elements()).toEqual(Set());
			});
		});

		describe('Check static methods', () => {
			test('initial', () => {
				expect(TwoPSet.initial()).toEqual([Set(), Set()]);
			});

			test('join', () => {
				expect(
					TwoPSet.join(
						[Set(['a', 'b']), Set()],
						[Set('c'), Set(['b'])]
					)
				).toEqual([Set(['a', 'b', 'c']), Set(['b'])]);
			});
		});

		describe('Can insert elements', () => {
			const pset = TwoPSet();

			test('return delta', () => {
				expect(pset.insert(1)).toEqual([Set([1]), Set()]);
			});

			test('internal elements', () => {
				pset.insert(2);
				expect(pset.elements()).toEqual(Set([1, 2]));
			});
		});

		describe('Can remove elements', () => {
			const pset = TwoPSet();

			test('return delta', () => {
				expect(pset.remove(1)).toEqual([Set(), Set([1])]);
			});

			test('internal state', () => {
				pset.remove(2);
				expect(pset.state()).toEqual([Set(), Set([1, 2])]);
			});
		});
	});

	describe('Convergence', () => {
		const pset1 = TwoPSet();
		const pset2 = TwoPSet();

		const deltas1 = [];
		const deltas2 = [];

		test('Can insert', () => {
			['a', 'b', 'z'].forEach(elem => deltas1.push(pset1.insert(elem)));
			['c', 'd', 'x'].forEach(elem => deltas2.push(pset2.insert(elem)));

			expect(pset1.elements()).toEqual(Set(['a', 'b', 'z']));
			expect(pset2.elements()).toEqual(Set(['c', 'd', 'x']));
		});

		test('Can remove', () => {
			deltas1.push(pset1.remove('z'));
			deltas2.push(pset2.remove('x'));

			expect(pset1.elements()).toEqual(Set(['a', 'b']));
			expect(pset2.elements()).toEqual(Set(['c', 'd']));
		});

		test('Can join', () => {
			expect(TwoPSet.join(pset1.state(), pset2.state())).toEqual([
				Set(['a', 'b', 'z', 'c', 'd', 'x']),
				Set(['z', 'x'])
			]);
		});

		test('Converges to one', () => {
			const deltaGroup1 = deltas1.reduce(TwoPSet.join);
			const deltaGroup2 = deltas2.reduce(TwoPSet.join);

			pset1.apply(deltaGroup2);
			expect(pset1.elements()).toEqual(Set(['a', 'b', 'c', 'd']));

			pset2.apply(deltaGroup1);
			expect(pset2.elements()).toEqual(Set(['a', 'b', 'c', 'd']));
		});
	});
});
