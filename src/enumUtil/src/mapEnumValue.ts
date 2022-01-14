import {
    EnumValueMappee,
    EnumValueMappeeWithNull,
    EnumValueMappeeWithUndefined,
    EnumValueMappeeWithNullAndUndefined
} from "./EnumValueMappee";

/**
 * Union of all "EnumValueMappee" types.
 */
type AnyEnumValueMappee<E extends string | number> =
    | EnumValueMappee<E>
    | EnumValueMappeeWithNull<E>
    | EnumValueMappeeWithUndefined<E>
    | EnumValueMappeeWithNullAndUndefined<E>;

/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapEnumValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link EnumValueMappee#with} and {@link ValueMapper}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function mapEnumValue<E extends string | number>(
    value: E
): EnumValueMappee<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapEnumValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link EnumValueMappeeWithNull#with} and {@link ValueMapperWithNull}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function mapEnumValue<E extends string | number>(
    value: E | null
): EnumValueMappeeWithNull<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapEnumValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link EnumValueMappeeWithUndefined#with} and
 * {@link ValueMapperWithUndefined}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function mapEnumValue<E extends string | number>(
    value: E | undefined
): EnumValueMappeeWithUndefined<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapEnumValue(aStringEnumValue).with({ ... }).
 * See also, {@link EnumValueMappeeWithNullAndUndefined#with} and
 * {@link ValueMapperWithNullAndUndefined}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function mapEnumValue<E extends string | number>(
    value: E | null | undefined
): EnumValueMappeeWithNullAndUndefined<E>;

export function mapEnumValue<E extends string | number>(
    value: E | null | undefined
): AnyEnumValueMappee<E> {
    // NOTE: The run time type of EnumValueMappee created does not necessarily match
    //       the compile-time type. This results in unusual EnumValueMappee.with()
    //       implementations.
    if (value === null) {
        return new EnumValueMappeeWithNull<E>();
    } else if (value === undefined) {
        return new EnumValueMappeeWithUndefined<E>();
    } else {
        return new EnumValueMappee<E>(value);
    }
}
