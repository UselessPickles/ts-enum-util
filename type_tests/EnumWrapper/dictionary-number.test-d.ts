import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

// Dictionary object with number values
declare const TestEnum: { [key: string]: number };

declare const str: string;
declare const strOrNull: string | null;
declare const strOrUndefined: string | undefined;

declare const num: number;
declare const numOrNull: number | null;
declare const numOrUndefined: number | undefined;

const enumWrapper = $enum(TestEnum);

expectType<EnumWrapper<number, { [key: string]: number }>>(enumWrapper);

expectType<number>(enumWrapper.length);
expectError((enumWrapper.length = 0)); // immutable

expectType<number>(enumWrapper.size);
expectError((enumWrapper.size = 0)); // immutable

expectType<Readonly<[string, number]>>(enumWrapper[0]);
// TODO: report tsd bug
// expectError(enumWrapper[0] = ["A", TestEnum.A]); // immutable

expectType<IterableIterator<string>>(enumWrapper.keys());

expectType<IterableIterator<number>>(enumWrapper.values());

expectType<IterableIterator<Readonly<[string, number]>>>(enumWrapper.entries());
for (const entry of enumWrapper.entries()) {
    expectType<Readonly<[string, number]>>(entry);
}

expectType<void>(
    enumWrapper.forEach((entryValue, entryKey, collection, index) => {
        expectType<number>(entryValue);
        expectType<string>(entryKey);
        expectType<EnumWrapper<number, { [key: string]: number }>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<number>(entryValue);
        expectType<string>(entryKey);
        expectType<EnumWrapper<number, { [key: string]: number }>>(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<string[]>(enumWrapper.getKeys());

expectType<number[]>(enumWrapper.getValues());

expectType<Readonly<[string, number]>[]>(enumWrapper.getEntries());

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

expectType<boolean>(enumWrapper.isValue(num));
expectType<boolean>(enumWrapper.isValue(numOrNull));
expectType<boolean>(enumWrapper.isValue(numOrUndefined));
expectError(enumWrapper.isValue(str));

if (enumWrapper.isValue(num)) {
    expectType<number>(num);
}

if (enumWrapper.isValue(numOrNull)) {
    expectType<number>(numOrNull);
}

if (enumWrapper.isValue(numOrUndefined)) {
    expectType<number>(numOrUndefined);
}

expectType<number>(enumWrapper.asValueOrThrow(num));
expectType<number>(enumWrapper.asValueOrThrow(numOrNull));
expectType<number>(enumWrapper.asValueOrThrow(numOrUndefined));
expectError(enumWrapper.asValueOrThrow(str));

expectType<number | undefined>(enumWrapper.asValueOrDefault(num));
expectType<number | undefined>(enumWrapper.asValueOrDefault(numOrNull));
expectType<number | undefined>(enumWrapper.asValueOrDefault(numOrUndefined));
expectError(enumWrapper.asValueOrDefault(str));

expectType<number | undefined>(enumWrapper.asValueOrDefault(num, undefined));
expectType<number>(enumWrapper.asValueOrDefault(num, num));
expectType<number | undefined>(
    enumWrapper.asValueOrDefault(num, numOrUndefined)
);
expectError(enumWrapper.asValueOrDefault(num, str));

expectType<string>(enumWrapper.getKeyOrThrow(num));
expectType<string>(enumWrapper.getKeyOrThrow(numOrNull));
expectType<string>(enumWrapper.getKeyOrThrow(numOrUndefined));
expectError(enumWrapper.getKeyOrThrow(str));

expectType<string | undefined>(enumWrapper.getKeyOrDefault(num));
expectType<string | undefined>(enumWrapper.getKeyOrDefault(numOrNull));
expectType<string | undefined>(enumWrapper.getKeyOrDefault(numOrUndefined));
expectError(enumWrapper.getKeyOrDefault(str));

expectType<string>(enumWrapper.getKeyOrDefault(num, str));
expectType<string | undefined>(
    enumWrapper.getKeyOrDefault(num, strOrUndefined)
);

expectType<number>(enumWrapper.getValueOrThrow(str));
expectType<number>(enumWrapper.getValueOrThrow(strOrNull));
expectType<number>(enumWrapper.getValueOrThrow(strOrUndefined));

expectType<number | undefined>(enumWrapper.getValueOrDefault(str));
expectType<number | undefined>(enumWrapper.getValueOrDefault(strOrNull));
expectType<number | undefined>(enumWrapper.getValueOrDefault(strOrUndefined));

expectType<number | undefined>(enumWrapper.getValueOrDefault(str, undefined));
expectType<number>(enumWrapper.getValueOrDefault(str, num));
expectType<number | undefined>(
    enumWrapper.getValueOrDefault(str, numOrUndefined)
);
expectError(enumWrapper.getValueOrDefault(str, str));
