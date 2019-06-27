import { Map } from 'immutable';
import GCounter from '../src/gcounter';

describe('GCounter', () => {
	describe('Local', () => {
		const id = '1';

		describe('Check initialisation', () => {
			const gcounter = GCounter(id);

			test('object methods', () => {
				expect(gcounter).toEqual({
					state: expect.any(Function),
					inc: expect.any(Function),
					value: expect.any(Function),
					apply: expect.any(Function)
				});
			});

			test('initial state', () => {
				expect(gcounter.state()).toEqual(Map({ [id]: 0 }));
			});

			test('initial value', () => {
				expect(gcounter.value()).toEqual(0);
			});
		});

		describe('Check static methods', () => {
			test('initial', () => {
				expect(GCounter.initial()).toEqual(Map());
			});

			test('join', () => {
				expect(
					GCounter.join(Map({ [id]: 1 }), Map({ [id]: 2 }))
				).toEqual(Map({ [id]: 2 }));
			});
		});

		describe('Can increment', () => {
			const gcounter = GCounter(id);

			test('return delta', () => {
				expect(gcounter.inc()).toEqual(Map({ [id]: 1 }));
			});

			test('internal value', () => {
				expect(gcounter.value()).toEqual(1);
			});
		});
	});

	describe('Convergence', () => {
		const id1 = '1';
		const id2 = '2';
		const gcounter1 = GCounter(id1);
		const gcounter2 = GCounter(id2);
		const deltas1 = [];
		const deltas2 = [];

		test('Can increment', () => {
			[1, 2, 3].forEach(() => deltas1.push(gcounter1.inc()));
			[1, 2].forEach(() => deltas2.push(gcounter2.inc()));
			expect(gcounter1.value()).toEqual(3);
			expect(gcounter2.value()).toEqual(2);
		});

		test('Can join', () => {
			expect(GCounter.join(gcounter1.state(), gcounter2.state())).toEqual(
				Map({ [id1]: 3, [id2]: 2 })
			);
		});

		test('Converges to one', () => {
			const deltaGroup1 = deltas1.reduce(GCounter.join);
			const deltaGroup2 = deltas2.reduce(GCounter.join);

			gcounter1.apply(deltaGroup2);
			expect(gcounter1.value()).toEqual(5);

			gcounter2.apply(deltaGroup1);
			expect(gcounter2.value()).toEqual(5);
		});
	});
});
