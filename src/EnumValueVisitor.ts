import {
    handleUnexpected,
    handleNull,
    handleUndefined,
    unhandledEntry
} from "./symbols";

/**
 * Generic method signature for a value visitor handler method.
 * @template T - The type of the value.
 * @template R - The return type of the handler. Defaults to void.
 * @param value - The value being visited by the visitor.
 * @returns A result to be returned by the visitor,
 */
export type EnumValueVisitorHandler<T, R = void> = (value: T) => R;

/**
 * Core definition of all value visitor interfaces.
 * Defines visitor handler properties for each possible value of type `E`.
 *
 * @template E - An enum type or string/number literal union type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorCore<E extends string | number, R> = {
    [P in E]: EnumValueVisitorHandler<P, R> | typeof unhandledEntry
};

/**
 * A visitor interface for visiting an unexpected value.
 * This is never used by itself, but combined with {@link EnumValueVisitor} as needed.
 *
 * @template R - The return type of the visitor method.
 */
export interface UnexpectedEnumValueVisitor<R> {
    [handleUnexpected]?:
        | EnumValueVisitorHandler<any, R>
        | typeof unhandledEntry;
}

/**
 * A visitor interface for visiting a null value.
 * This is never used by itself, but combined with {@link EnumValueVisitor} as needed.
 *
 * @template R - The return type of the visitor method.
 */
export interface NullEnumValueVisitor<R> {
    [handleNull]: EnumValueVisitorHandler<null, R> | typeof unhandledEntry;
}

/**
 * A visitor interface for visiting an undefined value.
 * This is never used by itself, but combined with {@link EnumValueVisitor} as needed.
 *
 * @template R - The return type of the visitor method.
 */
export interface UndefinedEnumValueVisitor<R> {
    [handleUndefined]:
        | EnumValueVisitorHandler<undefined, R>
        | typeof unhandledEntry;
}

/**
 * A visitor interface for visiting the value of an enum type or string/number literal union type.
 *
 * @template E - An enum type or string/number literal union type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitor<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> & UnexpectedEnumValueVisitor<R>;

/**
 * Combines {@link EnumValueVisitor} with {@link NullEnumValueVisitor} for
 * visiting an enum or string/number literal value that may be null.
 *
 * @template E - An enum type or string/number literal union type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorWithNull<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> &
    NullEnumValueVisitor<R> &
    UnexpectedEnumValueVisitor<R>;

/**
 * Combines {@link EnumValueVisitor} with {@link UndefinedEnumValueVisitor} for
 * visiting an enum or string/number literal value that may be undefined.
 *
 * @template E - An enum type or string/number literal union type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorWithUndefined<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> &
    UndefinedEnumValueVisitor<R> &
    UnexpectedEnumValueVisitor<R>;

/**
 * Combines {@link EnumValueVisitor} with {@link NullEnumValueVisitor} and
 * {@link UndefinedEnumValueVisitor} for visiting an enum or string/number literal value
 * that may be null or undefined.
 *
 * @template E - An enum type or string/number literal union type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorWithNullAndUndefined<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> &
    NullEnumValueVisitor<R> &
    UndefinedEnumValueVisitor<R> &
    UnexpectedEnumValueVisitor<R>;
