/**
 * Used internally to verify that some type is enum-like.
 * A type is enum-like if all its properties are of type number or string.
 * @template V - Type of the enum value.
 * @template K - String literal union of all keys of the enum-like type.
 */
export type EnumLike<V extends number | string, K extends string> = {
    [P in K]: V;
};

/**
 * A generic wrapper for any enum-like value (see {@link EnumLike} type for more explanation).
 * Provides utilities for runtime processing of an enum's values and keys, with strict compile-time
 * type safety.
 *
 * EnumWrapper cannot be directly instantiated. Use one of the following to get/create an EnumWrapper
 * instance:
 * - {@link $enum}
 * - {@link EnumWrapper.getCachedInstance}
 * - {@link EnumWrapper.createUncachedInstance}
 *
 * @template V - Type of the enum value.
 * @template T - Type of the enum-like object that is being wrapped.
 */
export class EnumWrapper<
    V extends number | string = number | string,
    T extends EnumLike<V, keyof T> = any
> implements Iterable<EnumWrapper.Entry<T>> {
    /**
     * Map of enum object -> EnumWrapper instance.
     * Used as a cache for {@link EnumWrapper.getCachedInstance}.
     */
    private static readonly instancesCache = new Map<object, EnumWrapper>();

    /**
     * Set of all keys for this enum.
     */
    private readonly keySet: Set<keyof T>;

    /**
     * Set of all values for this enum.
     */
    private readonly valueSet = new Set<T[keyof T]>();

    /**
     * Map of enum value -> enum key.
     * Used for reverse key lookups.
     */
    private readonly keysByValueMap = new Map<V, keyof T>();

    /**
     * Creates a new EnumWrapper for an enum-like object with number values.
     * You probably want to use {@link EnumWrapper.getCachedInstance} for typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/transient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object with number values.
     * @return A new instance of EnumWrapper for the provided enumObj.
     *
     * @template T - Type of the enum-like object that is being wrapped.
     */
    public static createUncachedInstance<T extends EnumLike<number, keyof T>>(
        enumObj: T
    ): EnumWrapper<number, T>;
    /**
     * Creates a new EnumWrapper for an enum-like object with string values.
     * You probably want to use {@link EnumWrapper.getCachedInstance} for typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/transient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object with string values.
     * @return A new instance of EnumWrapper for the provided enumObj.
     *
     * @template T - Type of the enum-like object that is being wrapped.
     */
    public static createUncachedInstance<T extends EnumLike<string, keyof T>>(
        enumObj: T
    ): EnumWrapper<string, T>;
    /**
     * Creates a new EnumWrapper for an enum-like object with a mix of number and string values.
     * You probably want to use {@link EnumWrapper.getCachedInstance} for typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/transient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object with a mix of number and string values.
     * @return A new instance of EnumWrapper for the provided enumObj.
     *
     * @template T - Type of the enum-like object that is being wrapped.
     */
    public static createUncachedInstance<T extends EnumLike<number | string, keyof T>>(
        enumObj: T
    ): EnumWrapper<number | string, T>;
    /**
     * Creates a new EnumWrapper for an enum-like object.
     * You probably want to use {@link EnumWrapper.getCachedInstance} for typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/transient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object.
     * @return A new instance of EnumWrapper for the provided enumObj.
     */
    public static createUncachedInstance(enumObj: any): EnumWrapper {
        return new EnumWrapper(enumObj);
    }

    /**
     * Gets a cached EnumWrapper for an enum-like object with number values.
     * Creates and caches a new EnumWrapper if one is not already cached.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every subsequent call to get() for the same enum object.
     * Use {@link EnumWrapper.createUncachedInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object with number values.
     * @return An instance of EnumWrapper for the provided enumObj.
     *
     * @template T - Type of the enum-like object that is being wrapped.
     */
    public static getCachedInstance<T extends EnumLike<number, keyof T>>(
        enumObj: T
    ): EnumWrapper<number, T>;
    /**
     * Gets a cached EnumWrapper for an enum-like object with string values.
     * Creates and caches a new EnumWrapper if one is not already cached.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every subsequent call to get() for the same enum object.
     * Use {@link EnumWrapper.createUncachedInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object with string values.
     * @return An instance of EnumWrapper for the provided enumObj.
     *
     * @template T - Type of the enum-like object that is being wrapped.
     */
    public static getCachedInstance<T extends EnumLike<string, keyof T>>(
        enumObj: T
    ): EnumWrapper<string, T>;
    /**
     * Gets a cached EnumWrapper for an enum-like object with a mixture of number and string values.
     * Creates and caches a new EnumWrapper if one is not already cached.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every subsequent call to get() for the same enum object.
     * Use {@link EnumWrapper.createUncachedInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object with a mixture of number and string values.
     * @return An instance of EnumWrapper for the provided enumObj.
     *
     * @template T - Type of the enum-like object that is being wrapped.
     */
    public static getCachedInstance<T extends EnumLike<number | string, keyof T>>(
        enumObj: T
    ): EnumWrapper<number | string, T>;
    /**
     * Gets a cached EnumWrapper for an enum-like object.
     * Creates and caches a new EnumWrapper if one is not already cached.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every subsequent call to get() for the same enum object.
     * Use {@link EnumWrapper.createUncachedInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object.
     * @return An instance of EnumWrapper for the provided enumObj.
     */
    public static getCachedInstance(enumObj: any): EnumWrapper {
        let result = this.instancesCache.get(enumObj);

        if (!result) {
            result = this.createUncachedInstance(enumObj);
            this.instancesCache.set(enumObj, result);
        }

        return result;
    }

    /**
     * Create a new EnumWrapper instance.
     * This is for internal use only.
     * Use one of the following to publicly get/create an EnumWrapper
     * instance:
     * - {@link EnumWrapper.getCachedInstance}
     * - {@link EnumWrapper.createUncachedInstance}
     *
     * @param enumObj - An enum-like object. See the {@link EnumLike} type for more explanation.
     */
    private constructor(private readonly enumObj: T) {
        this.keySet = new Set<keyof T>(
            Object.keys(enumObj).filter(
                // Need to include only keys that cannot be parsed as numbers.
                // This is necessary to ignore the reverse-lookup entries that are automatically added
                // to numeric enums.
                (key) => isNaN(parseInt(key, 10))
            )
        );

        this.keySet.forEach((key) => {
            const value = enumObj[key];
            this.valueSet.add(value);
            this.keysByValueMap.set(value, key);
        });
    }

    /**
     * @return "[object EnumWrapper]"
     */
    public toString(): string {
        return "[object EnumWrapper]";
    }

    /**
     * The number of entries in this enum.
     */
    public get size(): number {
        return this.keySet.size;
    }

    /**
     * Gets the enum value for the provided key.
     * Returns undefined if the provided key is invalid.
     * This is an alias for {@link EnumWrapper#getValueOrDefault} for the purpose
     * of implementing a Map-like interface.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns undefined if the provided key is invalid.
     */
    public get(key: string): T[keyof T] | undefined {
        return this.getValueOrDefault(key, undefined);
    }

    /**
     * Tests if the provided string is actually a valid key for this enum
     * Acts as a type guard to confirm that the provided value is actually the enum key type.
     * This is an alias for {@link EnumWrapper#isKey} for the purpose
     * of implementing a Map-like interface.
     * @param key - A potential key value for this enum.
     * @return True if the provided key is a valid key for this enum.
     */
    public has(key: string): key is keyof T {
        return this.isKey(key);
    }

    /**
     * Get an iterator for this enum's keys.
     * @return An iterator that iterates over this enum's keys.
     */
    public keys(): IterableIterator<keyof T> {
        return this.keySet.values();
    }

    /**
     * Get an iterator for this enum's values.
     * NOTE: If this enum has any duplicate values, only unique values will be iterated, and the
     *       number of values iterated will be less than {@link EnumWrapper#size}.
     * @return An iterator that iterates over this enum's values.
     */
    public values(): IterableIterator<T[keyof T]> {
        return this.valueSet.values();
    }

    /**
     * Get an iterator for this enum's entries as [key, value] tuples.
     * @return An iterator that iterates over this enum's entries as [key, value] tuples.
     */
    public entries(): IterableIterator<EnumWrapper.Entry<T>> {
        const keyIterator = this.keys();

        return {
            next: (): IteratorResult<EnumWrapper.Entry<T>> => {
                const nextKey = keyIterator.next();

                return {
                    done: nextKey.done,
                    // "as any" cast is necessary to work around this bug:
                    // https://github.com/Microsoft/TypeScript/issues/11375
                    value: nextKey.done ? undefined as any : [nextKey.value, this.enumObj[nextKey.value]]
                };
            },

            [Symbol.iterator]: function(): IterableIterator<EnumWrapper.Entry<T>> {
                return this;
            }
        };
    }

    /**
     * Get an iterator for this enum's entries as [key, value] tuples.
     * @return An iterator that iterates over this enum's entries as [key, value] tuples.
     */
    public [Symbol.iterator](): IterableIterator<EnumWrapper.Entry<T>> {
        return this.entries();
    }

    /**
     * Calls the provided iteratee on each item in this enum.
     * See {@link EnumWrapper.Iteratee} for the signature of the iteratee.
     * The return value of the iteratee is ignored.
     * @param iteratee - The iteratee.
     * @param context - If provided, then the iteratee will be called with the context as its "this" value.
     */
    public forEach(iteratee: EnumWrapper.Iteratee<V, T, void>, context?: any): void {
        this.keySet.forEach((key) => {
            iteratee.call(context, this.enumObj[key], key, this.enumObj);
        });
    }

    /**
     * Maps this enum's entries to a new list of values.
     * Builds a new array containing the results of calling the provided iteratee on each item in this enum.
     * See {@link EnumWrapper.Iteratee} for the signature of the iteratee.
     * @param iteratee - The iteratee.
     * @param context - If provided, then the iteratee will be called with the context as its "this" value.
     * @return A new array containg the results of the iteratee.
     *
     * @template R - The of the mapped result for each entry.
     */
    public map<R>(iteratee: EnumWrapper.Iteratee<V, T, R>, context?: any): R[] {
        const result: R[] = [];

        this.keySet.forEach((key) => {
            result.push(iteratee.call(context, this.enumObj[key], key, this.enumObj));
        });

        return result;
    }

    /**
     * Get a list of this enum's keys.
     * @return A list of this enum's keys.
     */
    public getKeys(): (keyof T)[] {
        return Array.from(this.keySet.values());
    }

    /**
     * Get a list of this enum's values.
     * NOTE: If this enum has any duplicate values, only unique values will be returned, and the
     *       length of the list will be less than {@link EnumWrapper#size}.
     * @return A list of this enum's values.
     */
    public getValues(): T[keyof T][] {
        return Array.from(this.valueSet.values());
    }

    /**
     * Get a list of this enum's entries as [key, value] tuples.
     * @return A list of this enum's entries as [key, value] tuples.
     */
    public getEntries(): EnumWrapper.Entry<T>[] {
        return Array.from(this);
    }

    /**
     * Tests if the provided string is actually a valid key for this enum
     * Acts as a type guard to confirm that the provided value is actually the enum key type.
     * @param key - A potential key value for this enum.
     * @return True if the provided key is a valid key for this enum.
     */
    public isKey(key: string): key is keyof T {
        return this.keySet.has(key);
    }

    /**
     * Casts a string to a properly-typed key for this enum.
     * Throws an error if the key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     * @throws {Error} if the provided string is not a valid key for this enum.
     */
    public asKey(key: string): keyof T {
        if (this.isKey(key)) {
            return key;
        } else {
            throw new Error(`Unexpected key: ${key}. Expected one of: ${Array.from(this.keySet)}`);
        }
    }

    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string, defaultKey?: keyof T): keyof T | undefined;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string, defaultKey: keyof T): keyof T;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string, defaultKey: string): keyof T | string;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string, defaultKey: string | undefined): keyof T | string | undefined;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string, defaultKey?: keyof T | string): keyof T | string | undefined {
        if (this.isKey(key)) {
            return key;
        } else {
            return defaultKey;
        }
    }

    /**
     * Tests if the provided value is a valid value for this enum.
     * Acts as a type guard to confirm that the provided value is actually the enum value type.
     * @param value - A potential value for this enum.
     * @return True if the provided value is valid for this enum.
     */
    public isValue(value: V): value is T[keyof T] {
        return value !== undefined && this.valueSet.has(value);
    }

    /**
     * Casts a value to a properly-typed value for this enum.
     * Throws an error if the value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     * @throws {Error} if the provided value is not a valid value for this enum.
     */
    public asValue(value: V): T[keyof T] {
        if (this.isValue(value)) {
            return value;
        } else {
            throw new Error(`Unexpected value: ${value}. Expected one of: ${Array.from(this.valueSet)}`);
        }
    }

    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V, defaultValue: T[keyof T]): T[keyof T];
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V, defaultValue: V): T[keyof T] | V;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V, defaultValue: V | undefined): T[keyof T] | V | undefined;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V, defaultValue?: T[keyof T] | V): T[keyof T] | V | undefined {
        if (this.isValue(value)) {
            return value;
        } else {
            return defaultValue;
        }
    }

    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Throws an error if the value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     * @throws {Error} if the provided value is not a valid value for this enum.
     */
    public getKey(value: V): keyof T {
        return this.keysByValueMap.get(this.asValue(value));
    }

    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V, defaultKey: keyof T): keyof T;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V, defaultKey?: keyof T): keyof T | undefined;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V, defaultKey: string): keyof T | string;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V, defaultKey: string | undefined): keyof T | string | undefined;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V, defaultKey?: keyof T | string): keyof T | string | undefined {
        if (this.isValue(value)) {
            return this.keysByValueMap.get(value);
        } else {
            return defaultKey;
        }
    }

    /**
     * Gets the enum value for the provided key.
     * Throws an error if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     * @throws {Error} if the provided string is not a valid key for this enum.
     */
    public getValue(key: string): T[keyof T] {
        return this.enumObj[this.asKey(key)];
    }

    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string, defaultValue: T[keyof T]): T[keyof T];
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string, defaultValue: V): T[keyof T] | V;
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string, defaultValue: V | undefined): T[keyof T] | V | undefined;
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string, defaultValue?: T[keyof T] | V): T[keyof T] | V | undefined {
        if (this.isKey(key)) {
            return this.enumObj[key];
        } else {
            return defaultValue;
        }
    }
}

export namespace EnumWrapper {
    /**
     * A tuple containing the key and value of a single entry in an enum.
     * @template T - Type of an enum-like object.
     */
    export type Entry<T> = [
        keyof T,
        T[keyof T]
    ];

    /**
     * A function used in iterating all key/value entries in an enum.
     * @param value - An enum value.
     * @param key - An enum key.
     * @param enumObj - The enum-like object that the key/value entrie belongs to.
     * @return A result. The significance of the result depends on the type of iteration being performed.
     *
     * @template V - Type of the enum value.
     * @template T - Type of the enum-like object that is being wrapped.
     * @template R - The type of the result.
     */
    export type Iteratee<
        V extends number | string,
        T extends EnumLike<V, keyof T>,
        R
    > = (this: any, value: V, key: keyof T, enumObj: T) => R;
}

/**
 * Convenience function for getting/creating an {@link EnumWrapper} instance.
 * This is a short-hand way of calling {@link EnumWrapper.getCachedInstance}.
 * or {@link EnumWrapper.createUnachedInstance}.
 * @param enumObj - An enum-like object with number values.
 * @param useCache - If true, then a cached instance is created and/or returned.
 * @return A new or cached instance of EnumWrapper for the provided enumObj.
 *
 * @template T - Type of the enum-like object that is being wrapped.
 */
export function $enum<T extends EnumLike<number, keyof T>>(
    enumObj: T, useCache?: boolean
): EnumWrapper<number, T>;
/**
 * Convenience function for getting/creating an {@link EnumWrapper} instance.
 * This is a short-hand way of calling {@link EnumWrapper.getCachedInstance}.
 * or {@link EnumWrapper.createUnachedInstance}.
 * @param enumObj - An enum-like object with string values.
 * @param useCache - If true, then a cached instance is created and/or returned.
 * @return A new or cached instance of EnumWrapper for the provided enumObj.
 *
 * @template T - Type of the enum-like object that is being wrapped.
 */
export function $enum<T extends EnumLike<string, keyof T>>(
    enumObj: T, useCache?: boolean
): EnumWrapper<string, T>;
/**
 * Convenience function for getting/creating an {@link EnumWrapper} instance.
 * This is a short-hand way of calling {@link EnumWrapper.getCachedInstance}.
 * or {@link EnumWrapper.createUnachedInstance}.
 * @param enumObj - An enum-like object with a mixture of number and string values.
 * @param useCache - If true, then a cached instance is created and/or returned.
 * @return A new or cached instance of EnumWrapper for the provided enumObj.
 *
 * @template T - Type of the enum-like object that is being wrapped.
 */
export function $enum<T extends EnumLike<number | string, keyof T>>(
    enumObj: T, useCache?: boolean
): EnumWrapper<number | string, T>;
/**
 * Convenience function for getting/creating an {@link EnumWrapper} instance.
 * This is a short-hand way of calling {@link EnumWrapper.getCachedInstance}.
 * or {@link EnumWrapper.createUnachedInstance}.
 * @param enumObj - An enum-like object.
 * @param useCache - If true, then a cached instance is created and/or returned.
 * @return A new or cached instance of EnumWrapper for the provided enumObj.
 */
export function $enum(enumObj: any, useCache: boolean = true): EnumWrapper {
    if (useCache) {
        return EnumWrapper.getCachedInstance(enumObj);
    } else {
        return EnumWrapper.createUncachedInstance(enumObj);
    }
}
