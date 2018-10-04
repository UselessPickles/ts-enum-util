import { $enum } from "../../../dist/types";

// Dictionary object with string values
declare const TestEnum: { [key: string]: string };

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<string, { [key: string]: string; }>
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
const testEntry: Readonly<[string, string]> = enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable

// $ExpectType IterableIterator<string>
enumWrapper.keys();

// $ExpectType IterableIterator<string>
enumWrapper.values();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the iterated entry tuples
// because of this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntryIterator: IterableIterator<
    Readonly<[string, string]>
> = enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    const testIteratedEntry: Readonly<[string, string]> = entry;
}

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType string
    value;
    // $ExpectType string
    key;
    // $ExpectType EnumWrapper<string, { [key: string]: string; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType string
    value;
    // $ExpectType string
    key;
    // $ExpectType EnumWrapper<string, { [key: string]: string; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType string[]
enumWrapper.getKeys();

// $ExpectType string[]
enumWrapper.getValues();

// NOTE: Must test via assignability rather than ExpectType because of a change
// in how Readonly tuple types work as of TS 3.1.
// Also cannot test for immutability of items within the entry tuple because of
// this change.
// see: https://github.com/Microsoft/TypeScript/issues/26864
const testEntries: Readonly<[string, string]>[] = enumWrapper.getEntries();

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
enumWrapper.isValue(str);
// $ExpectType boolean
enumWrapper.isValue(strOrNull);
// $ExpectType boolean
enumWrapper.isValue(strOrUndefined);
// $ExpectError
enumWrapper.isValue(num);

if (enumWrapper.isValue(str)) {
    // $ExpectType string
    str;
}

if (enumWrapper.isValue(strOrNull)) {
    // $ExpectType string
    strOrNull;
}

if (enumWrapper.isValue(strOrUndefined)) {
    // $ExpectType string
    strOrUndefined;
}

// $ExpectType string
enumWrapper.asValueOrThrow(str);
// $ExpectType string
enumWrapper.asValueOrThrow(strOrNull);
// $ExpectType string
enumWrapper.asValueOrThrow(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(num);

// $ExpectType string | undefined
enumWrapper.asValueOrDefault(str);
// $ExpectType string | undefined
enumWrapper.asValueOrDefault(strOrNull);
// $ExpectType string | undefined
enumWrapper.asValueOrDefault(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(num);

// $ExpectType string | undefined
enumWrapper.asValueOrDefault(str, undefined);
// $ExpectType string
enumWrapper.asValueOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.asValueOrDefault(str, strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(str, num);

// $ExpectType string
enumWrapper.getKeyOrThrow(str);
// $ExpectType string
enumWrapper.getKeyOrThrow(strOrNull);
// $ExpectType string
enumWrapper.getKeyOrThrow(strOrUndefined);
// $ExpectError
enumWrapper.getKeyOrThrow(num);

// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(strOrNull);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(strOrUndefined);
// $ExpectError
enumWrapper.getKeyOrDefault(num);

// $ExpectType string
enumWrapper.getKeyOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(str, strOrUndefined);

// $ExpectType string
enumWrapper.getValueOrThrow(str);
// $ExpectType string
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType string
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType string | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType string | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType string | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType string | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType string
enumWrapper.getValueOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.getValueOrDefault(str, strOrUndefined);
// $ExpectError
enumWrapper.getValueOrDefault(str, num);
