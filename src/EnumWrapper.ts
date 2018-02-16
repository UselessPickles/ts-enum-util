import {Enum} from "./Enum";

/**
 * A generic wrapper for any enum-like value (see {@link Enum} type for more explanation).
 * Provides utilities for runtime processing of an enum's values and keys, with strict compile-time
 * type safety.
 *
 * EnumWrapper cannot be directly instantiated. Use one of the following to get/create an EnumWrapper
 * instance:
 * - {@link EnumWrapper.getInstance}
 * - {@link EnumWrapper.createInstance}
 * - {@link Enum())}
 *
 * @template V - Type of the enum value.
 * @template T - Type of the enum-like object that is being wrapped.
 */
export class EnumWrapper<
    V extends number | string = number | string,
    T extends Enum<V, keyof T> = any
> implements Iterable<EnumWrapper.Entry<T>> {
    /**
     * Map of enum object -> EnumWrapper instance.
     * Used as a cache for {@link EnumWrapper.getInstance}.
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
     * Creates a new EnumWrapper for an enum-like object.
     * You probably want to use {@link EnumWrapper.getInstance} for any typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/tranient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object.
     * @return A new instance of EnumWrapper for the provided enumObj.
     */
    public static createInstance<T extends Enum<number, keyof T>>(enumObj: T): EnumWrapper<number, T>;
    /**
     * Creates a new EnumWrapper for an enum-like object.
     * You probably want to use {@link EnumWrapper.getInstance} for any typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/tranient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object.
     * @return A new instance of EnumWrapper for the provided enumObj.
     */
    public static createInstance<T extends Enum<string, keyof T>>(enumObj: T): EnumWrapper<string, T>;
    /**
     * Creates a new EnumWrapper for an enum-like object.
     * You probably want to use {@link EnumWrapper.getInstance} for any typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/tranient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object.
     * @return A new instance of EnumWrapper for the provided enumObj.
     */
    public static createInstance<T extends Enum<number | string, keyof T>>(enumObj: T): EnumWrapper<number | string, T>;
    /**
     * Creates a new EnumWrapper for an enum-like object.
     * You probably want to use {@link EnumWrapper.getInstance} for any typical enums, because it will
     * cache the result.
     * This method may be useful if you want an EnumWrapper for an enum-like object that is dynamically
     * built at runtime, is used only within a limited/tranient context in the application, and is likely
     * to clutter the cache without ever being reused.
     * @param enumObj - An enum-like object.
     * @return A new instance of EnumWrapper for the provided enumObj.
     */
    public static createInstance(enumObj: any): EnumWrapper {
        return new EnumWrapper(enumObj);
    }

    /**
     * Creates a new EnumWrapper, or returns a cached EnumWrapper if one has already been created for the same
     * object via {@link EnumWrapper.getInstance} or {@link Enum()}.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every sebsequent call to getInstance() for the same enum object.
     * Use {@link EnumWrapper.createInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object.
     * @return An instance of EnumWrapper for the provided enumObj.
     */
    public static getInstance<T extends Enum<number, keyof T>>(enumObj: T): EnumWrapper<number, T>;
    /**
     * Creates a new EnumWrapper, or returns a cached EnumWrapper if one has already been created for the same
     * object via {@link EnumWrapper.getInstance} or {@link Enum()}.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every sebsequent call to getInstance() for the same enum object.
     * Use {@link EnumWrapper.createInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object.
     * @return An instance of EnumWrapper for the provided enumObj.
     */
    public static getInstance<T extends Enum<string, keyof T>>(enumObj: T): EnumWrapper<string, T>;
    /**
     * Creates a new EnumWrapper, or returns a cached EnumWrapper if one has already been created for the same
     * object via {@link EnumWrapper.getInstance} or {@link Enum()}.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every sebsequent call to getInstance() for the same enum object.
     * Use {@link EnumWrapper.createInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object.
     * @return An instance of EnumWrapper for the provided enumObj.
     */
    public static getInstance<T extends Enum<number | string, keyof T>>(enumObj: T): EnumWrapper<number | string, T>;
    /**
     * Creates a new EnumWrapper, or returns a cached EnumWrapper if one has already been created for the same
     * object via {@link EnumWrapper.getInstance} or {@link Enum()}.
     * This is most useful for typical enums that are statically defined, because the cached  EnumWrapper instance
     * will be quickly retrieved/reused on every sebsequent call to getInstance() for the same enum object.
     * Use {@link EnumWrapper.createInstance} if you don't want the EnumWrapper to be cached.
     * @param enumObj - An enum-like object.
     * @return An instance of EnumWrapper for the provided enumObj.
     */
    public static getInstance(enumObj: any): EnumWrapper {
        let result = this.instancesCache.get(enumObj);

        if (!result) {
            result = this.createInstance(enumObj);
            this.instancesCache.set(enumObj, result);
        }

        return result;
    }

    /**
     * Create a new EnumWrapper instance.
     * This is for internal use only.
     * Use one of the following to publicly get/create an EnumWrapper
     * instance:
     * - {@link EnumWrapper.getInstance}
     * - {@link EnumWrapper.createInstance}
     * - {@link Enum())}
     *
     * @param enumObj - An enum-like object. See the {@link Enum} type for more explanation.
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
     * The number of entries in this enum.
     */
    public get size(): number {
        return this.keySet.size;
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
     * @return An iterator that iterates over this enum's values.
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
     */
    public map<R>(iteratee: EnumWrapper.Iteratee<V, T, R>, context?: any): R[] {
        const result: R[] = [];

        this.keySet.forEach((key) => {
            result.push(iteratee.call(context, this.enumObj[key], key, this.enumObj));
        });

        return result;
    }

    public isKey(key: string | undefined): key is keyof T {
        return key !== undefined && this.keySet.has(key);
    }

    public asKey(key: string | undefined): keyof T {
        if (this.isKey(key)) {
            return key;
        } else {
            throw new Error(`Unexpected key: ${key}. Expected one of: ${Array.from(this.keySet)}`);
        }
    }

    public asKeyOrDefault(key: string | undefined, defaultKey?: keyof T): keyof T | undefined;
    public asKeyOrDefault(key: string | undefined, defaultKey: keyof T): keyof T;
    public asKeyOrDefault(key: string | undefined, defaultKey: string): keyof T | string;
    public asKeyOrDefault(key: string | undefined, defaultKey: string | undefined): keyof T | string | undefined;
    public asKeyOrDefault(key: string | undefined, defaultKey?: keyof T | string): keyof T | string | undefined {
        if (this.isKey(key)) {
            return key;
        } else {
            return defaultKey;
        }

    }

    public isValue(value: V | undefined): value is T[keyof T] {
        return value !== undefined && this.valueSet.has(value);
    }

    public asValue(value: V | undefined): T[keyof T] {
        if (this.isValue(value)) {
            return value;
        } else {
            throw new Error(`Unexpected value: ${value}. Expected one of: ${Array.from(this.valueSet)}`);
        }
    }

    public asValueOrDefault(value: V | undefined, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    public asValueOrDefault(value: V | undefined, defaultValue: T[keyof T]): T[keyof T];
    public asValueOrDefault(value: V | undefined, defaultValue: V): T[keyof T] | V;
    public asValueOrDefault(value: V | undefined, defaultValue: V | undefined): T[keyof T] | V | undefined;
    public asValueOrDefault(value: V | undefined, defaultValue?: T[keyof T] | V): T[keyof T] | V | undefined {
        if (this.isValue(value)) {
            return value;
        } else {
            return defaultValue;
        }
    }

    public getKey(value: V | undefined): keyof T {
        return this.keysByValueMap.get(this.asValue(value));
    }

    public getKeyOrDefault(value: V | undefined, defaultKey?: keyof T): keyof T | undefined;
    public getKeyOrDefault(value: V | undefined, defaultKey: keyof T): keyof T;
    public getKeyOrDefault(value: V | undefined, defaultKey: string): keyof T | string;
    public getKeyOrDefault(value: V | undefined, defaultKey: string | undefined): keyof T | string | undefined;
    public getKeyOrDefault(value: V | undefined, defaultKey?: keyof T | string): keyof T | string | undefined {
        if (this.isValue(value)) {
            return this.keysByValueMap.get(value);
        } else {
            return defaultKey;
        }
    }

    public getValue(key: string | undefined): T[keyof T] {
        return this.enumObj[this.asKey(key)];
    }

    public getValueOrDefault(key: string | undefined, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    public getValueOrDefault(key: string | undefined, defaultValue: T[keyof T]): T[keyof T];
    public getValueOrDefault(key: string | undefined, defaultValue: V): T[keyof T] | V;
    public getValueOrDefault(key: string | undefined, defaultValue: V | undefined): T[keyof T] | V | undefined;
    public getValueOrDefault(key: string | undefined, defaultValue?: T[keyof T] | V): T[keyof T] | V | undefined {
        if (this.isKey(key)) {
            // type cast to "keyof T" is necessary until this bug is fixed:
            // https://github.com/Microsoft/TypeScript/issues/21950
            return this.enumObj[key as keyof T];
        } else {
            return defaultValue;
        }
    }
}

export namespace EnumWrapper {
    export type Entry<T> = [
        keyof T,
        T[keyof T]
    ];

    export type Iteratee<
        V extends number | string,
        T extends Enum<V, keyof T>,
        R
    > = (this: any, value: V, key: keyof T, enumObj: T) => R;
}
