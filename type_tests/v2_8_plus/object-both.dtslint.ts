import { $enum } from "../../dist/types";

// Enum-like object with mix of number and string values
const TestEnum = {
    A: 1,
    B: 2,
    C: "c"
};

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

declare const numstr: number | string;
declare const numstrOrNull: number | string | null;
declare const numstrOrUndefined: number | string | undefined;

declare const key: keyof typeof TestEnum;
declare const keyOrNull: keyof typeof TestEnum | null;
declare const keyOrUndefined: keyof typeof TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

// $ExpectType EnumWrapper<string | number, { A: number; B: number; C: string; }>
enumWrapper;

// $ExpectType number
enumWrapper.length;
// $ExpectError
enumWrapper.length = 0; // immutable

// $ExpectType number
enumWrapper.size;
// $ExpectError
enumWrapper.size = 0; // immutable

// $ExpectType Readonly<["A" | "B" | "C", string | number]>
enumWrapper[0];
// $ExpectError
enumWrapper[0] = ["A", TestEnum.A]; // immutable
// $ExpectError
enumWrapper[0][0] = "A"; // immutable
// $ExpectError
enumWrapper[0][1] = TestEnum.A; // immutable

// $ExpectType IterableIterator<"A" | "B" | "C">
enumWrapper.keys();

// $ExpectType IterableIterator<string | number>
enumWrapper.values();

// $ExpectType IterableIterator<Readonly<["A" | "B" | "C", string | number]>>
enumWrapper.entries();
for (const entry of enumWrapper.entries()) {
    // $ExpectError
    entry[0] = "A"; // immutable
    // $ExpectError
    entry[1] = TestEnum.A; // immutable
}

// $ExpectType void
enumWrapper.forEach((value, key, collection, index) => {
    // $ExpectType string | number
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string | number, { A: number; B: number; C: string; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType number[]
enumWrapper.map((value, key, collection, index) => {
    // $ExpectType string | number
    value;
    // $ExpectType "A" | "B" | "C"
    key;
    // $ExpectType EnumWrapper<string | number, { A: number; B: number; C: string; }>
    collection;
    // $ExpectType number
    index;

    return num;
});

// $ExpectType ("A" | "B" | "C")[]
enumWrapper.getKeys();

// $ExpectType (string | number)[]
enumWrapper.getValues();

// $ExpectType Readonly<["A" | "B" | "C", string | number]>[]
enumWrapper.getEntries();
const entry = enumWrapper.getEntries()[0];
// $ExpectError
entry[0] = "A"; // immutable
// $ExpectError
entry[1] = TestEnum.A; // immutable

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

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numstr);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numstrOrNull);
// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrThrow(numstrOrUndefined);

// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstr);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstrOrNull);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstrOrUndefined);

// $ExpectType "A" | "B" | "C"
enumWrapper.getKeyOrDefault(numstr, key);
// $ExpectType "A" | "B" | "C" | undefined
enumWrapper.getKeyOrDefault(numstr, keyOrUndefined);
// $ExpectType string
enumWrapper.getKeyOrDefault(numstr, str);
// $ExpectType string | undefined
enumWrapper.getKeyOrDefault(numstr, strOrUndefined);

// $ExpectType string | number
enumWrapper.getValueOrThrow(key);
// $ExpectType string | number
enumWrapper.getValueOrThrow(keyOrNull);
// $ExpectType string | number
enumWrapper.getValueOrThrow(keyOrUndefined);
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
