import {
    handleUnexpected,
    handleNull,
    handleUndefined,
    unhandledEntry
} from "./symbols";

/**
 * Helper type to widen a number/string enum/literal type to plain string or number.
 */
export type WidenEnumType<E extends number | string> =
    | (E extends number ? number : never)
    | (E extends string ? string : never);

/**
 * Generic method signature for a string visitor handler method.
 * @template E - The type of the parameter to the handler. Must be a string literal, null, or undefined.
 * @template R - The return type of the handler. Defaults to void.
 * @param value - The value being visited by the visitor.
 * @returns A result to be returned by the visitor,
 */
export type EnumValueVisitorHandler<
    E extends string | number | null | undefined,
    R = void
> = (value: E) => R;

/**
 * Core definition of all string visitor interfaces.
 * Defines visitor handler properties for each possible value of type `E`.
 *
 * @template E - A string literal type or string enum type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorCore<E extends string | number, R> = {
    [P in E]: EnumValueVisitorHandler<P, R> | typeof unhandledEntry;
};

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
 * A visitor interface for visiting the value of a string literal type or a string enum type.
 *
 * @template E - A string literal type or string enum type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitor<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> & {
    [handleUnexpected]?:
        | EnumValueVisitorHandler<WidenEnumType<E> | null | undefined, R>
        | typeof unhandledEntry;
};

/**
 * Combines {@link EnumValueVisitor} with {@link NullEnumValueVisitor} for visiting a string literal/enum
 * that may be null.
 *
 * @template E - A string literal type or string enum type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorWithNull<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> &
    NullEnumValueVisitor<R> & {
        [handleUnexpected]?:
            | EnumValueVisitorHandler<WidenEnumType<E> | undefined, R>
            | typeof unhandledEntry;
    };

/**
 * Combines {@link EnumValueVisitor} with {@link UndefinedEnumValueVisitor} for visiting a string literal/enum
 * that may be undefined.
 *
 * @template E - A string literal type or string enum type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorWithUndefined<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> &
    UndefinedEnumValueVisitor<R> & {
        [handleUnexpected]?:
            | EnumValueVisitorHandler<WidenEnumType<E> | null, R>
            | typeof unhandledEntry;
    };

/**
 * Combines {@link EnumValueVisitor} with {@link NullEnumValueVisitor} and {@link UndefinedEnumValueVisitor}
 * for visiting a string literal/enum that may be null or undefined.
 *
 * @template E - A string literal type or string enum type.
 * @template R - The return type of the visitor methods.
 */
export type EnumValueVisitorWithNullAndUndefined<
    E extends string | number,
    R
> = EnumValueVisitorCore<E, R> &
    NullEnumValueVisitor<R> &
    UndefinedEnumValueVisitor<R> & {
        [handleUnexpected]?:
            | EnumValueVisitorHandler<WidenEnumType<E>, R>
            | typeof unhandledEntry;
    };
