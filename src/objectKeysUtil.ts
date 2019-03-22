import { StringKeyOf } from "./types";

/**
 * Return true if the specified object key value is NOT an array index key.
 * @param key - An object key.
 * @return true if the specified object key value is NOT an array index key.
 */
export function isNonArrayIndexKey(key: string): boolean {
    // See ECMAScript spec section 15.4 for definition of an array index:
    // http://www.ecma-international.org/ecma-262/5.1/#sec-15.4

    // Parse the key as an integer
    const parsedInt = parseInt(key, 10);

    // If the parsed value is outside of the range of valid values,
    // then it clearly can't be a valid array index.
    // NOTE: Maximum unsigned 32-bit integer = 2^32-1 = 4294967295
    if (parsedInt < 0 || parsedInt >= 4294967295) {
        return true;
    }

    // The parsed value is within the valid range, but the original key is not
    // a valid array index if it is not equal to the string representation of
    // the parsed numeric value.
    return key !== String(parsedInt);
}

/**
 * Get all own enumerable string (non-array-index) keys of an object.
 * Implemented in terms of methods available in ES6.
 * The order of the result is *guaranteed* to be in the same order in which the
 * properties were added to the object, due to the specification of the
 * Object.getOwnPropertyNames method.
 * (first all numeric keys)
 * @param obj - An object.
 * @return A list of all the object's own enumerable string (non-array-index) keys.
 */
export function getOwnEnumerableNonArrayIndexKeysES6<
    T extends Record<string, any>
>(obj: T): StringKeyOf<T>[] {
    return Object.getOwnPropertyNames(obj).filter((key) => {
        return obj.propertyIsEnumerable(key) && isNonArrayIndexKey(key);
    }) as StringKeyOf<T>[];
}

/**
 * Get all own enumerable string (non-array-index) keys of an object.
 * Implemented in terms of methods available in ES5.
 * The order of the result is *most likely* to be in the same order in which the
 * properties were added to the object, due to de-facto standards in most JS
 * runtime environments' implementations of Object.keys
 * @param obj - An object.
 * @return A list of all the object's own enumerable string (non-array-index) keys.
 */
export function getOwnEnumerableNonArrayIndexKeysES5<
    T extends Record<string, any>
>(obj: T): StringKeyOf<T>[] {
    return Object.keys(obj).filter(isNonArrayIndexKey) as StringKeyOf<T>[];
}

/**
 * Get all own enumerable string (non-array-index) keys of an object.
 * Implemented in terms of methods available in ES3.
 * The order of the result is *most likely* to be in the same order in which the
 * properties were added to the object, due to de-facto standards in most JS
 * runtime environments' implementations of for/in object key iteration.
 * @param obj - An object.
 * @return A list of all the object's own enumerable string (non-array-index) keys.
 */
export function getOwnEnumerableNonArrayIndexKeysES3<
    T extends Record<string, any>
>(obj: T): StringKeyOf<T>[] {
    const result: StringKeyOf<T>[] = [];

    for (const key in obj) {
        if (
            obj.hasOwnProperty(key) &&
            obj.propertyIsEnumerable(key) &&
            isNonArrayIndexKey(key)
        ) {
            result.push(key);
        }
    }

    return result;
}

/**
 * Get all own enumerable string (non-array-index) keys of an object, using
 * the best implementation available.
 * The order of the result is either *guaranteed* or *most likely* to be in the
 * same order in which the properties were added to the object, depending on
 * the best available implementation.
 * @see getEnumerableStringKeysES6
 * @see getEnumerableStringKeysES5
 * @see getEnumerableStringKeysES3
 * @param obj - An object.
 * @return A list of all the object's own enumerable string (non-array-index) keys.
 */
export const getOwnEnumerableNonArrayIndexKeys = Object.getOwnPropertyNames
    ? getOwnEnumerableNonArrayIndexKeysES6
    : Object.keys
    ? getOwnEnumerableNonArrayIndexKeysES5
    : getOwnEnumerableNonArrayIndexKeysES3;
