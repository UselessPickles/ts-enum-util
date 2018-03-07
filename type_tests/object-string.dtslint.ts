import { $enum } from "../src";

// Enum-like object with string values
const TestEnum = {
    A: "a",
    B: "b",
    C: "c"
};

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<string, { A: string; B: string; C: string; }>
enumWrapper;

// $ExpectType number
enumWrapper.length;

// $ExpectType number
enumWrapper.size;

// $ExpectType Readonly<["A" | "B" | "C", string]>
enumWrapper[0];

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<string>
enumWrapper.values();

// $ExpectType IterableIterator<Readonly<["A" | "B" | "C", string]>>
enumWrapper.entries();

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType string
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string, { A: string; B: string; C: string; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType string
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string, { A: string; B: string; C: string; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType string[]
enumWrapper.getValues();

// $ExpectType Readonly<["A" | "B" | "C", string]>[]
enumWrapper.getEntries();

// $ExpectType boolean
enumWrapper.isKey(str);
// $ExpectType boolean
enumWrapper.isKey(strOrNull);
// $ExpectType boolean
enumWrapper.isKey(strOrUndefined);

if (enumWrapper.isKey(str)) {
    // $ExpectType "A" | "B" | "C"
    str;
}

if (enumWrapper.isKey(strOrNull)) {
    // $ExpectType "A" | "B" | "C"
    strOrNull;
}

if (enumWrapper.isKey(strOrUndefined)) {
    // $ExpectType "A" | "B" | "C"
    strOrUndefined;
}

// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(str);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrThrow(strOrUndefined);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(strOrUndefined);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, undefined);
// $ExpectType "A" | "B" | "C"
enumWrapper.asKeyOrDefault(str, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.asKeyOrDefault(str, keyOrUndefined);
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

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(str);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(strOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(strOrUndefined);
// $ExpectError
enumWrapper.getKeyOrThrow(num);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(str);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(strOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(strOrUndefined);
// $ExpectError
enumWrapper.getKeyOrDefault(num);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrDefault(str, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(str, keyOrUndefined);
// $ExpectType string
enumWrapper.getKeyOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(str, strOrUndefined);

// $ExpectType string
enumWrapper.getValueOrThrow(key);
// $ExpectType string
enumWrapper.getValueOrThrow(keyOrNull);
// $ExpectType string
enumWrapper.getValueOrThrow(keyOrUndefined);
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
