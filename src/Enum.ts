import {EnumWrapper} from "./EnumWrapper";

export type Enum<V extends number | string, K extends string> = {
    [P in K]: V;
};

export function Enum<T extends Enum<number, keyof T>>(enumObj: T): EnumWrapper<number, T>;
export function Enum<T extends Enum<string, keyof T>>(enumObj: T): EnumWrapper<string, T>;
export function Enum(enumObj: any): EnumWrapper {
    return EnumWrapper.getInstance(enumObj);
}

export namespace Enum {
    export type Tuple<T> = [
        keyof T,
        T[keyof T]
    ];

    export interface Pair<T> {
        readonly name: keyof T;
        readonly value: T[keyof T];
    }
}
