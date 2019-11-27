import { EnumWrapper } from "./EnumWrapper";
import { EnumObject } from "./EnumObject";
import * as symbols from "./symbols";
import { visitEnumValue } from "./visitEnumValue";
import { mapEnumValue } from "./mapEnumValue";

/**
 * Map of enum object -> EnumWrapper instance.
 * Used as a cache for {@link $enum}.
 * NOTE: WeakMap has very fast lookups and avoids memory leaks if used on a
 *       temporary enum-like object. Even if a WeakMap implementation is very
 *       naiive (like a Map polyfill), lookups are plenty fast for this use case
 *       of a relatively small number of enums within a project. Just don't
 *       perform cached lookups inside tight loops when you could cache the
 *       result in a local variable, and you'll be fine :)
 *       {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap}
 *       {@link https://www.measurethat.net/Benchmarks/Show/2513/5/map-keyed-by-object}
 */
const enumWrapperInstancesCache = new WeakMap<object, EnumWrapper<any>>();

/**
 * Gets a cached EnumWrapper for an enum-like object.
 * Creates and caches a new EnumWrapper if one is not already cached.
 * @param enumObj - An enum-like object with number values.
 * @return An instance of EnumWrapper for the provided enumObj.
 *
 * @template E - Type of the enum-like object that is being wrapped.
 */
export function $enum<E extends EnumObject.Constraint<E>>(
    enumObj: E
): EnumWrapper<E> {
    let result = enumWrapperInstancesCache.get(enumObj);

    if (!result) {
        result = new EnumWrapper(enumObj);
        enumWrapperInstancesCache.set(enumObj, result);
    }

    return result;
}

$enum.handleNull = symbols.handleNull;
$enum.handleUndefined = symbols.handleUndefined;
$enum.handleUnexpected = symbols.handleUnexpected;
$enum.unhandledEntry = symbols.unhandledEntry;
$enum.visitValue = visitEnumValue;
$enum.mapValue = mapEnumValue;
