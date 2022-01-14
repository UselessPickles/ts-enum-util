/**
 * Extracts only keys of type T that are assignable to type `string`.
 * This is necessary starting with TypeScript 2.9 because keyof T can now
 * include `number` and `symbol` types.
 */
export type StringKeyOf<T> = Extract<keyof T, string>;
