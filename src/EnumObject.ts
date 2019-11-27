import { StringKeyOf } from "./types";

export namespace EnumObject {
    /**
     * Use this in a generics type constraint to ensure that a type param
     * is an enum-like object type.
     *
     * Examples:
     *     // function that accepts any kind of enum-like object
     *     function foo<T extends EnumObject.Constraint<T>>(enumObj: T): void {}
     *
     *     // function that accepts only string-enum-like objects
     *     function bar<T extends EnumObject.Constraint<T, string>>(enumObj: T): void {}
     *
     * @template E - The type param that is to be constrained to an enum-like object type.
     * @template T - The type constraint for the type of the enum's values.
     */
    export type Constraint<
        E,
        T extends number | string = number | string
    > = Record<StringKeyOf<E>, T>;

    /**
     * Extracts the enum value type from the type of an enum-like object.
     *
     * @template E - The type of an enum-like object.
     */
    export type ExtractType<E extends Constraint<E>> = E[StringKeyOf<E>];

    /**
     * Extracts the enum keys type from the type of an enum-like object.
     *
     * @template E - The type of an enum-like object.
     */
    export type ExtractKeys<E extends Constraint<E>> = StringKeyOf<E>;
}
