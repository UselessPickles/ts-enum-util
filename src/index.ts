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
 * A generic wrapper for any enum-like object (see {@link EnumLike}).
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
> implements Iterable<EnumWrapper.Entry<V, T>>, ArrayLike<Readonly<EnumWrapper.Entry<V, T>>> {
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
     * Map of enum value -> enum key.
     * Used for reverse key lookups.
     */
    private readonly keysByValueMap = new Map<V, keyof T>();

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
    readonly [key: number]: EnumWrapper.Entry<V, T>;

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
            Object.keys(enumObj)
                // Exclude integer indexes.
                // This is necessary to ignore the reverse-lookup entries that are automatically added
                // by TypeScript to numeric enums.
                .filter(
                    (key) => !isIntegerIndex(key)
                )
                // Order of Object.keys() is implementation-dependent, so sort the keys to guarantee
                // a consistent order for iteration.
                .sort()
        );

        let index = 0;
        this.keySet.forEach((key) => {
            const value = enumObj[key];
            this.keysByValueMap.set(value, key);
            (this as any as EnumWrapper.Entry<V, T>[])[index] = [key, value];
            ++index;
        });

        this.size = this.length = this.keySet.size;
    }

    /**
     * @return "[object EnumWrapper]"
     */
    public toString(): string {
        return "[object EnumWrapper]";
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
    public get(key: string | null | undefined): T[keyof T] | undefined {
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
    public has(key: string | null | undefined): key is keyof T {
        return this.isKey(key);
    }

    /**
     * Get an iterator for this enum's keys.
     * Iteration order is based on sorted order of keys.
     * Part of the Map-like interface.
     * @return An iterator that iterates over this enum's keys.
     */
    public keys(): IterableIterator<keyof T> {
        return this.keySet.values();
    }

    /**
     * Get an iterator for this enum's values.
     * Iteration order is based on sorted order of keys.
     * Part of the Map-like interface.
     * NOTE: If there are duplicate values in the enum, then there will also be duplicate values
     *       in the result.
     * @return An iterator that iterates over this enum's values.
     */
    public values(): IterableIterator<T[keyof T]> {
        let index = 0;

        return {
            next: (): IteratorResult<T[keyof T]> => {
                const result = {
                    done: index >= this.length,
                    value: this[index] && this[index][1]
                };

                ++index;

                return result;
            },

            [Symbol.iterator](): IterableIterator<T[keyof T]> {
                return this;
            }
        };
    }

    /**
     * Get an iterator for this enum's entries as [key, value] tuples.
     * Iteration order is based on sorted order of keys.
     * @return An iterator that iterates over this enum's entries as [key, value] tuples.
     */
    public entries(): IterableIterator<EnumWrapper.Entry<V, T>> {
        let index = 0;

        return {
            next: () => {
                const isDone = index >= this.length;
                const entry = this[index];

                const result: IteratorResult<EnumWrapper.Entry<V, T>> = {
                    done: isDone,
                    // "as any" cast is necessary to work around this bug:
                    // https://github.com/Microsoft/TypeScript/issues/11375
                    // Creating a defensive copy of the entry
                    value: isDone ? undefined as any : [entry[0], entry[1]]
                };

                ++index;

                return result;
            },

            [Symbol.iterator](): IterableIterator<EnumWrapper.Entry<V, T>> {
                return this;
            }
        };
    }

    /**
     * Get an iterator for this enum's entries as [key, value] tuples.
     * Iteration order is based on sorted order of keys.
     * @return An iterator that iterates over this enum's entries as [key, value] tuples.
     */
    public [Symbol.iterator](): IterableIterator<EnumWrapper.Entry<V, T>> {
        return this.entries();
    }

    /**
     * Calls the provided iteratee on each item in this enum.
     * Iteration order is based on sorted order of keys.
     * See {@link EnumWrapper.Iteratee} for the signature of the iteratee.
     * The return value of the iteratee is ignored.
     * @param iteratee - The iteratee.
     * @param context - If provided, then the iteratee will be called with the context as its "this" value.
     */
    public forEach(iteratee: EnumWrapper.Iteratee<void, V, T>, context?: any): void {
        Array.prototype.forEach.call(
            this,
            (entry: EnumWrapper.Entry<V, T>, index: number): void => {
                iteratee.call(context, entry[1], entry[0], this.enumObj);
            }
        );
    }

    /**
     * Maps this enum's entries to a new list of values.
     * Iteration order is based on sorted order of keys.
     * Builds a new array containing the results of calling the provided iteratee on each item in this enum.
     * See {@link EnumWrapper.Iteratee} for the signature of the iteratee.
     * @param iteratee - The iteratee.
     * @param context - If provided, then the iteratee will be called with the context as its "this" value.
     * @return A new array containg the results of the iteratee.
     *
     * @template R - The of the mapped result for each entry.
     */
    public map<R>(iteratee: EnumWrapper.Iteratee<R, V, T>, context?: any): R[] {
        return Array.prototype.map.call(
            this,
            (entry: EnumWrapper.Entry<V, T>, index: number): R => {
                return iteratee.call(context, entry[1], entry[0], this.enumObj);
            }
        );
    }

    /**
     * Get a list of this enum's keys.
     * Order of items in the list is based on sorted order of keys.
     * @return A list of this enum's keys.
     */
    public getKeys(): (keyof T)[] {
        // Taking advantage of "this" being ArrayLike<EnumWrapper.Entry>.
        return Array.prototype.map.call(this, (entry: EnumWrapper.Entry<V, T>) => {
            return entry[0];
        });
    }

    /**
     * Get a list of this enum's values.
     * Order of items in the list is based on sorted order of keys.
     * NOTE: If there are duplicate values in the enum, then there will also be duplicate values
     *       in the result.
     * @return A list of this enum's values.
     */
    public getValues(): T[keyof T][] {
        return Array.prototype.map.call(this, (entry: EnumWrapper.Entry<V, T>) => {
            return entry[1];
        });
    }

    /**
     * Get a list of this enum's entries as [key, value] tuples.
     * Order of items in the list is based on sorted order of keys.
     * @return A list of this enum's entries as [key, value] tuples.
     */
    public getEntries(): EnumWrapper.Entry<V, T>[] {
        return Array.prototype.map.call(this, (entry: EnumWrapper.Entry<V, T>) => {
            return [entry[0], entry[1]];
        });
    }

    /**
     * Tests if the provided string is actually a valid key for this enum
     * Acts as a type guard to confirm that the provided value is actually the enum key type.
     * @param key - A potential key value for this enum.
     * @return True if the provided key is a valid key for this enum.
     */
    public isKey(key: string | null | undefined): key is keyof T {
        return this.keySet.has(key);
    }

    /**
     * Casts a string to a properly-typed key for this enum.
     * Throws an error if the key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     * @throws {Error} if the provided string is not a valid key for this enum.
     */
    public asKey(key: string | null | undefined): keyof T {
        if (this.isKey(key)) {
            return key;
        } else {
            throw new Error(`Unexpected key: ${key}. Expected one of: ${this.getValues()}`);
        }
    }

    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string | null | undefined, defaultKey: keyof T): keyof T;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string | null | undefined, defaultKey?: keyof T): keyof T | undefined;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string | null | undefined, defaultKey: string): string;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string | null | undefined, defaultKey: string | undefined): string | undefined;
    /**
     * Casts a string to a properly-typed key for this enum.
     * Returns a default key if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The provided key value, cast to the type of this enum's keys.
     *         Returns `defaultKey` if the provided key is invalid.
     */
    public asKeyOrDefault(key: string | null | undefined, defaultKey?: keyof T | string): string | undefined {
        if (this.isKey(key)) {
            // type cast require to work around TypeScript bug:
            // https://github.com/Microsoft/TypeScript/issues/21950
            return key as keyof T;
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
    public isValue(value: V | null | undefined): value is T[keyof T] {
        return value != null && this.keysByValueMap.has(value);
    }

    /**
     * Casts a value to a properly-typed value for this enum.
     * Throws an error if the value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     * @throws {Error} if the provided value is not a valid value for this enum.
     */
    public asValue(value: V | null | undefined): T[keyof T] {
        if (this.isValue(value)) {
            return value;
        } else {
            throw new Error(`Unexpected value: ${value}. Expected one of: ${this.getValues()}`);
        }
    }

    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V | null | undefined, defaultValue: T[keyof T]): T[keyof T];
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V | null | undefined, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V | null | undefined, defaultValue: V): V;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V | null | undefined, defaultValue: V | undefined): V | undefined;
    /**
     * Casts a value to a properly-typed value for this enum.
     * Returns a default value if the provided value is invalid.
     * @param value - A potential value for this enum.
     * @return The provided value, cast to the type of this enum's values.
     *         Returns `defaultValue` if the provided value is invalid.
     */
    public asValueOrDefault(value: V | null | undefined, defaultValue?: T[keyof T] | V): V | undefined {
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
    public getKey(value: V | null | undefined): keyof T {
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
    public getKeyOrDefault(value: V | null | undefined, defaultKey: keyof T): keyof T;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V | null | undefined, defaultKey?: keyof T): keyof T | undefined;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V | null | undefined, defaultKey: string): string;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V | null | undefined, defaultKey: string | undefined): string | undefined;
    /**
     * Performs a reverse lookup from enum value to corresponding enum key.
     * Returns a default key if the provided value is invalid.
     * NOTE: If this enum has any duplicate values, then one of the keys for the duplicated value is
     *       arbitrarily returned.
     * @param value - A potential value for this enum.
     * @return The key for the provided value.
     *         Returns `defaultKey` if the provided value is invalid.
     */
    public getKeyOrDefault(value: V | null | undefined, defaultKey?: keyof T | string): string | undefined {
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
    public getValue(key: string | null | undefined): T[keyof T] {
        return this.enumObj[this.asKey(key)];
    }

    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string | null | undefined, defaultValue: T[keyof T]): T[keyof T];
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string | null | undefined, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string | null | undefined, defaultValue: V): V;
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string | null | undefined, defaultValue: V | undefined): V | undefined;
    /**
     * Gets the enum value for the provided key.
     * Returns a default value if the provided key is invalid.
     * @param key - A potential key value for this enum.
     * @return The enum value for the provided key.
     *         Returns `defaultValue` if the provided key is invalid.
     */
    public getValueOrDefault(key: string | null | undefined, defaultValue?: T[keyof T] | V): V | undefined {
        if (this.isKey(key)) {
            // type cast require to work around TypeScript bug:
            // https://github.com/Microsoft/TypeScript/issues/21950
            return this.enumObj[key as keyof T];
        } else {
            return defaultValue;
        }
    }
}

export namespace EnumWrapper {
    /**
     * A tuple containing the key and value of a single entry in an enum.
     * @template V - Type of the enum value.
     * @template T - Type of an enum-like object.
     */
    export type Entry<
        V extends number | string = number | string,
        T extends EnumLike<V, keyof T> = any,
    > = Readonly<[keyof T, T[keyof T]]>;

    /**
     * A function used in iterating all key/value entries in an enum.
     * @param value - An enum value.
     * @param key - An enum key.
     * @param enumObj - The enum-like object that the key/value entrie belongs to.
     * @return A result. The significance of the result depends on the type of iteration being performed.
     *
     * @template R - The type of the result.
     * @template V - Type of the enum value.
     * @template T - Type of an enum-like object.
     */
    export type Iteratee<
        R = any,
        V extends number | string = number | string,
        T extends EnumLike<V, keyof T> = any
    > = (this: any, value: V, key: keyof T, enumObj: T) => R;
}

/**
 * Type alias for an {@link EnumWrapper} for any type of enum-like object that contains only number values.
 *
 * @template T - Type of an enum-like object that contains only number values.
 */
export type NumberEnumWrapper<
    T extends EnumLike<number, keyof T> = any,
> = EnumWrapper<number, any>;

export namespace NumberEnumWrapper {
    /**
     * Type alias for an {@link EnumWrapper.Entry} for any type of enum-like object that contains only number values.
     *
     * @template T - Type of an enum-like object that contains only number values.
     */
    export type Entry<
        T extends EnumLike<number, keyof T> = any,
    > = EnumWrapper.Entry<number, T>;

    /**
     * Type alias for an {@link EnumWrapper.Iteratee} for any type of enum-like object that contains only number values.
     *
     * @template R - The type of the result.
     * @template T - Type of an enum-like object that contains only number values.
     */
    export type Iteratee<
        R = any,
        T extends EnumLike<number, keyof T> = any
    > = EnumWrapper.Iteratee<R, number, T>;
}

/**
 * Type alias for an {@link EnumWrapper} for any type of enum-like object that contains only string values.
 *
 * @template T - Type of an enum-like object that contains only string values.
 */
export type StringEnumWrapper<
    T extends EnumLike<string, keyof T> = any,
> = EnumWrapper<string, any>;

export namespace StringEnumWrapper {
    /**
     * Type alias for an {@link EnumWrapper.Entry} for any type of enum-like object that contains only string values.
     *
     * @template T - Type of an enum-like object that contains only string values.
     */
    export type Entry<
        T extends EnumLike<string, keyof T> = any,
    > = EnumWrapper.Entry<string, T>;

    /**
     * Type alias for an {@link EnumWrapper.Iteratee} for any type of enum-like object that contains only string values.
     *
     * @template R - The type of the result.
     * @template T - Type of an enum-like object that contains only string values.
     */
    export type Iteratee<
        R = any,
        T extends EnumLike<string, keyof T> = any
    > = EnumWrapper.Iteratee<R, string, T>;
}

/**
 * Type alias for an {@link EnumWrapper} for any type of enum-like object that contains a mix of
 * number and string values.
 *
 * @template T - Type of an enum-like object that contains a mix of number and string values.
 */
export type MixedEnumWrapper<
    T extends EnumLike<number | string, keyof T> = any,
> = EnumWrapper<number | string, any>;

export namespace MixedEnumWrapper {
    /**
     * Type alias for an {@link EnumWrapper.Entry} for any type of enum-like object that contains a mix of
     * number and string values.
     *
     * @template T - Type of an enum-like object that contains a mix of number and string values.
     */
    export type Entry<
        T extends EnumLike<number | string, keyof T> = any,
    > = EnumWrapper.Entry<number | string, T>;

    /**
     * Type alias for an {@link EnumWrapper.Iteratee} for any type of enum-like object that contains a mix of
     * number and string values.
     *
     * @template R - The type of the result.
     * @template T - Type of an enum-like object that contains a mix of number and string values.
     */
    export type Iteratee<
        R = any,
        T extends EnumLike<number | string, keyof T> = any
    > = EnumWrapper.Iteratee<R, number | string, T>;
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

/**
 * Test if an object key is an integer (array) index, according to ECMAScript specification
 * section 15.4: http://www.ecma-international.org/ecma-262/5.1/#sec-15.4
 * @param key - An object key.
 * @return True of the key is an integer index.
 */
function isIntegerIndex(key: string): boolean {
    return key === String(parseInt(key, 10));
}
