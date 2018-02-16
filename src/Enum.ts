import {EnumWrapper} from "./EnumWrapper";

/**
 * Used internally to verify that some type is enum-like.
 * A type is enum-like if all its properties are of type number or string.
 * @template V - Type of the enum value.
 * @template K - String literal union of all keys of the enum-like type.
 */
export type Enum<V extends number | string, K extends string> = {
    [P in K]: V;
};

/**
 * Convenience function for {@link EnumWrapper.getInstance}.
 * Creates a new EnumWrapper, or returns a cached EnumWrapper if one has already been created for the same
 * object via {@link EnumWrapper.getInstance} or {@link Enum()}.
 * @param enumObj - An enum-like object.
 * @return An instance of EnumWrapper for the provided enumObj.
 */
export function Enum<T extends Enum<number, keyof T>>(enumObj: T): EnumWrapper<number, T>;
export function Enum<T extends Enum<string, keyof T>>(enumObj: T): EnumWrapper<string, T>;
export function Enum<T extends Enum<number | string, keyof T>>(enumObj: T): EnumWrapper<number | string, T>;
export function Enum(enumObj: any): EnumWrapper {
    return EnumWrapper.getInstance(enumObj);
}
