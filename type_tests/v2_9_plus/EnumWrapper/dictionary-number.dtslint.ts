import { $enum } from "ts-enum-util";

// Dictionary object with number values
declare const TestEnum: { [key: string]: number };

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<number, { [key: string]: number; }>
enumWrapper;

// $ExpectType number
enumWrapper.length;
// $ExpectError
enumWrapper.length = 0; // immutable

// $ExpectType number
enumWrapper.size;
// $ExpectError
enumWrapper.size = 0; // immutable

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntry: Readonly<[string, number]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<string>
enumWrapper.keys();

// $ExpectType IterableIterator<number>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<
    Readonly<[string, number]>
> = enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<[string, number]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType number
    value;
    // $ExpectType string
    key;
    // $ExpectType EnumWrapper<number, { [key: string]: number; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType number
    value;
    // $ExpectType string
    key;
    // $ExpectType EnumWrapper<number, { [key: string]: number; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType string[]
enumWrapper.getKeys();

// $ExpectType number[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<[string, number]>[] = enumWrapper.getEntries();

// $ExpectType number
enumWrapper.indexOfKey("A");
// $ExpectType number
enumWrapper.indexOfKey("foo!");
// $ExpectType number
enumWrapper.indexOfKey(str);

// $ExpectType number
enumWrapper.indexOfValue(TestEnum.A);
// $ExpectType number
enumWrapper.indexOfValue(10);
// $ExpectType number
enumWrapper.indexOfValue(num);
// $ExpectError
enumWrapper.indexOfValue("c");
// $ExpectError
enumWrapper.indexOfValue(str);

// $ExpectType boolean
enumWrapper.isKey(str);
// $ExpectType boolean
enumWrapper.isKey(strOrNull);
// $ExpectType boolean
enumWrapper.isKey(strOrUndefined);

if (enumWrapper.isKey(str)) {
    // $ExpectType string
    str;
}

if (enumWrapper.isKey(strOrNull)) {
    // $ExpectType string
    strOrNull;
}

if (enumWrapper.isKey(strOrUndefined)) {
    // $ExpectType string
    strOrUndefined;
}

// $ExpectType string
enumWrapper.asKeyOrThrow(str);
// $ExpectType string
enumWrapper.asKeyOrThrow(strOrNull);
// $ExpectType string
enumWrapper.asKeyOrThrow(strOrUndefined);

// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(str);
// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(strOrNull);
// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(strOrUndefined);
// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(str, undefined);
// $ExpectType string
enumWrapper.asKeyOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.asKeyOrDefault(str, strOrUndefined);

// $ExpectType boolean
enumWrapper.isValue(num);
// $ExpectType boolean
enumWrapper.isValue(numOrNull);
// $ExpectType boolean
enumWrapper.isValue(numOrUndefined);
// $ExpectError
enumWrapper.isValue(str);

if (enumWrapper.isValue(num)) {
    // $ExpectType number
    num;
}

if (enumWrapper.isValue(numOrNull)) {
    // $ExpectType number
    numOrNull;
}

if (enumWrapper.isValue(numOrUndefined)) {
    // $ExpectType number
    numOrUndefined;
}

// $ExpectType number
enumWrapper.asValueOrThrow(num);
// $ExpectType number
enumWrapper.asValueOrThrow(numOrNull);
// $ExpectType number
enumWrapper.asValueOrThrow(numOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(str);

// $ExpectType number | undefined
enumWrapper.asValueOrDefault(num);
// $ExpectType number | undefined
enumWrapper.asValueOrDefault(numOrNull);
// $ExpectType number | undefined
enumWrapper.asValueOrDefault(numOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str);

// $ExpectType number | undefined
enumWrapper.asValueOrDefault(num, undefined);
// $ExpectType number
enumWrapper.asValueOrDefault(num, num);
// $ExpectType number | undefined
enumWrapper.asValueOrDefault(num, numOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(num, str);

// $ExpectType string
enumWrapper.getKey(num);
// $ExpectType string | undefined
enumWrapper.getKey(numOrNull);
// $ExpectType string | undefined
enumWrapper.getKey(numOrUndefined);
// $ExpectError
enumWrapper.getKey(str);

// $ExpectType string
enumWrapper.getKey(num, str);
// $ExpectType string | undefined
enumWrapper.getKey(num, strOrUndefined);

// $ExpectType number
enumWrapper.getValue(str);
// $ExpectType number | undefined
enumWrapper.getValue(strOrNull);
// $ExpectType number | undefined
enumWrapper.getValue(strOrUndefined);

// $ExpectType number | undefined
enumWrapper.getValue(str, undefined);
// $ExpectType number
enumWrapper.getValue(str, num);
// $ExpectType number | undefined
enumWrapper.getValue(str, numOrUndefined);
// $ExpectError
enumWrapper.getValue(str, str);
