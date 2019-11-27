import { StringKeyOf, StringKeyOfType } from "./types";
import { getOwnEnumerableNonNumericKeys } from "./objectKeysUtil";

/**
 * Use StrictEnumParam to define the type of a function
 * parameter that should be strictly assignable to a numeric enum
 * type. This prevents arbitrary numbers from being passed in to
 * the parameter, working around TypeScript's intentional decision
 * to allow type `number` to be assignable to all numeric enum types.
 *
 * Instead of writing a function signature as:
 *     function doSomething(value: MyEnum): void;
 *
 * Write it like this:
 *     function doSomething<Value extends MyEnum>(
 *         value: StrictEnumParam<MyEnum, Value>
 *     ): void;
 *
 * StrictEnumParam<MyEnum, Value> will evaluate to `never`
 * for any type `Value` that is not strictly assignable to `MyEnum`
 * (e.g., type `number`, or any number literal type that is not one
 * of the valid values for `MyEnum`), and will produce a compiler
 * error such as:
 *     "Argument of type `number` is not assignable to parameter of type `never`"
 *
 * LIMITATION:
 * This only works for a special subset of numeric enums that are considered
 * "Union Enums". For an enum to be compatible, it basically must be a simple
 * numeric enum where every member has either an inferred value
 * (previous enum member + 1), or a number literal (1, 42, -3, etc.).
 *
 * If the `Enum` type argument is not a "Union Enum", then this type resolves
 * to simply type `Enum` and the use of StrictEnumParam is neither
 * beneficial nor detrimental.
 */
export type StrictEnumParam<
    Enum extends number | string,
    Param extends Enum
> = true extends ({ [key: number]: false } & { [P in Enum]: true })[Extract<
    Enum,
    number
>]
    ? true extends ({ [key: number]: false } & { [P in Enum]: true })[Param]
        ? Param
        : never
    : Enum;

/**
 * Widens types that are assignable to number/string to the full number/string type.
 */
type Widen<T extends number | string> = T extends number
    ? number
    : T extends string
    ? string
    : T;

/**
 * A generic wrapper for any enum-like object.
 * Provides utilities for runtime processing of an enum's values and keys, with strict compile-time
 * type safety.
 *
 * EnumWrapper should generally not be directly instantiated.
 * Use {@link $enum} to get/create an EnumWrapper instance.
 *
 * @template E - The type of the enum-like object that is wrapped by the EnumWrapper..
 * @template V - The enum value type (always allow this to default!).
 *               NOTE: This template param shouldn't need to exist. It is a workaround
 *               to a TypeScript design limitation.
 *               See: https://github.com/microsoft/TypeScript/issues/35322#issuecomment-558247434
 */
export class EnumWrapper<
    E extends Record<StringKeyOf<E>, V>,
    V extends string | number = E[StringKeyOf<E>]
>
    implements
        Iterable<EnumWrapper.Entry<E, V>>,
        ArrayLike<EnumWrapper.Entry<E, V>> {
    /**
     * List of all keys for this enum, in the original defined order of the enum.
     */
    private readonly keysList: ReadonlyArray<StringKeyOf<E>>;

    /**
     * List of all values for this enum, in the original defined order of the enum.
     */
    private readonly valuesList: ReadonlyArray<V>;

    /**
     * The number of entries in this enum.
     * Part of the Map-like interface.
     */
    public readonly size: number;

    /**
     * The number of entries in this enum.
     * Part of the ArrayLike interface.
     */
    public readonly length: number;

    /**
     * Index signature.
     * Part of the ArrayLike interface.
     */
    readonly [key: number]: EnumWrapper.Entry<E, V>;

    /**
     * Create a new EnumWrapper instance.
     * This is for internal use only.
     * Use {@link $enum} to publicly get/create an EnumWrapper
     *
     * @param enumObj - An enum-like object.
     */
    public constructor(enumObj: E) {
        // Include only own enumerable keys that are not numeric.
        // This is necessary to ignore the reverse-lookup entries that are automatically added
        // by TypeScript to numeric enums.
        this.keysList = Object.freeze(getOwnEnumerableNonNumericKeys(enumObj));

        const length = this.keysList.length;
        const valuesList = new Array<V>(length);

        // According to multiple tests found on jsperf.com, a plain for loop is faster than using
        // Array.prototype.forEach
        for (let index = 0; index < length; ++index) {
            const key = this.keysList[index];
            const value = enumObj[key];

            valuesList[index] = value;
            // Type casting of "this" necessary to bypass readonly index signature for initialization.
            (this as any)[index] = Object.freeze([key, value]);
        }

        this.valuesList = Object.freeze(valuesList);
        this.size = this.length = length;

        // Make the EnumWrapper instance immutable
        Object.freeze(this);
    }

    /**
     * @return "[object EnumWrapper]"
     */
    public toString(): string {
        // NOTE: overriding toString in addition to Symbol.toStringTag
        //       for maximum compatibility with older runtime environments
        //       that do not implement Object.prototype.toString in terms
        //       of Symbol.toStringTag
        return "[object EnumWrapper]";
    }

    /**
     * Get an iterator for this enum's keys.
     * Iteration order is based on the original defined order of the enum.
     * Part of the Map-like interface.
     * @return An iterator that iterates over this enum's keys.
     */
    public keys(): IterableIterator<StringKeyOf<E>> {
        let index = 0;

        return {
            next: () => {
                const isDone = index >= this.length;
                const result: IteratorResult<StringKeyOf<E>> = {
                    done: isDone,
                    value: this.keysList[index]
                };

                ++index;

                return result;
            },

            [Symbol.iterator](): IterableIterator<StringKeyOf<E>> {
                return this;
            }
        };
    }

    /**
     * Get an iterator for this enum's values.
     * Iteration order is based on the original defined order of the enum.
     * Part of the Map-like interface.
     * NOTE: If there are duplicate values in the enum, then there will also be duplicate values
     *       in the result.
     * @return An iterator that iterates over this enum's values.
     */
    public readonly values: () => IterableIterator<V> =
        Symbol.iterator in Array.prototype
            ? () => this.valuesList[Symbol.iterator]()
            : () => {
                  let index = 0;

                  return {
                      next: () => {
                          const isDone = index >= this.length;
                          const result: IteratorResult<V> = {
                              done: isDone,
                              value: this.valuesList[index]
                          };

                          ++index;

                          return result;
                      },

                      [Symbol.iterator](): IterableIterator<V> {
                          return this;
                      }
                  };
              };

    /**
     * Get an iterator for this enum's entries as [key, value] tuples.
     * Iteration order is based on the original defined order of the enum.
     * @return An iterator that iterates over this enum's entries as [key, value] tuples.
     */
    public entries(): IterableIterator<EnumWrapper.Entry<E, V>> {
        let index = 0;

        return {
            next: () => {
                const isDone = index >= this.length;
                const result: IteratorResult<EnumWrapper.Entry<E, V>> = {
                    done: isDone,
                    // NOTE: defensive copy not necessary because entries are "frozen"
                    value: this[index]
                };

                ++index;

                return result;
            },

            [Symbol.iterator](): IterableIterator<EnumWrapper.Entry<E, V>> {
                return this;
            }
        };
    }

    /**
     * Get an iterator for this enum's entries as [key, value] tuples.
     * Iteration order is based on the original defined order of the enum.
     * @return An iterator that iterates over this enum's entries as [key, value] tuples.
     */
    public [Symbol.iterator](): IterableIterator<EnumWrapper.Entry<E, V>> {
        return this.entries();
    }

    /**
     * Calls the provided iteratee on each item in this enum.
     * Iteration order is based on the original defined order of the enum.
     * See {@link EnumWrapper.Iteratee} for the signature of the iteratee.
     * The return value of the iteratee is ignored.
     * @param iteratee - The iteratee.
     * @param context - If provided, then the iteratee will be called with the context as its "this" value.
     */
    public forEach(
        iteratee: EnumWrapper.Iteratee<void, E, V>,
        context?: any
    ): void {
        const length = this.length;

        // According to multiple tests found on jsperf.com, a plain for loop is faster than using
        // Array.prototype.forEach
        for (let index = 0; index < length; ++index) {
            const entry = this[index];
            iteratee.call(context, entry[1], entry[0], this, index);
        }
    }

    /**
     * Maps this enum's entries to a new list of values.
     * Iteration order is based on the original defined order of the enum.
     * Builds a new array containing the results of calling the provided iteratee on each item in this enum.
     * See {@link EnumWrapper.Iteratee} for the signature of the iteratee.
     * @param iteratee - The iteratee.
     * @param context - If provided, then the iteratee will be called with the context as its "this" value.
     * @return A new array containing the results of the iteratee.
     *
     * @template R - The of the mapped result for each entry.
     */
    public map<R>(iteratee: EnumWrapper.Iteratee<R, E, V>, context?: any): R[] {
        const length = this.length;
        const result = new Array<R>(length);

        // According to multiple tests found on jsperf.com, a plain for loop is faster than using Array.prototype.map
        for (let index = 0; index < length; ++index) {
            const entry = this[index];
            result[index] = iteratee.call(
                context,
                entry[1],
                entry[0],
                this,
                index
            );
        }

        return result;
    }

    /**
     * Get a list of this enum's keys.
     * Order of items in the list is based on the original defined order of the enum.
     * @return A list of this enum's keys.
     */
    public getKeys(): StringKeyOf<E>[] {
        // need to return a copy of this.keysList so it can be returned as Array instead of ReadonlyArray.
        return this.keysList.slice();
    }

    /**
     * Get a list of this enum's values.
     * Order of items in the list is based on the original defined order of the enum.
     * NOTE: If there are duplicate values in the enum, then there will also be duplicate values
     *       in the result.
     * @return A list of this enum's values.
     */
    public getValues(): V[] {
        // need to return a copy of this.valuesList so it can be returned as Array instead of ReadonlyArray.
        return this.valuesList.slice();
    }

    /**
     * Get a list of this enum's entries as [key, value] tuples.
     * Order of items in the list is based on the original defined order of the enum.
     * @return A list of this enum's entries as [key, value] tuples.
     */
    public getEntries(): EnumWrapper.Entry<E, V>[] {
        // Create an array from the indexed entries of "this".
        // NOTE: no need for defensive copy of each entry because all entries are "frozen".
        return Array.prototype.slice.call(this);
    }

    /**
     * Get the index of a key based on the original defined order of this enum.
     * @param key A valid key for this enum.
     * @return The index of the key based on the original defined order of this enum.
     */
    public indexOfKey(key: StringKeyOf<E>): number {
        return this.keysList.indexOf(key);
    }

    /**
     * Get the index of a value based on the original defined order of this enum.
     * @param value A valid value for this enum.
     * @return The index of the value based on the original defined order of this enum.
     */
    public indexOfValue<Value extends V>(
        value: StrictEnumParam<V, Value>
    ): number {
        return this.valuesList.indexOf(value);
    }

    /**
     * Tests if the provided string is actually a valid key for this enum
     * Acts as a type guard to confirm that the provided value is actually the enum key type.
     * @param key - A potential key value for this enum.
     * @return True if the provided key is a valid key for this enum.
     */
    public isKey(key: string | null | undefined): key is StringKeyOf<E> {
        return this.keysList.indexOf(key as StringKeyOf<E>) !== -1;
    }

    /**
     * Casts a string to a properly-typed key for this enum.
     * Throws an error if the key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     * @throws {Error} if the provided string is not a valid key for this enum.
     */
    public asKeyOrThrow(key: string | null | undefined): StringKeyOf<E> {
        if (this.isKey(key)) {
            return key;
        } else {
            throw new Error(
                `Unexpected key: ${key}. Expected one of: ${this.getValues()}`
            );
        }
    }

    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @param defaultKey - The key to be returned if the provided key is invalid.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     * @throws {Error} if `defaultKey` is not a valid key for this enum.
     */
    public asKeyOrDefault(
        key: string | null | undefined,
        defaultKey: StringKeyOf<E>
    ): StringKeyOf<E>;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @param defaultKey - The key to be returned if the provided key is invalid.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     * @throws {Error} if `defaultKey` is not a valid key for this enum.
     */
    public asKeyOrDefault(
        key: string | null | undefined,
        defaultKey?: StringKeyOf<E>
    ): StringKeyOf<E> | undefined;
    public asKeyOrDefault(
        key: string | null | undefined,
        defaultKey?: StringKeyOf<E>
    ): StringKeyOf<E> | undefined {
        const verifiedDefaultKey =
            defaultKey != null ? this.asKeyOrThrow(defaultKey) : undefined;

        if (this.isKey(key)) {
            return key;
        } else {
            return verifiedDefaultKey;
        }
    }

    /**
     * Tests if the provided value is a valid value for this enum.
     * Acts as a type guard to confirm that the provided value is actually the enum value type.
     * @param value - A potential value for this enum.
     * @return True if the provided value is valid for this enum.
     */
    // HACK: The intersection in "value is Widen<V> & V" is a work around for a TS limitation.
    //       See: https://github.com/microsoft/TypeScript/issues/35257#issuecomment-557100788
    public isValue(
        value: Widen<V> | V | null | undefined
    ): value is Widen<V> & V {
        return this.valuesList.indexOf(value as V) !== -1;
    }

    /**
     * Casts a value to a properly-typed value for this enum.
     * Throws an error if the value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     * @throws {Error} if the provided value is not a valid value for this enum.
     */
    public asValueOrThrow(value: Widen<V> | V | null | undefined): V {
        if (this.isValue(value)) {
            return value;
        } else {
            throw new Error(
                `Unexpected value: ${value}. Expected one of: ${this.getValues()}`
            );
        }
    }

    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @param defaultValue - The value to be returned if the provided value is invalid.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     * @throws {Error} if `defaultValue` is not a valid value for this enum.
     */
    public asValueOrDefault<DefaultValue extends V>(
        value: Widen<V> | V | null | undefined,
        defaultValue: StrictEnumParam<V, DefaultValue>
    ): V;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @param defaultValue - The value to be returned if the provided value is invalid.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     * @throws {Error} if `defaultValue` is not a valid value for this enum.
     */
    public asValueOrDefault<DefaultValue extends V>(
        value: Widen<V> | V | null | undefined,
        defaultValue?: StrictEnumParam<V, DefaultValue>
    ): V | undefined;
    public asValueOrDefault(value: Widen<V>, defaultValue?: V): V | undefined {
        const verifiedDefaultValue =
            defaultValue != null
                ? this.asValueOrThrow(defaultValue)
                : undefined;

        if (this.isValue(value)) {
            return value;
        } else {
            return verifiedDefaultValue;
        }
    }

    /**
     * Performs a strict reverse lookup from enum value to corresponding enum key.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid value that is
     * guaranteed to return a valid key.
     * NOTE: If this enum has any duplicate values, then one of the keys for the
     *       duplicated value is arbitrarily returned.
     * @param value - A valid value for this enum.
     * @return The key for the provided value.
     * @throws {Error} if the provided value is not valid for this enum.
     */
    public getKey<Value extends V>(
        value: Value & StrictEnumParam<V, Value>
    ): StringKeyOfType<E, Value>;
    /**
     * Performs a strict reverse lookup from enum value to corresponding enum key,
     * with a default key to be returned if the provided value is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid value that is
     * guaranteed to return a valid key.
     * NOTE: If this enum has any duplicate values, then one of the keys for the
     *       duplicated value is arbitrarily returned.
     * @param value - A valid value for this enum (or null/undefined).
     * @param defaultKey - A valid key to be returned if the provided value is null/undefined.
     * @return The key for the provided value, or the default key.
     * @throws {Error} if the provided value or default key is not valid for this enum.
     */
    public getKey<Value extends V, DefaultKey extends StringKeyOf<E>>(
        value: (Value & StrictEnumParam<V, Value>) | null | undefined,
        defaultKey: DefaultKey
    ): StringKeyOfType<E, Value> | DefaultKey;
    /**
     * Performs a strict reverse lookup from enum value to corresponding enum key.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid value that is
     * guaranteed to return a valid key.
     * NOTE: If this enum has any duplicate values, then one of the keys for the
     *       duplicated value is arbitrarily returned.
     * @param value - A valid value for this enum.
     * @return The key for the provided value.
     * @throws {Error} if the provided value is not valid for this enum.
     */
    public getKey<Value extends V>(
        value: (Value & StrictEnumParam<V, Value>) | null | undefined
    ): StringKeyOfType<E, Value> | undefined;
    /**
     * Performs a strict reverse lookup from enum value to corresponding enum key,
     * with a default key to be returned if the provided value is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid value that is
     * guaranteed to return a valid key.
     * NOTE: If this enum has any duplicate values, then one of the keys for the
     *       duplicated value is arbitrarily returned.
     * @param value - A valid value for this enum (or null/undefined).
     * @param defaultKey - A valid key to be returned if the provided value is null/undefined.
     * @return The key for the provided value, or the default key.
     * @throws {Error} if the provided value or default key is not valid for this enum.
     */
    public getKey<Value extends V>(
        value: (Value & StrictEnumParam<V, Value>) | null | undefined,
        // tslint:disable-next-line:unified-signatures
        defaultKey: undefined
    ): StringKeyOfType<E, Value> | undefined;
    /**
     * Performs a strict reverse lookup from enum value to corresponding enum key,
     * with a default key to be returned if the provided value is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid value that is
     * guaranteed to return a valid key.
     * NOTE: If this enum has any duplicate values, then one of the keys for the
     *       duplicated value is arbitrarily returned.
     * @param value - A valid value for this enum (or null/undefined).
     * @param defaultKey - A valid key to be returned if the provided value is null/undefined.
     * @return The key for the provided value, or the default key.
     * @throws {Error} if the provided value or default key is not valid for this enum.
     */
    public getKey<Value extends V, DefaultKey extends StringKeyOf<E>>(
        value: (Value & StrictEnumParam<V, Value>) | null | undefined,
        defaultKey?: DefaultKey
    ): StringKeyOfType<E, Value> | DefaultKey | undefined;
    public getKey(
        value: V | null | undefined,
        defaultKey?: StringKeyOf<E>
    ): StringKeyOf<E> | undefined {
        const verifiedDefaultKey =
            defaultKey != null ? this.asKeyOrThrow(defaultKey) : undefined;

        if (value == null) {
            return verifiedDefaultKey;
        }

        const index = this.valuesList.indexOf(value);

        if (index !== -1) {
            return this.keysList[index];
        } else {
            throw new Error(
                `Unexpected value: ${value}. Expected one of: ${this.getValues()}`
            );
        }
    }

    /**
     * Performs a strict lookup of enum value by key.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid key that is
     * guaranteed to return a valid value.
     * @param key - A valid key for this enum.
     * @return The value for the provided key.
     * @throws {Error} if the provided key is invalid for this enum.
     */
    public getValue<K extends StringKeyOf<E>>(key: K): E[K];
    /**
     * Performs a strict lookup of enum value by key, with a default value
     * returned if the provided key is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid key that is
     * guaranteed to return a valid value.
     * Throws an error if the provided key is invalid.
     * @param key - A valid key for this enum (or null/undefined).
     * @param defaultValue - A valid value to be returned if the key is null/undefined.
     * @return The value for the provided key, or the default value.
     * @throws {Error} if the provided key is invalid for this enum.
     */
    public getValue<K extends StringKeyOf<E>, DefaultValue extends V>(
        key: K | null | undefined,
        defaultValue: DefaultValue & StrictEnumParam<V, DefaultValue>
    ): E[K] | DefaultValue;
    /**
     * Performs a strict lookup of enum value by key, with a default value
     * returned if the provided key is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid key that is
     * guaranteed to return a valid value.
     * Throws an error if the provided key is non-null and invalid.
     * @param key - A valid key for this enum (or null/undefined).
     * @return The value for the provided key, or undefined.
     * @throws {Error} if the provided key is invalid for this enum.
     */
    public getValue<K extends StringKeyOf<E>>(
        key: K | null | undefined
    ): E[K] | undefined;
    /**
     * Performs a strict lookup of enum value by key, with a default value
     * returned if the provided key is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid key that is
     * guaranteed to return a valid value.
     * Throws an error if the provided key is invalid.
     * @param key - A valid key for this enum (or null/undefined).
     * @param defaultValue - A valid value to be returned if the key is null/undefined.
     * @return The value for the provided key, or the default value.
     * @throws {Error} if the provided key is invalid for this enum.
     */
    public getValue<K extends StringKeyOf<E>>(
        key: K | null | undefined,
        // tslint:disable-next-line:unified-signatures
        defaultValue: undefined
    ): E[K] | undefined;
    /**
     * Performs a strict lookup of enum value by key, with a default value
     * returned if the provided key is null/undefined.
     * This method is as strict as possible with compile-time types and run-time
     * validation for a lookup based on a (expected to be) valid key that is
     * guaranteed to return a valid value.
     * Throws an error if the provided key is invalid.
     * @param key - A valid key for this enum (or null/undefined).
     * @param defaultValue - A valid value to be returned if the key is null/undefined.
     * @return The value for the provided key, or the default value.
     * @throws {Error} if the provided key is invalid for this enum.
     */
    public getValue<K extends StringKeyOf<E>, DefaultValue extends V>(
        key: K | null | undefined,
        defaultValue?: DefaultValue & StrictEnumParam<V, DefaultValue>
    ): E[K] | DefaultValue | undefined;
    public getValue(
        key: StringKeyOf<E> | null | undefined,
        defaultValue?: V
    ): V | undefined {
        const verifiedDefaultValue =
            defaultValue != null
                ? this.asValueOrThrow(defaultValue)
                : undefined;

        if (key == null) {
            return verifiedDefaultValue;
        }

        const index = this.keysList.indexOf(key);

        if (index !== -1) {
            return this.valuesList[index];
        } else {
            throw new Error(
                `Unexpected key: ${key}. Expected one of: ${this.getKeys()}`
            );
        }
    }
}

// HACK: Forcefully overriding the value of the [Symbol.toStringTag] property.
//       This was originally implemented in the class as recommended by MDN
//       Symbol.toStringTag documentation:
//           public get [Symbol.toStringTag](): string { return "EnumWrapper"; }
//
//       However, after upgrading to TypeScript 3.7, this caused compiler errors
//       when running dtslint due to the getter being emitted to the .d.ts file,
//       but TSC complaining that getters aren't allowed in "ambient" contexts.
//       This seems to be realated to a known breaking change:
//           https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#class-field-mitigations
//
//       To avoid requiring TypeScript 3.6+ to use ts-enum-util, I no longer
//       implement the getter on the class and instead simply set the value of
//       the [Symbol.toStringTag] property on the class prototype to the desired
//       string.
//
//       I also tried implementing it as:
//           public readonly [Symbol.toStringTag] = "EnumWrapper";
//       But this got emitted to the .d.ts file with the initializer,
//       causing a compiler time error about initializers not allowed in an
//       "ambient" context. So I had to omit the declaration of the
//       [Symbol.toStringTag] in the class declaration and hackishly set its
//       value here (not important to have it part of the class declaration
//       as long as the value exists at runtime).
(EnumWrapper.prototype as any)[Symbol.toStringTag] = "EnumWrapper";

export namespace EnumWrapper {
    /**
     * A tuple containing the key and value of a single entry in an enum.
     *
     * @template E - The type of the enum-like object that is wrapped by the EnumWrapper..
     * @template V - The enum value type (always allow this to default!).
     *               NOTE: This template param shouldn't need to exist. It is a workaround
     *               to a TypeScript design limitation.
     *               See: https://github.com/microsoft/TypeScript/issues/35322#issuecomment-558247434
     */
    export type Entry<
        E extends Record<StringKeyOf<E>, V>,
        V extends number | string = E[StringKeyOf<E>]
    > = Readonly<[StringKeyOf<E>, V]>;

    export namespace Entry {
        /**
         * Helper type for defining a generalized EnumWrapper.Entry type for any kind
         * of enum whose values are assignable to type T.
         *
         * Example:
         *     // Function that works with an EnumWrapper.Entry for any numeric enum
         *     function foo(entry: EnumWrapper.Entry.OfType<number>): void;
         */
        // tslint:disable-next-line:no-shadowed-variable
        export type OfType<T extends number | string> = Entry<
            EnumWrapper.OfType<T>
        >;
    }

    /**
     * A function used in iterating all key/value entries in an enum.
     * @param value - An enum value.
     * @param key - An enum key.
     * @param enumWrapper - The EnumWrapper instance being iterated..
     * @param index - The index of the enum entry, based on the original defined order of the enum.
     * @return A result. The significance of the result depends on the type of iteration being performed.
     *
     * @template R - The type of the result.
     * @template E - The type of the enum-like object that is wrapped by the EnumWrapper..
     * @template V - The enum value type (always allow this to default!).
     *               NOTE: This template param shouldn't need to exist. It is a workaround
     *               to a TypeScript design limitation.
     *               See: https://github.com/microsoft/TypeScript/issues/35322#issuecomment-558247434
     */
    export type Iteratee<
        R,
        E extends Record<StringKeyOf<E>, V>,
        V extends number | string = E[StringKeyOf<E>]
    > = (
        this: any,
        value: V,
        key: StringKeyOf<E>,
        enumWrapper: EnumWrapper<E, V>,
        index: number
    ) => R;

    export namespace Iteratee {
        /**
         * Helper type for defining a generalized EnumWrapper.Iteratee type that
         * returns type R for any kind of enum whose values are assignable to type T.
         *
         * Example:
         *     // Function that works with an EnumWrapper.Iteratee for any numeric enum
         *     // and returns a boolean value.
         *     function foo(iteratee: EnumWrapper.Entry.OfType<boolean, number>): void;
         */
        // tslint:disable-next-line:no-shadowed-variable
        export type OfType<
            R,
            T extends number | string = number | string
        > = Iteratee<R, EnumWrapper.OfType<T>>;
    }

    /**
     * Helper type for defining a generalized EnumWrapper type for any kind
     * of enum whose values are assignable to type T.
     *
     * Example:
     *     // Function that works with an EnumWrapper for any numeric enum
     *     function foo(enumWrapper: EnumWrapper.OfType<number>): void;
     */
    export type OfType<T extends number | string> = EnumWrapper<
        Record<string, T>
    >;
}
