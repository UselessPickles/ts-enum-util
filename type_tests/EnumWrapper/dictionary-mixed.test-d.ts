import { $enum, EnumWrapper } from "../../src";
import { expectType, expectError } from "tsd";

// Dictionary object with a mix of number and string values
declare const TestEnum: { [key: string]: string | number };

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

expectType<EnumWrapper<string | number, { [key: string]: string | number }>>(
    enumWrapper
);

expectType<number>(enumWrapper.length);
expectError((enumWrapper.length = 0)); // immutable

expectType<number>(enumWrapper.size);
expectError((enumWrapper.size = 0)); // immutable

expectType<Readonly<[string, string | number]>>(enumWrapper[0]);
// TODO: report bug to TSD
// expectError((enumWrapper[0] = ["A", TestEnum.A])); // immutable

expectType<IterableIterator<string>>(enumWrapper.keys());

expectType<IterableIterator<string | number>>(enumWrapper.values());

expectType<IterableIterator<Readonly<[string, string | number]>>>(
    enumWrapper.entries()
);
for (const entry of enumWrapper.entries()) {
    expectType<Readonly<[string, string | number]>>(entry);
}

expectType<void>(
    enumWrapper.forEach((entryValue, entryKey, collection, index) => {
        expectType<string | number>(entryValue);
        expectType<string>(entryKey);
        expectType<
            EnumWrapper<string | number, { [key: string]: string | number }>
        >(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<number[]>(
    enumWrapper.map((entryValue, entryKey, collection, index) => {
        expectType<string | number>(entryValue);
        expectType<string>(entryKey);
        expectType<
            EnumWrapper<string | number, { [key: string]: string | number }>
        >(collection);
        expectType<number>(index);

        return num;
    })
);

expectType<string[]>(enumWrapper.getKeys());

expectType<(string | number)[]>(enumWrapper.getValues());

expectType<Readonly<[string, string | number]>[]>(enumWrapper.getEntries());

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

expectType<string>(enumWrapper.getKeyOrThrow(numstr));
expectType<string>(enumWrapper.getKeyOrThrow(numstrOrNull));
expectType<string>(enumWrapper.getKeyOrThrow(numstrOrUndefined));

expectType<string | undefined>(enumWrapper.getKeyOrDefault(numstr));
expectType<string | undefined>(enumWrapper.getKeyOrDefault(numstrOrNull));
expectType<string | undefined>(enumWrapper.getKeyOrDefault(numstrOrUndefined));

expectType<string>(enumWrapper.getKeyOrDefault(numstr, str));
expectType<string | undefined>(
    enumWrapper.getKeyOrDefault(numstr, strOrUndefined)
);

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
