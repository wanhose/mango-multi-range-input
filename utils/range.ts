export function getNearestIndexOnValues(
  value: number,
  values: readonly number[],
): number {
  let nearest = [...values].sort()[0];
  let diff = Math.abs(value - nearest);

  for (let i = 1; i < values.length; i++) {
    const newDiff = Math.abs(value - values[i]);

    if (newDiff < diff) {
      nearest = values[i];
      diff = newDiff;
    }
  }

  return nearest;
}

export function getNearestIndex(value: number, step: number): number {
  return Math.round(value / step) * step;
}

export function getNextIndex(
  value: number,
  step: number,
  max: number,
): number | undefined {
  const nextValue = value + step;

  return nextValue <= max ? nextValue : undefined;
}

export function getNextIndexOnValues(
  value: number,
  values: readonly number[],
  max: number,
): number | undefined {
  const sortedValues = [...values].sort((a, b) => a - b);
  const currentIndex = sortedValues.indexOf(value);
  const nextIndex =
    currentIndex < sortedValues.length - 1
      ? sortedValues[currentIndex + 1]
      : undefined;

  return typeof nextIndex === 'number' && nextIndex <= max
    ? nextIndex
    : undefined;
}

export function getPreviousIndex(
  value: number,
  step: number,
  min: number,
): number | undefined {
  const previousValue = value - step;

  return previousValue >= min ? previousValue : undefined;
}

export function getPreviousIndexOnValues(
  value: number,
  values: readonly number[],
  min: number,
): number | undefined {
  const sortedValues = [...values].sort((a, b) => a - b);
  const currentIndex = sortedValues.indexOf(value);
  const previousIndex =
    currentIndex > 0 ? sortedValues[currentIndex - 1] : undefined;

  return typeof previousIndex === 'number' && previousIndex >= min
    ? previousIndex
    : undefined;
}
