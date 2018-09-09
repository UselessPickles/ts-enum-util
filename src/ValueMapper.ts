import { Symbols } from "./Symbols";

/**
 * Core definition of all enum value mapper interfaces.
 * Defines properties for each possible value of type `E`.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type ValueMapperCore<E extends string | number, T> = {
    [P in E]: T | typeof Symbols.unhandledEntry
};

/**
 * Interface for an object that optionally maps an unexpected value to a value
 * of type T.
 * This is never used by itself, but combined with {@link ValueMapperCore}.
 *
 * @template T - The type of the value that the enum value is mapped to.
 */
export interface UnexpectedValueMapper<T> {
    [Symbols.handleUnexpected]?: T | typeof Symbols.unhandledEntry;
}

/**
 * Interface for an object that maps a null value to a value of type T.
 * This is never used by itself, but combined with {@link ValueMapper} as
 * needed.
 *
 * @template T - The type of the value that the enum value is mapped to.
 */
export interface NullValueMapper<T> {
    [Symbols.handleNull]: T | typeof Symbols.unhandledEntry;
}

/**
 * Interface for an object that maps an undefined value to a value of type T.
 * This is never used by itself, but combined with {@link ValueMapper} as
 * needed.
 *
 * @template T - The type of the value that the enum value is mapped to.
 */
export interface UndefinedValueMapper<T> {
    [Symbols.handleUndefined]: T | typeof Symbols.unhandledEntry;
}

/**
 * Interface for an object that maps an enum or string/number literal value to a
 * value of type T.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type ValueMapper<E extends string | number, T> = ValueMapperCore<E, T> &
    UnexpectedValueMapper<T>;

/**
 * Combines {@link ValueMapper} with {@link NullValueMapper} for mapping an enum
 * or string/number literal value that may be null.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type ValueMapperWithNull<E extends string | number, T> = ValueMapper<
    E,
    T
> &
    NullValueMapper<T> &
    UnexpectedValueMapper<T>;

/**
 * Combines {@link ValueMapper} with {@link UndefinedValueMapper} for mapping an
 * enum or string/number literal value that may be undefined.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type ValueMapperWithUndefined<
    E extends string | number,
    T
> = ValueMapper<E, T> & UndefinedValueMapper<T> & UnexpectedValueMapper<T>;

/**
 * Combines {@link ValueMapper} with {@link NullValueMapper} and
 * {@link UndefinedValueMapper}
 * for mapping an enum or string/number literal value that may be null or
 * undefined.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type ValueMapperWithNullAndUndefined<
    E extends string | number,
    T
> = ValueMapper<E, T> &
    NullValueMapper<T> &
    UndefinedValueMapper<T> &
    UnexpectedValueMapper<T>;
