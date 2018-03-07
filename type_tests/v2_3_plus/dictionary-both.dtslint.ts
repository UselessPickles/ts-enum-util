import { $enum } from "../../src";

// Dictionary object with a mix of number and string values
declare const TestEnum: { [key: string]: string | number; };

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const numstr: number | string;
declare const numstrOrNull: number | string | null;
declare const numstrOrUndefined: number | string | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<string | number, { [key: string]: string | number; }>
enumWrapper;

// $ExpectType number
enumWrapper.length;

// $ExpectType number
enumWrapper.size;

// $ExpectType Readonly<[string, string | number]>
enumWrapper[0];

// $ExpectType IterableIterator<string>
enumWrapper.keys();

// $ExpectType IterableIterator<string | number>
enumWrapper.values();

// $ExpectType IterableIterator<Readonly<[string, string | number]>>
enumWrapper.entries();

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType string | number
    value;
    // $ExpectType string
    key;
    // $ExpectType EnumWrapper<string | number, { [key: string]: string | number; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType string | number
    value;
    // $ExpectType string
    key;
    // $ExpectType EnumWrapper<string | number, { [key: string]: string | number; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType string[]
enumWrapper.getKeys();

// $ExpectType (string | number)[]
enumWrapper.getValues();

// $ExpectType Readonly<[string, string | number]>[]
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
enumWrapper.isValue(numstr);
// $ExpectType boolean
enumWrapper.isValue(numstrOrNull);
// $ExpectType boolean
enumWrapper.isValue(numstrOrUndefined);

if (enumWrapper.isValue(numstr)) {
    // $ExpectType string | number
    numstr;
}

if (enumWrapper.isValue(numstrOrNull)) {
    // $ExpectType string | number
    numstrOrNull;
}

if (enumWrapper.isValue(numstrOrUndefined)) {
    // $ExpectType string | number
    numstrOrUndefined;
}

// $ExpectType string | number
enumWrapper.asValueOrThrow(numstr);
// $ExpectType string | number
enumWrapper.asValueOrThrow(numstrOrNull);
// $ExpectType string | number
enumWrapper.asValueOrThrow(numstrOrUndefined);

// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstr);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstrOrNull);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstrOrUndefined);

// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(numstr, undefined);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, num);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, str);
// $ExpectType string | number
enumWrapper.asValueOrDefault(numstr, numstr);
// $ExpectType string | number | undefined
enumWrapper.asValueOrDefault(num, numstrOrUndefined);

// $ExpectType string
enumWrapper.getKeyOrThrow(numstr);
// $ExpectType string
enumWrapper.getKeyOrThrow(numstrOrNull);
// $ExpectType string
enumWrapper.getKeyOrThrow(numstrOrUndefined);

// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numstr);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numstrOrNull);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numstrOrUndefined);

// $ExpectType string
enumWrapper.getKeyOrDefault(numstr, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numstr, strOrUndefined);

// $ExpectType string | number
enumWrapper.getValueOrThrow(str);
// $ExpectType string | number
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType string | number
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType string | number | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType string | number | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType string | number | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType string | number | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType string | number
enumWrapper.getValueOrDefault(str, num);
// $ExpectType string | number
enumWrapper.getValueOrDefault(str, str);
// $ExpectType string | number
enumWrapper.getValueOrDefault(str, numstr);
// $ExpectType string | number | undefined
enumWrapper.getValueOrDefault(str, numstrOrUndefined);
