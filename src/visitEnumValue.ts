import {
    EnumValueVisitee,
    EnumValueVisiteeWithNull,
    EnumValueVisiteeWithUndefined,
    EnumValueVisiteeWithNullAndUndefined
} from "./EnumValueVisitee";

/**
 * Union of all "EnumValueVisitee" types.
 */
type AnyEnumValueVisitee<E extends string | number> =
    | EnumValueVisitee<E>
    | EnumValueVisiteeWithNull<E>
    | EnumValueVisiteeWithUndefined<E>
    | EnumValueVisiteeWithNullAndUndefined<E>;

/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: visitEnumValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link EnumValueVisitee#with} and {@link ValueMapper}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function visitEnumValue<E extends string | number>(
    value: E
): EnumValueVisitee<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: visitEnumValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link EnumValueVisiteeWithNull#with} and {@link ValueMapperWithNull}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function visitEnumValue<E extends string | number>(
    value: E | null
): EnumValueVisiteeWithNull<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: visitEnumValue(aStringEnumValue).with({ ... }).
 *
 * See also, {@link EnumValueVisiteeWithUndefined#with} and
 * {@link ValueMapperWithUndefined}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function visitEnumValue<E extends string | number>(
    value: E | undefined
): EnumValueVisiteeWithUndefined<E>;
/**
 * The first step to mapping the value of an enum or string/number literal type.
 * This method creates a "mappee" wrapper object, whose "with()" method must be
 * called with a mapper implementation.
 *
 * Example: visitEnumValue(aStringEnumValue).with({ ... }).
 * See also, {@link EnumValueVisiteeWithNullAndUndefined#with} and
 * {@link ValueMapperWithNullAndUndefined}.
 *
 * @template E - An enum or string/number literal type.
 *
 * @param value - The value to visit. Must be an enum or string/number literal.
 * @return A "mappee" wrapper around the provided value, whose "with()" method
 *         must be called with a mapper implementation.
 */
export function visitEnumValue<E extends string | number>(
    value: E | null | undefined
): EnumValueVisiteeWithNullAndUndefined<E>;

export function visitEnumValue<E extends string | number>(
    value: E | null | undefined
): AnyEnumValueVisitee<E> {
    // NOTE: The run time type of EnumValueVisitee created does not necessarily match
    //       the compile-time type. This results in unusual EnumValueVisitee.with()
    //       implementations.
    if (value === null) {
        return new EnumValueVisiteeWithNull<E>();
    } else if (value === undefined) {
        return new EnumValueVisiteeWithUndefined<E>();
    } else {
        return new EnumValueVisitee<E>(value);
    }
}
