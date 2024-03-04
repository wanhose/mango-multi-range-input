import {
  getNearestIndexOnValues,
  getNearestIndex,
  getNextIndex,
  getNextIndexOnValues,
  getPreviousIndex,
  getPreviousIndexOnValues,
} from '../range';

describe('Range functions', () => {
  test('getNearestIndexOnValues', () => {
    expect(getNearestIndexOnValues(5, [1, 2, 3, 4, 5, 6, 7, 8, 9])).toBe(5);
    expect(getNearestIndexOnValues(15, [10, 20, 30, 40, 50])).toBe(10);
    expect(getNearestIndexOnValues(0, [100, 200, 300, 400, 500])).toBe(100);
  });

  test('getNearestIndex', () => {
    expect(getNearestIndex(5, 2)).toBe(6);
    expect(getNearestIndex(15, 10)).toBe(20);
    expect(getNearestIndex(0, 100)).toBe(0);
  });

  test('getNextIndex', () => {
    expect(getNextIndex(5, 2, 10)).toBe(7);
    expect(getNextIndex(15, 10, 20)).toBeUndefined();
    expect(getNextIndex(100, 100, 200)).toBe(200);
    expect(getNextIndex(100, 100, 90)).toBeUndefined();
  });

  test('getNextIndexOnValues', () => {
    expect(getNextIndexOnValues(5, [1, 2, 3, 4, 5, 6, 7, 8, 9], 10)).toBe(6);
    expect(getNextIndexOnValues(15, [10, 20, 30, 40, 50], 50)).toBe(10);
    expect(getNextIndexOnValues(0, [100, 200, 300, 400], 100)).toBe(100);
  });

  test('getPreviousIndex', () => {
    expect(getPreviousIndex(5, 2, 0)).toBe(3);
    expect(getPreviousIndex(15, 10, 0)).toBe(5);
    expect(getPreviousIndex(100, 100, 0)).toBe(0);
    expect(getPreviousIndex(0, 100, 0)).toBeUndefined();
  });

  test('getPreviousIndexOnValues', () => {
    expect(getPreviousIndexOnValues(5, [1, 2, 3, 4, 5, 6, 7, 8, 9], 0)).toBe(4);
    expect(getPreviousIndexOnValues(20, [10, 20, 30, 40, 50], 10)).toBe(10);
    expect(getPreviousIndexOnValues(200, [100, 200, 300, 400], 100)).toBe(100);
    expect(getPreviousIndexOnValues(100, [100, 200, 300], 200)).toBeUndefined();
  });
});
