import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

// Enum with mix of number and string values
enum TestEnum {
    A,
    B,
    C = "c"
}

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

declare const value: TestEnum;
declare const valueOrNull: TestEnum | null;
declare const valueOrUndefined: TestEnum | undefined;

const enumWrapper = $enum(TestEnum);

expectType<EnumWrapper<string | number, typeof TestEnum>>(enumWrapper);

expectType<number>(enumWrapper.length);
expectError((enumWrapper.length = 0)); // immutable

expectType<number>(enumWrapper.size);
expectError((enumWrapper.size = 0)); // immutable

expectType<Readonly<["A" | "B" | "C", TestEnum]>>(enumWrapper[0]);
// TODO: report tsd bug
// expectError((enumWrapper[0] = ["A", TestEnum.A])); // immutable

expectType<IterableIterator<"A" | "B" | "C">>(enumWrapper.keys());

expectType<IterableIterator<TestEnum>>(enumWrapper.values());

expectType<IterableIterator<Readonly<["A" | "B" | "C", TestEnum]>>>(
    enumWrapper.entries()
);
for (const entry of enumWrapper.entries()) {
    expectType<Readonly<["A" | "B" | "C", TestEnum]>>(entry);
}

expectType<void>(
    enumWrapper.forEach((entryValue, entryKey, collection, index) => {
        expectType<TestEnum>(entryValue);
        expectType<"A" | "B" | "C">(entryKey);
        expectType<EnumWrapper<string | number, typeof TestEnum>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<TestEnum>(entryValue);
        expectType<"A" | "B" | "C">(entryKey);
        expectType<EnumWrapper<string | number, typeof TestEnum>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<("A" | "B" | "C")[]>(enumWrapper.getKeys());

expectType<TestEnum[]>(enumWrapper.getValues());

expectType<Readonly<["A" | "B" | "C", TestEnum]>[]>(enumWrapper.getEntries());

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
    expectType<TestEnum>(numstr);
}

if (enumWrapper.isValue(numstrOrNull)) {
    expectType<TestEnum>(numstrOrNull);
}

if (enumWrapper.isValue(numstrOrUndefined)) {
    expectType<TestEnum>(numstrOrUndefined);
}

expectType<TestEnum>(enumWrapper.asValueOrThrow(numstr));
expectType<TestEnum>(enumWrapper.asValueOrThrow(numstrOrNull));
expectType<TestEnum>(enumWrapper.asValueOrThrow(numstrOrUndefined));

expectType<TestEnum | undefined>(enumWrapper.asValueOrDefault(numstr));
expectType<TestEnum | undefined>(enumWrapper.asValueOrDefault(numstrOrNull));
expectType<TestEnum | undefined>(
    enumWrapper.asValueOrDefault(numstrOrUndefined)
);

expectType<TestEnum | undefined>(
    enumWrapper.asValueOrDefault(numstr, undefined)
);
expectType<TestEnum>(enumWrapper.asValueOrDefault(numstr, value));
expectType<TestEnum | undefined>(
    enumWrapper.asValueOrDefault(numstr, valueOrUndefined)
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

expectType<TestEnum>(enumWrapper.getValueOrThrow(key));
expectType<TestEnum>(enumWrapper.getValueOrThrow(keyOrNull));
expectType<TestEnum>(enumWrapper.getValueOrThrow(keyOrUndefined));
expectType<TestEnum>(enumWrapper.getValueOrThrow(str));
expectType<TestEnum>(enumWrapper.getValueOrThrow(strOrNull));
expectType<TestEnum>(enumWrapper.getValueOrThrow(strOrUndefined));

expectType<TestEnum | undefined>(enumWrapper.getValueOrDefault(str));
expectType<TestEnum | undefined>(enumWrapper.getValueOrDefault(strOrNull));
expectType<TestEnum | undefined>(enumWrapper.getValueOrDefault(strOrUndefined));

expectType<TestEnum | undefined>(enumWrapper.getValueOrDefault(str, undefined));
expectType<TestEnum>(enumWrapper.getValueOrDefault(str, value));
expectType<TestEnum | undefined>(
    enumWrapper.getValueOrDefault(str, valueOrUndefined)
);
expectType<string | number>(enumWrapper.getValueOrDefault(str, num));
expectType<string | number>(enumWrapper.getValueOrDefault(str, str));
expectType<string | number>(enumWrapper.getValueOrDefault(str, numstr));
expectType<string | number | undefined>(
    enumWrapper.getValueOrDefault(str, numstrOrUndefined)
);
