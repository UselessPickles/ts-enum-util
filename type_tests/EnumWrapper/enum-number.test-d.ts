import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

// Enum with number values
enum TestEnum {
    A,
    B,
    C
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

expectType<EnumWrapper<number, typeof TestEnum>>(enumWrapper);

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
        expectType<EnumWrapper<number, typeof TestEnum>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<TestEnum>(entryValue);
        expectType<"A" | "B" | "C">(entryKey);
        expectType<EnumWrapper<number, typeof TestEnum>>(collection);
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

expectType<boolean>(enumWrapper.isValue(num));
expectType<boolean>(enumWrapper.isValue(numOrNull));
expectType<boolean>(enumWrapper.isValue(numOrUndefined));
expectError(enumWrapper.isValue(str));

if (enumWrapper.isValue(num)) {
    expectType<TestEnum>(num);
}

if (enumWrapper.isValue(numOrNull)) {
    expectType<TestEnum>(numOrNull);
}

if (enumWrapper.isValue(numOrUndefined)) {
    expectType<TestEnum>(numOrUndefined);
}

expectType<TestEnum>(enumWrapper.asValueOrThrow(num));
expectType<TestEnum>(enumWrapper.asValueOrThrow(numOrNull));
expectType<TestEnum>(enumWrapper.asValueOrThrow(numOrUndefined));
expectError(enumWrapper.asValueOrThrow(str));

expectType<TestEnum | undefined>(enumWrapper.asValueOrDefault(num));
expectType<TestEnum | undefined>(enumWrapper.asValueOrDefault(numOrNull));
expectType<TestEnum | undefined>(enumWrapper.asValueOrDefault(numOrUndefined));
expectError(enumWrapper.asValueOrDefault(str));

expectType<TestEnum | undefined>(enumWrapper.asValueOrDefault(num, undefined));
expectType<TestEnum>(enumWrapper.asValueOrDefault(num, value));
expectType<TestEnum | undefined>(
    enumWrapper.asValueOrDefault(num, valueOrUndefined)
);
expectType<number>(enumWrapper.asValueOrDefault(num, num));
expectType<number | undefined>(
    enumWrapper.asValueOrDefault(num, numOrUndefined)
);
expectError(enumWrapper.asValueOrDefault(num, str));

expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(num));
expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(numOrNull));
expectType<"A" | "B" | "C">(enumWrapper.getKeyOrThrow(numOrUndefined));
expectError(enumWrapper.getKeyOrThrow(str));

expectType<"A" | "B" | "C" | undefined>(enumWrapper.getKeyOrDefault(num));
expectType<"A" | "B" | "C" | undefined>(enumWrapper.getKeyOrDefault(numOrNull));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(numOrUndefined)
);
expectError(enumWrapper.getKeyOrDefault(str));

expectType<"A" | "B" | "C">(enumWrapper.getKeyOrDefault(num, key));
expectType<"A" | "B" | "C" | undefined>(
    enumWrapper.getKeyOrDefault(num, keyOrUndefined)
);
expectType<string>(enumWrapper.getKeyOrDefault(num, str));
expectType<string | undefined>(
    enumWrapper.getKeyOrDefault(num, strOrUndefined)
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
expectType<number>(enumWrapper.getValueOrDefault(str, num));
expectType<number | undefined>(
    enumWrapper.getValueOrDefault(str, numOrUndefined)
);
expectError(enumWrapper.getValueOrDefault(str, str));
