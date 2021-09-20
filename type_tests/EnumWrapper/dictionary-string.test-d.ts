import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

// Dictionary object with string values
declare const TestEnum: { [key: string]: string };

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

const enumWrapper = $enum(TestEnum);

expectType<EnumWrapper<string, { [key: string]: string }>>(enumWrapper);

expectType<number>(enumWrapper.length);
expectError((enumWrapper.length = 0)); // immutable

expectType<number>(enumWrapper.size);
expectError((enumWrapper.size = 0)); // immutable

expectType<Readonly<[string, string]>>(enumWrapper[0]);
// TODO: report tsd bug
// expectError((enumWrapper[0] = ["A", TestEnum.A])); // immutable

expectType<IterableIterator<string>>(enumWrapper.keys());

expectType<IterableIterator<string>>(enumWrapper.values());

expectType<IterableIterator<Readonly<[string, string]>>>(enumWrapper.entries());
for (const entry of enumWrapper.entries()) {
    expectType<Readonly<[string, string]>>(entry);
}

expectType<void>(
    enumWrapper.forEach((entryValue, entryKkey, collection, index) => {
        expectType<string>(entryValue);
        expectType<string>(entryKkey);
        expectType<EnumWrapper<string, { [key: string]: string }>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<string>(entryValue);
        expectType<string>(entryKey);
        expectType<EnumWrapper<string, { [key: string]: string }>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<string[]>(enumWrapper.getKeys());

expectType<string[]>(enumWrapper.getValues());

expectType<Readonly<[string, string]>[]>(enumWrapper.getEntries());

expectType<boolean>(enumWrapper.isKey(str));
expectType<boolean>(enumWrapper.isKey(strOrNull));
expectType<boolean>(enumWrapper.isKey(strOrUndefined));

if (enumWrapper.isKey(str)) {
    expectType<string>(str);
}

if (enumWrapper.isKey(strOrNull)) {
    expectType<string>(strOrNull);
}

if (enumWrapper.isKey(strOrUndefined)) {
    expectType<string>(strOrUndefined);
}

expectType<string>(enumWrapper.asKeyOrThrow(str));
expectType<string>(enumWrapper.asKeyOrThrow(strOrNull));
expectType<string>(enumWrapper.asKeyOrThrow(strOrUndefined));

expectType<string | undefined>(enumWrapper.asKeyOrDefault(str));
expectType<string | undefined>(enumWrapper.asKeyOrDefault(strOrNull));
expectType<string | undefined>(enumWrapper.asKeyOrDefault(strOrUndefined));
expectType<string | undefined>(enumWrapper.asKeyOrDefault(str, undefined));
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

expectType<string>(enumWrapper.getKeyOrThrow(str));
expectType<string>(enumWrapper.getKeyOrThrow(strOrNull));
expectType<string>(enumWrapper.getKeyOrThrow(strOrUndefined));
expectError(enumWrapper.getKeyOrThrow(num));

expectType<string | undefined>(enumWrapper.getKeyOrDefault(str));
expectType<string | undefined>(enumWrapper.getKeyOrDefault(strOrNull));
expectType<string | undefined>(enumWrapper.getKeyOrDefault(strOrUndefined));
expectError(enumWrapper.getKeyOrDefault(num));

expectType<string>(enumWrapper.getKeyOrDefault(str, str));
expectType<string | undefined>(
    enumWrapper.getKeyOrDefault(str, strOrUndefined)
);

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
