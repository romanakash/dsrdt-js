import { Map } from 'immutable';
import LexCounter from '../src/lexcounter';

describe('LexCounter', () => {
	describe('Local', () => {
		const id = '1';

		describe('Check initialisation', () => {
			const lexcounter = LexCounter(id);

			test('object methods', () => {
				expect(lexcounter).toEqual({
					state: expect.any(Function),
					inc: expect.any(Function),
					dec: expect.any(Function),
					value: expect.any(Function),
					apply: expect.any(Function)
				});
			});

			test('initial state', () => {
				expect(lexcounter.state()).toEqual(Map({ [id]: [0, 0] }));
			});

			test('initial value', () => {
				expect(lexcounter.value()).toEqual(0);
			});
		});

		describe('Check static methods', () => {
			test('initial', () => {
				expect(LexCounter.initial()).toEqual(Map());
			});

			test('join', () => {
				expect(
					LexCounter.join(
						Map({ [id]: [0, 0] }),
						Map({ [id]: [0, 1] })
					)
				).toEqual(Map({ [id]: [0, 1] }));
			});
		});

		describe('Can increment', () => {
			const lexcounter = LexCounter(id);

			test('return delta', () => {
				expect(lexcounter.inc()).toEqual(Map({ [id]: [0, 1] }));
			});

			test('internal value', () => {
				expect(lexcounter.value()).toEqual(1);
			});
		});

		describe('Can decrement', () => {
			const lexcounter = LexCounter(id);

			test('return delta', () => {
				expect(lexcounter.dec()).toEqual(Map({ [id]: [1, -1] }));
			});

			test('internal state', () => {
				expect(lexcounter.dec()).toEqual(Map({ [id]: [2, -2] }));
			});
			test('internal value', () => {
				expect(lexcounter.value()).toEqual(-2);
			});
		});
	});

	describe('Convergence', () => {
		const id1 = '1';
		const id2 = '2';
		const gcounter1 = LexCounter(id1);
		const gcounter2 = LexCounter(id2);
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
					LexCounter.join(gcounter1.state(), gcounter2.state())
				).toEqual(Map({ [id1]: [1, 3], [id2]: [1, 2] }));
			});
		});

		describe('Converges to one', () => {
			test('counter 1', () => {
				const deltaGroup2 = deltas2.reduce(LexCounter.join);
				gcounter1.apply(deltaGroup2);
				expect(gcounter1.value()).toEqual(5);
			});

			test('counter 1', () => {
				const deltaGroup1 = deltas1.reduce(LexCounter.join);
				gcounter2.apply(deltaGroup1);
				expect(gcounter2.value()).toEqual(5);
			});
		});
	});
});
