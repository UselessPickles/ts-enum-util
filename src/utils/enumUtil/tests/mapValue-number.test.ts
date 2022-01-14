import {
    $enum,
    EnumValueMapper,
    EnumValueMapperWithNull,
    EnumValueMapperWithUndefined,
    EnumValueMapperWithNullAndUndefined,
} from "../src";

enum RGB {
    R,
    G,
    B,
}

describe("mapValue (number)", () => {
    describe("Without null/undefined", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                result: "Red!",
            },
            {
                value: RGB.G,
                result: "Green!",
            },
            {
                value: RGB.B,
                result: "Blue!",
            },
            {
                isUnexpected: true,
                value: null as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                value: undefined as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                value: "unexpected!" as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: "toString" as any as RGB,
                result: "Unexpected!",
            },
        ];

        const mappers: EnumValueMapper<RGB, string>[] = [
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
            },
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleUnexpected]: "Unexpected!",
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry,
            },
        ];

        for (const mapper of mappers) {
            for (const testEntry of TEST_ENTRIES) {
                if (mapper[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    mapper.hasOwnProperty($enum.handleUnexpected) ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct value is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .mapValue(testEntry.value)
                            .with(mapper);

                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });
                }
            }
        }
    });

    describe("With null", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB | null;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                result: "Red!",
            },
            {
                value: RGB.G,
                result: "Green!",
            },
            {
                value: RGB.B,
                result: "Blue!",
            },
            {
                value: null,
                result: "Null!",
            },
            {
                isUnexpected: true,
                value: undefined as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                value: "unexpected!" as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: "toString" as any as RGB,
                result: "Unexpected!",
            },
        ];

        const mappers: EnumValueMapperWithNull<RGB, string>[] = [
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleNull]: "Null!",
            },
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleNull]: "Null!",
                [$enum.handleUnexpected]: "Unexpected!",
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleNull]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry,
            },
        ];

        for (const mapper of mappers) {
            for (const testEntry of TEST_ENTRIES) {
                if (mapper[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    mapper.hasOwnProperty($enum.handleUnexpected) ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct value is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .mapValue(testEntry.value)
                            .with(mapper);

                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });
                }
            }
        }
    });

    describe("With undefined", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB | undefined;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                result: "Red!",
            },
            {
                value: RGB.G,
                result: "Green!",
            },
            {
                value: RGB.B,
                result: "Blue!",
            },
            {
                value: undefined,
                result: "Undefined!",
            },
            {
                isUnexpected: true,
                value: null as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                value: "unexpected!" as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: "toString" as any as RGB,
                result: "Unexpected!",
            },
        ];

        const mappers: EnumValueMapperWithUndefined<RGB, string>[] = [
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleUndefined]: "Undefined!",
            },
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleUndefined]: "Undefined!",
                [$enum.handleUnexpected]: "Unexpected!",
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleUndefined]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry,
            },
        ];

        for (const mapper of mappers) {
            for (const testEntry of TEST_ENTRIES) {
                if (mapper[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    mapper.hasOwnProperty($enum.handleUnexpected) ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct value is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .mapValue(testEntry.value)
                            .with(mapper);

                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });
                }
            }
        }
    });

    describe("With null and undefined", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB | null | undefined;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                result: "Red!",
            },
            {
                value: RGB.G,
                result: "Green!",
            },
            {
                value: RGB.B,
                result: "Blue!",
            },
            {
                value: null,
                result: "Null!",
            },
            {
                value: undefined,
                result: "Undefined!",
            },
            {
                isUnexpected: true,
                value: "unexpected!" as any as RGB,
                result: "Unexpected!",
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: "toString" as any as RGB,
                result: "Unexpected!",
            },
        ];

        const mappers: EnumValueMapperWithNullAndUndefined<RGB, string>[] = [
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleNull]: "Null!",
                [$enum.handleUndefined]: "Undefined!",
            },
            {
                [RGB.R]: "Red!",
                [RGB.G]: "Green!",
                [RGB.B]: "Blue!",
                [$enum.handleNull]: "Null!",
                [$enum.handleUndefined]: "Undefined!",
                [$enum.handleUnexpected]: "Unexpected!",
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleNull]: $enum.unhandledEntry,
                [$enum.handleUndefined]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry,
            },
        ];

        for (const mapper of mappers) {
            for (const testEntry of TEST_ENTRIES) {
                if (mapper[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    mapper.hasOwnProperty($enum.handleUnexpected) ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct value is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .mapValue(testEntry.value)
                            .with(mapper);

                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.mapValue(testEntry.value).with(mapper);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });
                }
            }
        }
    });

    test("Explicit undefined value for [$enum.handleUnexpected]", () => {
        const result = $enum
            .mapValue("BLAH!" as any as RGB)
            .with<number | undefined>({
                [RGB.R]: 1,
                [RGB.G]: 2,
                [RGB.B]: 3,
                [$enum.handleUnexpected]: undefined,
            });

        expect(result).toBe(undefined);
    });

    describe("Collisions with special symbols are impossible", () => {
        test("unhandled entry symbol name", () => {
            const result = $enum.mapValue(1).with<string>({
                1: "unhandledEntry",
            });

            expect(result).toBe("unhandledEntry");
        });

        test("unhandled entry symbol description", () => {
            const result = $enum.mapValue(1).with<string>({
                1: "ts-enum-util:unhandledEntry",
            });

            expect(result).toBe("ts-enum-util:unhandledEntry");
        });
    });
});
