import {
    handleUnexpected,
    handleNull,
    handleUndefined,
    unhandledEntry
} from "./symbols";

/**
 * Core definition of all enum value mapper interfaces.
 * Defines properties for each possible value of type `E`.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type EnumValueMapperCore<E extends string | number, T> = {
    [P in E]: T | typeof unhandledEntry;
};

/**
 * Interface for an object that optionally maps an unexpected value to a value
 * of type T.
 * This is never used by itself, but combined with {@link EnumValueMapperCore}.
 *
 * @template T - The type of the value that the enum value is mapped to.
 */
export interface UnexpectedEnumValueMapper<T> {
    [handleUnexpected]?: T | typeof unhandledEntry;
}

/**
 * Interface for an object that maps a null value to a value of type T.
 * This is never used by itself, but combined with {@link EnumValueMapper} as
 * needed.
 *
 * @template T - The type of the value that the enum value is mapped to.
 */
export interface NullEnumValueMapper<T> {
    [handleNull]: T | typeof unhandledEntry;
}

/**
 * Interface for an object that maps an undefined value to a value of type T.
 * This is never used by itself, but combined with {@link EnumValueMapper} as
 * needed.
 *
 * @template T - The type of the value that the enum value is mapped to.
 */
export interface UndefinedEnumValueMapper<T> {
    [handleUndefined]: T | typeof unhandledEntry;
}

/**
 * Interface for an object that maps an enum or string/number literal value to a
 * value of type T.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type EnumValueMapper<E extends string | number, T> = EnumValueMapperCore<
    E,
    T
> &
    UnexpectedEnumValueMapper<T>;

/**
 * Combines {@link EnumValueMapper} with {@link NullEnumValueMapper} for mapping an enum
 * or string/number literal value that may be null.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type EnumValueMapperWithNull<
    E extends string | number,
    T
> = EnumValueMapper<E, T> &
    NullEnumValueMapper<T> &
    UnexpectedEnumValueMapper<T>;

/**
 * Combines {@link EnumValueMapper} with {@link UndefinedEnumValueMapper} for mapping an
 * enum or string/number literal value that may be undefined.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type EnumValueMapperWithUndefined<
    E extends string | number,
    T
> = EnumValueMapper<E, T> &
    UndefinedEnumValueMapper<T> &
    UnexpectedEnumValueMapper<T>;

/**
 * Combines {@link EnumValueMapper} with {@link NullEnumValueMapper} and
 * {@link UndefinedEnumValueMapper}
 * for mapping an enum or string/number literal value that may be null or
 * undefined.
 *
 * @template E - An enum type or string/number literal union type.
 * @template T - The type of the value that the enum value is mapped to.
 */
export type EnumValueMapperWithNullAndUndefined<
    E extends string | number,
    T
> = EnumValueMapper<E, T> &
    NullEnumValueMapper<T> &
    UndefinedEnumValueMapper<T> &
    UnexpectedEnumValueMapper<T>;
