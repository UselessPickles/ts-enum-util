import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

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

expectType<EnumWrapper<string | number, { A: number; B: number; C: string }>>(
    enumWrapper
);

expectType<number>(enumWrapper.length);
expectError((enumWrapper.length = 0)); // immutable

expectType<number>(enumWrapper.size);
expectError((enumWrapper.size = 0)); // immutable

expectType<Readonly<["A" | "B" | "C", string | number]>>(enumWrapper[0]);
// TODO: report tsd bug
// expectError((enumWrapper[0] = ["A", TestEnum.A])); // immutable

expectType<IterableIterator<"A" | "B" | "C">>(enumWrapper.keys());

expectType<IterableIterator<string | number>>(enumWrapper.values());

expectType<IterableIterator<Readonly<["A" | "B" | "C", string | number]>>>(
    enumWrapper.entries()
);
for (const entry of enumWrapper.entries()) {
    expectType<Readonly<["A" | "B" | "C", string | number]>>(entry);
}

expectType<void>(
    enumWrapper.forEach((entryValue, entryKey, collection, index) => {
        expectType<string | number>(entryValue);
        expectType<"A" | "B" | "C">(entryKey);
        expectType<
            EnumWrapper<string | number, { A: number; B: number; C: string }>
        >(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<string | number>(entryValue);
        expectType<"A" | "B" | "C">(entryKey);
        expectType<
            EnumWrapper<string | number, { A: number; B: number; C: string }>
        >(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<("A" | "B" | "C")[]>(enumWrapper.getKeys());

expectType<(string | number)[]>(enumWrapper.getValues());

expectType<Readonly<["A" | "B" | "C", string | number]>[]>(
    enumWrapper.getEntries()
);

expectType<boolean>(enumWrapper.isKey(str));
expectType<boolean>(enumWrapper.isKey(strOrNull));
expectType<boolean>(enumWrapper.isKey(strOrUndefined));

if (enumWrapper.isKey(str)) {
    expectType<"A" | "B" | "C">(str);
}

if (enumWrapper.isKey(strOrNull)) {
    expectType<"A" | "B" | "C">(strOrNull);
}

if (enumWrapper.isKey(strOrUndefined)) {
    expectType<"A" | "B" | "C">(strOrUndefined);
}

expectType<"A" | "B" | "C">(enumWrapper.asKeyOrThrow(str));
expectType<"A" | "B" | "C">(enumWrapper.asKeyOrThrow(strOrNull));
expectType<"A" | "B" | "C">(enumWrapper.asKeyOrThrow(strOrUndefined));

expectType<"A" | "B" | "C" | undefined>(enumWrapper.asKeyOrDefault(str));
expectType<"A" | "B" | "C" | undefined>(enumWrapper.asKeyOrDefault(strOrNull));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.asKeyOrDefault(strOrUndefined)
);
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.asKeyOrDefault(str, undefined)
);
expectType<"A" | "B" | "C">(enumWrapper.asKeyOrDefault(str, key));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.asKeyOrDefault(str, keyOrUndefined)
);
expectType<string>(enumWrapper.asKeyOrDefault(str, str));
expectType<string | undefined>(enumWrapper.asKeyOrDefault(str, strOrUndefined));

expectType<boolean>(enumWrapper.isValue(numstr));
expectType<boolean>(enumWrapper.isValue(numstrOrNull));
expectType<boolean>(enumWrapper.isValue(numstrOrUndefined));

if (enumWrapper.isValue(numstr)) {
    expectType<string | number>(numstr);
}

if (enumWrapper.isValue(numstrOrNull)) {
    expectType<string | number>(numstrOrNull);
}

if (enumWrapper.isValue(numstrOrUndefined)) {
    expectType<string | number>(numstrOrUndefined);
}

expectType<string | number>(enumWrapper.asValueOrThrow(numstr));
expectType<string | number>(enumWrapper.asValueOrThrow(numstrOrNull));
expectType<string | number>(enumWrapper.asValueOrThrow(numstrOrUndefined));

expectType<string | number | undefined>(enumWrapper.asValueOrDefault(numstr));
expectType<string | number | undefined>(
    enumWrapper.asValueOrDefault(numstrOrNull)
);
expectType<string | number | undefined>(
    enumWrapper.asValueOrDefault(numstrOrUndefined)
);

expectType<string | number | undefined>(
    enumWrapper.asValueOrDefault(numstr, undefined)
);
expectType<string | number>(enumWrapper.asValueOrDefault(numstr, num));
expectType<string | number>(enumWrapper.asValueOrDefault(numstr, str));
expectType<string | number>(enumWrapper.asValueOrDefault(numstr, numstr));
expectType<string | number | undefined>(
    enumWrapper.asValueOrDefault(num, numstrOrUndefined)
);

expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(numstr));
expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(numstrOrNull));
expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(numstrOrUndefined));

expectType<"A" | "B" | "C" | undefined>(enumWrapper.getKeyOrDefault(numstr));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(numstrOrNull)
);
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(numstrOrUndefined)
);

expectType<"A" | "B" | "C">(enumWrapper.getKeyOrDefault(numstr, key));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(numstr, keyOrUndefined)
);
expectType<string>(enumWrapper.getKeyOrDefault(numstr, str));
expectType<string | undefined>(
    enumWrapper.getKeyOrDefault(numstr, strOrUndefined)
);

expectType<string | number>(enumWrapper.getValueOrThrow(key));
expectType<string | number>(enumWrapper.getValueOrThrow(keyOrNull));
expectType<string | number>(enumWrapper.getValueOrThrow(keyOrUndefined));
expectType<string | number>(enumWrapper.getValueOrThrow(str));
expectType<string | number>(enumWrapper.getValueOrThrow(strOrNull));
expectType<string | number>(enumWrapper.getValueOrThrow(strOrUndefined));

expectType<string | number | undefined>(enumWrapper.getValueOrDefault(str));
expectType<string | number | undefined>(
    enumWrapper.getValueOrDefault(strOrNull)
);
expectType<string | number | undefined>(
    enumWrapper.getValueOrDefault(strOrUndefined)
);

expectType<string | number | undefined>(
    enumWrapper.getValueOrDefault(str, undefined)
);
expectType<string | number>(enumWrapper.getValueOrDefault(str, num));
expectType<string | number>(enumWrapper.getValueOrDefault(str, str));
expectType<string | number>(enumWrapper.getValueOrDefault(str, numstr));
expectType<string | number | undefined>(
    enumWrapper.getValueOrDefault(str, numstrOrUndefined)
);
