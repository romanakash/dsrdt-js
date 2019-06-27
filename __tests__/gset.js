import { Set } from 'immutable';
import GSet from '../src/gset';

describe('GSet', () => {
	describe('Local', () => {
		describe('Check initialisation', () => {
			const gset = GSet();

			test('object methods', () => {
				expect(gset).toEqual({
					state: expect.any(Function),
					insert: expect.any(Function),
					elements: expect.any(Function),
					apply: expect.any(Function)
				});
			});

			test('initial state', () => {
				expect(gset.state()).toEqual(Set());
			});

			test('initial elements', () => {
				expect(gset.elements()).toEqual(Set());
			});
		});

		describe('Check static methods', () => {
			test('inital', () => {
				expect(GSet.initial()).toEqual(Set());
			});

			test('join', () => {
				expect(GSet.join(Set(['a', 'b']), Set(['c']))).toEqual(
					Set(['a', 'b', 'c'])
				);
			});
		});

		describe('Can insert elements', () => {
			const gset = GSet();

			test('return delta', () => {
				expect(gset.insert(1)).toEqual(Set([1]));
			});

			test('internal elements', () => {
				gset.insert(2);
				expect(gset.elements()).toEqual(Set([1, 2]));
			});
		});
	});

	describe('Convergence', () => {
		const gset1 = GSet();
		const gset2 = GSet();

		const deltas1 = [];
		const deltas2 = [];

		test('Can insert', () => {
			['a', 'c', 'e'].forEach(elem => deltas1.push(gset1.insert(elem)));
			['b', 'd', 'f'].forEach(elem => deltas2.push(gset2.insert(elem)));

			expect(gset1.elements()).toEqual(Set(['a', 'c', 'e']));
			expect(gset2.elements()).toEqual(Set(['b', 'd', 'f']));
		});

		test('Can join', () => {
			expect(GSet.join(gset1.state(), gset2.state())).toEqual(
				Set(['a', 'c', 'e', 'b', 'd', 'f'])
			);
		});

		test('Converges to one', () => {
			const deltaGroup1 = deltas1.reduce(GSet.join);
			const deltaGroup2 = deltas2.reduce(GSet.join);

			gset1.apply(deltaGroup2);
			expect(gset1.elements()).toEqual(
				Set(['a', 'c', 'e', 'b', 'd', 'f'])
			);

			gset2.apply(deltaGroup1);
			expect(gset2.elements()).toEqual(
				Set(['a', 'c', 'e', 'b', 'd', 'f'])
			);
		});
	});
});
