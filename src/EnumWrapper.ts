import {Enum} from "./Enum";

export class EnumWrapper<
    V extends number | string = number | string,
    T extends Enum<V, keyof T> = any
> {
    private static readonly instancesCache = new Map<object, EnumWrapper>();

    private readonly namesCache: Set<keyof T>;
    private readonly valuesCache = new Set<T[keyof T]>();
    private readonly tuplesCache: Enum.Tuple<T>[] = [];
    private readonly pairsCache: Enum.Pair<T>[] = [];
    private readonly namesByValue = new Map<V, keyof T>();

    public static createInstance<T extends Enum<number, keyof T>>(enumObj: T): EnumWrapper<number, T>;
    public static createInstance<T extends Enum<string, keyof T>>(enumObj: T): EnumWrapper<string, T>;
    public static createInstance(enumObj: any): EnumWrapper {
        return new EnumWrapper(enumObj);
    }

    public static getInstance<T extends Enum<number, keyof T>>(enumObj: T): EnumWrapper<number, T>;
    public static getInstance<T extends Enum<string, keyof T>>(enumObj: T): EnumWrapper<string, T>;
    public static getInstance(enumObj: any): EnumWrapper {
        let result = this.instancesCache.get(enumObj);

        if (!result) {
            result = this.createInstance(enumObj);
            this.instancesCache.set(enumObj, result);
        }

        return result;
    }

    private constructor(private readonly enumObj: T) {
        const numberRexExp = /^\d+$/;
        const namesArray: (keyof T)[] = Object.keys(enumObj).filter((name) => !numberRexExp.test(name));

        this.namesCache = new Set<keyof T>(namesArray);

        namesArray.forEach((name, index) => {
            const value = enumObj[name];
            this.valuesCache.add(value);
            this.tuplesCache[index] = [name, value];
            this.pairsCache[index] = { name: name, value: value };
            this.namesByValue.set(value, name);
        });
    }

    public names(): (keyof T)[] {
        return Array.from(this.namesCache);
    }

    public values(): T[keyof T][] {
        return Array.from(this.valuesCache);
    }

    public tuples(): Enum.Tuple<T>[] {
        return this.tuplesCache.map((tuple) => Array.from(tuple) as Enum.Tuple<T>);
    }

    public pairs(): Enum.Pair<T>[] {
        return this.pairsCache.map((pair) => Object.assign({}, pair));
    }

    public isName(name: string | undefined): name is keyof T {
        return name !== undefined && this.namesCache.has(name);
    }

    public asName(name: string | undefined): keyof T {
        if (!this.isName(name)) {
            throw new Error(`Unexpected name: ${name}. Expected one of: ${this.namesCache}`);
        }

        return name;
    }

    public asNameOrDefault(name: string | undefined, defaultName?: keyof T): keyof T | undefined;
    public asNameOrDefault(name: string | undefined, defaultName: keyof T): keyof T;
    public asNameOrDefault(name: string | undefined, defaultName: string): keyof T | string;
    public asNameOrDefault(name: string | undefined, defaultName: string | undefined): keyof T | string | undefined;
    public asNameOrDefault(name: string | undefined, defaultName?: keyof T | string): keyof T | string | undefined {
        if (this.isName(name)) {
            return name;
        } else {
            return defaultName;
        }

    }

    public getValue(name: string | undefined): T[keyof T] {
        return this.enumObj[this.asName(name)];
    }

    public getValueOrDefault(name: string | undefined, defaultValue?: T[keyof T]): T[keyof T] | undefined;
    public getValueOrDefault(name: string | undefined, defaultValue: T[keyof T]): T[keyof T];
    public getValueOrDefault(name: string | undefined, defaultValue: V): T[keyof T] | V;
    public getValueOrDefault(name: string | undefined, defaultValue: V | undefined): T[keyof T] | V | undefined;
    public getValueOrDefault(name: string | undefined, defaultValue?: T[keyof T] | V): T[keyof T] | V | undefined {
        if (this.isName(name)) {
            // TODO: why isn't custom type guard working?
            return this.enumObj[name as keyof T];
        } else {
            return defaultValue;
        }
    }

    public isValue(value: V | undefined): value is T[keyof T] {
        return value !== undefined && this.valuesCache.has(value);
    }

    public asValue(value: V | undefined): T[keyof T] {
        if (!this.isValue(value)) {
            throw new Error(`Unexpected value: ${value}. Expected one of: ${this.valuesCache}`);
        }

        return value;
    }

    public getName(value: V | undefined): keyof T {
        return this.namesByValue.get(this.asValue(value));
    }

    public getNameOrDefault(value: V | undefined, defaultName?: keyof T): keyof T | undefined;
    public getNameOrDefault(value: V | undefined, defaultName: keyof T): keyof T;
    public getNameOrDefault(value: V | undefined, defaultName: string): keyof T | string;
    public getNameOrDefault(value: V | undefined, defaultName: string | undefined): keyof T | string | undefined;
    public getNameOrDefault(value: V | undefined, defaultName?: keyof T | string): keyof T | string | undefined {
        if (!this.isValue(value)) {
            return defaultName;
        }

        return this.namesByValue.get(value);
    }
}
