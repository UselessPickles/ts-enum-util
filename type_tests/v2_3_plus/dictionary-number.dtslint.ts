import { $enum } from "../../src";

// Dictionary object with number values
declare const TestEnum: { [key: string]: number; };

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

// $ExpectType number
enumWrapper.size;

// $ExpectType Readonly<[string, number]>
enumWrapper[0];

// $ExpectType IterableIterator<string>
enumWrapper.keys();

// $ExpectType IterableIterator<number>
enumWrapper.values();

// $ExpectType IterableIterator<Readonly<[string, number]>>
enumWrapper.entries();

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

// $ExpectType Readonly<[string, number]>[]
enumWrapper.getEntries();

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
enumWrapper.getKeyOrThrow(num);
// $ExpectType string
enumWrapper.getKeyOrThrow(numOrNull);
// $ExpectType string
enumWrapper.getKeyOrThrow(numOrUndefined);
// $ExpectError
enumWrapper.getKeyOrThrow(str);

// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(num);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numOrNull);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numOrUndefined);
// $ExpectError
enumWrapper.getKeyOrDefault(str);

// $ExpectType string
enumWrapper.getKeyOrDefault(num, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(num, strOrUndefined);

// $ExpectType number
enumWrapper.getValueOrThrow(str);
// $ExpectType number
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType number
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType number
enumWrapper.getValueOrDefault(str, num);
// $ExpectType number | undefined
enumWrapper.getValueOrDefault(str, numOrUndefined);
// $ExpectError
enumWrapper.getValueOrDefault(str, str);
