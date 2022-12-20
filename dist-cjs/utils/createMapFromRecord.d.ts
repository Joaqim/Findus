declare const createMapFromRecord: <TKey extends string = string, TValue = unknown>(data: Record<TKey, TValue>) => Map<TKey, TValue>;
export default createMapFromRecord;
