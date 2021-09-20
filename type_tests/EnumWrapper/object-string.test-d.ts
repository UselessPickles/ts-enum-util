import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

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

expectType<EnumWrapper<string, { A: string; B: string; C: string }>>(
    enumWrapper
);

expectType<number>(enumWrapper.length);
expectError((enumWrapper.length = 0)); // immutable

expectType<number>(enumWrapper.size);
expectError((enumWrapper.size = 0)); // immutable

expectType<Readonly<["A" | "B" | "C", string]>>(enumWrapper[0]);
// TODO: report tsd bug
// expectError((enumWrapper[0] = ["A", TestEnum.A])); // immutable

expectType<IterableIterator<"A" | "B" | "C">>(enumWrapper.keys());

expectType<IterableIterator<string>>(enumWrapper.values());

expectType<IterableIterator<Readonly<["A" | "B" | "C", string]>>>(
    enumWrapper.entries()
);
for (const entry of enumWrapper.entries()) {
    expectType<Readonly<["A" | "B" | "C", string]>>(entry);
}

expectType<void>(
    enumWrapper.forEach((entryValue, entryKkey, collection, index) => {
        expectType<string>(entryValue);
        expectType<"A" | "B" | "C">(entryKkey);
        expectType<EnumWrapper<string, { A: string; B: string; C: string }>>(
            collection
        );
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<string>(entryValue);
        expectType<"A" | "B" | "C">(entryKey);
        expectType<EnumWrapper<string, { A: string; B: string; C: string }>>(
            collection
        );
        expectType<number>(index);

        return num;
    })
);

expectType<("A" | "B" | "C")[]>(enumWrapper.getKeys());

expectType<string[]>(enumWrapper.getValues());

expectType<Readonly<["A" | "B" | "C", string]>[]>(enumWrapper.getEntries());

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

expectType<boolean>(enumWrapper.isValue(str));
expectType<boolean>(enumWrapper.isValue(strOrNull));
expectType<boolean>(enumWrapper.isValue(strOrUndefined));
expectError(enumWrapper.isValue(num));

if (enumWrapper.isValue(str)) {
    expectType<string>(str);
}

if (enumWrapper.isValue(strOrNull)) {
    expectType<string>(strOrNull);
}

if (enumWrapper.isValue(strOrUndefined)) {
    expectType<string>(strOrUndefined);
}

expectType<string>(enumWrapper.asValueOrThrow(str));
expectType<string>(enumWrapper.asValueOrThrow(strOrNull));
expectType<string>(enumWrapper.asValueOrThrow(strOrUndefined));
expectError(enumWrapper.asValueOrThrow(num));

expectType<string | undefined>(enumWrapper.asValueOrDefault(str));
expectType<string | undefined>(enumWrapper.asValueOrDefault(strOrNull));
expectType<string | undefined>(enumWrapper.asValueOrDefault(strOrUndefined));
expectError(enumWrapper.asValueOrDefault(num));

expectType<string | undefined>(enumWrapper.asValueOrDefault(str, undefined));
expectType<string>(enumWrapper.asValueOrDefault(str, str));
expectType<string | undefined>(
    enumWrapper.asValueOrDefault(str, strOrUndefined)
);
expectError(enumWrapper.asValueOrDefault(str, num));

expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(str));
expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(strOrNull));
expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(strOrUndefined));
expectError(enumWrapper.getKeyOrThrow(num));

expectType<"A" | "B" | "C" | undefined>(enumWrapper.getKeyOrDefault(str));
expectType<"A" | "B" | "C" | undefined>(enumWrapper.getKeyOrDefault(strOrNull));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(strOrUndefined)
);
expectError(enumWrapper.getKeyOrDefault(num));

expectType<"A" | "B" | "C">(enumWrapper.getKeyOrDefault(str, key));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(str, keyOrUndefined)
);
expectType<string>(enumWrapper.getKeyOrDefault(str, str));
expectType<string | undefined>(
    enumWrapper.getKeyOrDefault(str, strOrUndefined)
);

expectType<string>(enumWrapper.getValueOrThrow(key));
expectType<string>(enumWrapper.getValueOrThrow(keyOrNull));
expectType<string>(enumWrapper.getValueOrThrow(keyOrUndefined));
expectType<string>(enumWrapper.getValueOrThrow(str));
expectType<string>(enumWrapper.getValueOrThrow(strOrNull));
expectType<string>(enumWrapper.getValueOrThrow(strOrUndefined));

expectType<string | undefined>(enumWrapper.getValueOrDefault(str));
expectType<string | undefined>(enumWrapper.getValueOrDefault(strOrNull));
expectType<string | undefined>(enumWrapper.getValueOrDefault(strOrUndefined));

expectType<string | undefined>(enumWrapper.getValueOrDefault(str, undefined));
expectType<string>(enumWrapper.getValueOrDefault(str, str));
expectType<string | undefined>(
    enumWrapper.getValueOrDefault(str, strOrUndefined)
);
expectError(enumWrapper.getValueOrDefault(str, num));
