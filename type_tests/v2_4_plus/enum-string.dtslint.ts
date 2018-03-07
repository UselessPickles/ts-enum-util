import { $enum } from "../../src";

// Enum with string values
enum TestEnum {
    A = "a",
    B = "b",
    C = "c"
}

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

declare const value: TestEnum;
declare const valueOrNull: TestEnum | null;
declare const valueOrUndefined: TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<string, typeof TestEnum>
enumWrapper;

// $ExpectType number
enumWrapper.length;

// $ExpectType number
enumWrapper.size;

// $ExpectType Readonly<["A" | "B" | "C", TestEnum]>
enumWrapper[0];

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<TestEnum>
enumWrapper.values();

// $ExpectType IterableIterator<Readonly<["A" | "B" | "C", TestEnum]>>
enumWrapper.entries();

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType TestEnum
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string, typeof TestEnum>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType TestEnum[]
enumWrapper.getValues();

// $ExpectType Readonly<["A" | "B" | "C", TestEnum]>[]
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
    // $ExpectType TestEnum
    str;
}

if (enumWrapper.isValue(strOrNull)) {
    // $ExpectType TestEnum
    strOrNull;
}

if (enumWrapper.isValue(strOrUndefined)) {
    // $ExpectType TestEnum
    strOrUndefined;
}

// $ExpectType TestEnum
enumWrapper.asValueOrThrow(str);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(strOrNull);
// $ExpectType TestEnum
enumWrapper.asValueOrThrow(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrThrow(num);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(str);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(strOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(strOrUndefined);
// $ExpectError
enumWrapper.asValueOrDefault(num);

// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(str, undefined);
// $ExpectType TestEnum
enumWrapper.asValueOrDefault(str, value);
// $ExpectType TestEnum | undefined
enumWrapper.asValueOrDefault(str, valueOrUndefined);
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

// $ExpectType TestEnum
enumWrapper.getValueOrThrow(key);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(keyOrNull);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(keyOrUndefined);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(str);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(strOrNull);
// $ExpectType TestEnum
enumWrapper.getValueOrThrow(strOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(strOrNull);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(strOrUndefined);

// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str, undefined);
// $ExpectType TestEnum
enumWrapper.getValueOrDefault(str, value);
// $ExpectType TestEnum | undefined
enumWrapper.getValueOrDefault(str, valueOrUndefined);
// $ExpectType string
enumWrapper.getValueOrDefault(str, str);
// $ExpectType string | undefined
enumWrapper.getValueOrDefault(str, strOrUndefined);
// $ExpectError
enumWrapper.getValueOrDefault(str, num);
