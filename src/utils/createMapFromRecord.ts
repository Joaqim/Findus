type Entries<T> = Array<
  {
    [K in keyof T]: [K, T[K]];
  }[keyof T]
>;

const entries = <Object_>(object: Object_): Entries<Object_> =>
  Object.entries(object) as Entries<Object_>;

const createMapFromRecord = <TKey extends string = string, TValue = unknown>(
  data: Record<TKey, TValue>
): Map<TKey, TValue> =>
  // eslint-disable-next-line unicorn/no-array-reduce
  entries(data).reduce(
    (
      accumulator: Map<TKey, TValue>,
      [key, value]: [key: TKey, value: TValue]
    ) => {
      accumulator.set(key, value);
      return accumulator;
    },
    new Map<TKey, TValue>()
  );

export default createMapFromRecord;
