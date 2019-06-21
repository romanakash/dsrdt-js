import GCounter from '../src/gcounter';
import { Map } from 'immutable';

describe('GCounter', () => {
	describe('Local', () => {
		const id = '1';
		const gcounter = GCounter(id);
		test('Can be initiated', () => {
			expect(gcounter).toEqual({
				state: expect.any(Function),
				inc: expect.any(Function),
				value: expect.any(Function),
				join: expect.any(Function),
				apply: expect.any(Function)
			});
			expect(gcounter.value()).toEqual(0);
			expect(gcounter.state()).toEqual(Map({ [id]: 0 }));
		});
		test('Can increment', () => {
			expect(gcounter.inc()).toEqual(Map({ [id]: 1 }));
			expect(gcounter.value()).toEqual(1);
		});
		test('Can join', () => {
			expect(gcounter.join(gcounter.state(), gcounter.inc())).toEqual(
				Map({ [id]: 2 })
			);
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
			deltas1.push(gcounter1.inc());
			deltas1.push(gcounter1.inc());
			deltas1.push(gcounter1.inc());
			deltas2.push(gcounter2.inc());
			deltas2.push(gcounter2.inc());
			expect(gcounter1.value()).toEqual(3);
			expect(gcounter2.value()).toEqual(2);
		});
		test('Can join', () => {
			expect(
				gcounter1.join(gcounter1.state(), gcounter2.state())
			).toEqual(Map({ [id1]: 3, [id2]: 2 }));
		});
		test('Converges to one', () => {
			const deltaGroup1 = deltas1.reduce(gcounter1.join);
			const deltaGroup2 = deltas2.reduce(gcounter2.join);

			gcounter1.apply(deltaGroup2);
			expect(gcounter1.value()).toEqual(5);

			gcounter2.apply(deltaGroup1);
			expect(gcounter2.value()).toEqual(5);
		});
	});
});
