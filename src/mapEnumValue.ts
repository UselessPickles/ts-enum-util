import {
    ValueMappee,
    ValueMappeeWithNull,
    ValueMappeeWithUndefined,
    ValueMappeeWithNullAndUndefined
} from "./ValueMappee";

/**
 * Union of all "ValueMappee" types.
 */
type AnyValueMappee<E extends string | number> =
    | ValueMappee<E>
    | ValueMappeeWithNull<E>
    | ValueMappeeWithUndefined<E>
    | ValueMappeeWithNullAndUndefined<E>;

/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link ValueMappee#with} and {@link ValueMapper}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function mapEnumValue<E extends string | number>(
    value: E
): ValueMappee<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link ValueMappeeWithNull#with} and {@link ValueMapperWithNull}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function mapEnumValue<E extends string | number>(
    value: E | null
): ValueMappeeWithNull<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link ValueMappeeWithUndefined#with} and
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
): ValueMappeeWithUndefined<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: mapValue(aStringEnumValue).with({ ... }).
 * See also, {@link ValueMappeeWithNullAndUndefined#with} and
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
): ValueMappeeWithNullAndUndefined<E>;

export function mapEnumValue<E extends string | number>(
    value: E | null | undefined
): AnyValueMappee<E> {
    // NOTE: The run time type of ValueMappee created does not necessarily match
    //       the compile-time type. This results in unusual ValueMappee.with()
    //       implementations.
    if (value === null) {
        return new ValueMappeeWithNull<E>();
    } else if (value === undefined) {
        return new ValueMappeeWithUndefined<E>();
    } else {
        return new ValueMappee<E>(value);
    }
}
