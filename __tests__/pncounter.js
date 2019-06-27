import { Map } from 'immutable';
import PNCounter from '../src/pncounter';

describe('PNCounter', () => {
	describe('Local', () => {
		const id = '1';

		describe('Check initialisation', () => {
			const gcounter = PNCounter(id);

			test('object methods', () => {
				expect(gcounter).toEqual({
					state: expect.any(Function),
					inc: expect.any(Function),
					dec: expect.any(Function),
					value: expect.any(Function),
					apply: expect.any(Function)
				});
			});

			test('initial state', () => {
				expect(gcounter.state()).toEqual([
					Map({ [id]: 0 }),
					Map({ [id]: 0 })
				]);
			});

			test('initial value', () => {
				expect(gcounter.value()).toEqual(0);
			});
		});

		describe('Check static methods', () => {
			test('initial', () => {
				expect(PNCounter.initial()).toEqual([Map(), Map()]);
			});

			test('join', () => {
				expect(
					PNCounter.join(
						[Map({ [id]: 1 }), Map({ [id]: 0 })],
						[Map({ [id]: 2 }), Map({ [id]: 1 })]
					)
				).toEqual([Map({ [id]: 2 }), Map({ [id]: 1 })]);
			});
		});

		describe('Can increment', () => {
			const gcounter = PNCounter(id);

			test('return delta', () => {
				expect(gcounter.inc()).toEqual([Map({ [id]: 1 }), Map()]);
			});

			test('internal value', () => {
				expect(gcounter.value()).toEqual(1);
			});
		});

		describe('Can decrement', () => {
			const gcounter = PNCounter(id);

			test('return delta', () => {
				expect(gcounter.dec()).toEqual([Map(), Map({ [id]: 1 })]);
			});

			test('internal state', () => {
				expect(gcounter.dec()).toEqual([Map(), Map({ [id]: 2 })]);
			});

			test('internal value', () => {
				expect(gcounter.value()).toEqual(-2);
			});
		});
	});

	describe('Convergence', () => {
		const id1 = '1';
		const id2 = '2';
		const gcounter1 = PNCounter(id1);
		const gcounter2 = PNCounter(id2);
		const deltas1 = [];
		const deltas2 = [];

		describe('Can increment', () => {
			test('counter1', () => {
				[1, 2, 3, 4].forEach(() => deltas1.push(gcounter1.inc()));
				expect(gcounter1.value()).toEqual(4);
			});
			test('counter2', () => {
				[1, 2, 3].forEach(() => deltas2.push(gcounter2.inc()));
				expect(gcounter2.value()).toEqual(3);
			});
		});

		describe('Can decrement', () => {
			test('counter1', () => {
				deltas1.push(gcounter1.dec());
				expect(gcounter1.value()).toEqual(3);
			});
			test('counter2', () => {
				deltas2.push(gcounter2.dec());
				expect(gcounter2.value()).toEqual(2);
			});
		});

		describe('Can join', () => {
			test('counter 1', () => {
				expect(
					PNCounter.join(gcounter1.state(), gcounter2.state())
				).toEqual([
					Map({ [id1]: 4, [id2]: 3 }),
					Map({ [id1]: 1, [id2]: 1 })
				]);
			});
		});

		describe('Converges to one', () => {
			test('counter 1', () => {
				const deltaGroup2 = deltas2.reduce(PNCounter.join);
				gcounter1.apply(deltaGroup2);
				expect(gcounter1.value()).toEqual(5);
			});

			test('counter 1', () => {
				const deltaGroup1 = deltas1.reduce(PNCounter.join);
				gcounter2.apply(deltaGroup1);
				expect(gcounter2.value()).toEqual(5);
			});
		});
	});
});
