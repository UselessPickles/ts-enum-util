/**
 * Extracts only keys of type T that are assignable to type `string`.
 * This is necessary starting with TypeScript 2.9 because keyof T can now
 * include `number` and `symbol` types.
 */
export type StringKeyOf<T> = Extract<keyof T, string>;

/**
 * Extracts only keys of type T that are assignable to type `string`
 * and whose property values are asslignable to type V.
 */
export type StringKeyOfType<T, V> = {
    [P in StringKeyOf<T>]: T[P] extends V ? P : never;
}[StringKeyOf<T>];
