import {
    $enum,
    EnumValueVisitor,
    EnumValueVisitorWithNull,
    EnumValueVisitorWithUndefined,
    EnumValueVisitorWithNullAndUndefined
} from "../src";

enum RGB {
    R = "0",
    G = 1,
    B = "2"
}

describe("visitValue (string/number mix)", () => {
    const handlerMockR = jest.fn((value: RGB.R) => {
        return "Red!";
    });

    const handlerMockG = jest.fn((value: RGB.G) => {
        return "Green!";
    });

    const handlerMockB = jest.fn((value: RGB.B) => {
        return "Blue!";
    });

    const handlerMockNull = jest.fn((value: null) => {
        return "Null!";
    });

    const handlerMockUndefined = jest.fn((value: undefined) => {
        return "Undefined!";
    });

    const handlerMockUnexpected = jest.fn(
        (value: string | number | null | undefined) => {
            return `Unexpected! (${value})`;
        }
    );

    const ALL_HANDLER_MOCKS = [
        handlerMockR,
        handlerMockG,
        handlerMockB,
        handlerMockNull,
        handlerMockUndefined,
        handlerMockUnexpected
    ];

    beforeEach(() => {
        // Clear all handler mocks for a fresh start before each test
        for (const handlerMock of ALL_HANDLER_MOCKS) {
            handlerMock.mockClear();
        }
    });

    describe("Without null/undefined", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB;
            handlerMock: jest.Mock<string>;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                handlerMock: handlerMockR,
                result: "Red!"
            },
            {
                value: RGB.G,
                handlerMock: handlerMockG,
                result: "Green!"
            },
            {
                value: RGB.B,
                handlerMock: handlerMockB,
                result: "Blue!"
            },
            {
                isUnexpected: true,
                value: (null as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (null)"
            },
            {
                isUnexpected: true,
                value: (undefined as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (undefined)"
            },
            {
                isUnexpected: true,
                value: ("unexpected!" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (unexpected!)"
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: ("toString" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (toString)"
            }
        ];

        const visitors: EnumValueVisitor<RGB, string>[] = [
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB
            },
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleUnexpected]: handlerMockUnexpected
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry
            }
        ];

        for (const visitor of visitors) {
            for (const testEntry of TEST_ENTRIES) {
                if (visitor[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    visitor[$enum.handleUnexpected] ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct visitor method is called (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            if (handlerMock === testEntry.handlerMock) {
                                expect(handlerMock.mock.calls.length).toBe(1);
                            } else {
                                expect(handlerMock.mock.calls.length).toBe(0);
                            }
                        }
                    });

                    test(`Value is passed to handler (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);
                        expect(testEntry.handlerMock.mock.calls.length).toBe(1);
                        const args = testEntry.handlerMock.mock.calls[0];
                        expect(args.length).toBe(1);
                        expect(args[0]).toBe(testEntry.value);
                    });

                    test(`Handler result is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .visitValue(testEntry.value)
                            .with(visitor);
                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });

                    test(`No visitor method is called for unhandled unexpected value(${testEntry.value})`, () => {
                        try {
                            $enum.visitValue(testEntry.value).with(visitor);
                        } catch (error) {
                            // ignore error
                        }

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            expect(handlerMock.mock.calls.length).toBe(0);
                        }
                    });
                }
            }
        }
    });

    describe("With null", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB | null;
            handlerMock: jest.Mock<string>;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                handlerMock: handlerMockR,
                result: "Red!"
            },
            {
                value: RGB.G,
                handlerMock: handlerMockG,
                result: "Green!"
            },
            {
                value: RGB.B,
                handlerMock: handlerMockB,
                result: "Blue!"
            },
            {
                value: null,
                handlerMock: handlerMockNull,
                result: "Null!"
            },
            {
                isUnexpected: true,
                value: (undefined as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (undefined)"
            },
            {
                isUnexpected: true,
                value: ("unexpected!" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (unexpected!)"
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: ("toString" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (toString)"
            }
        ];

        const visitors: EnumValueVisitorWithNull<RGB, string>[] = [
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleNull]: handlerMockNull
            },
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleNull]: handlerMockNull,
                [$enum.handleUnexpected]: handlerMockUnexpected
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleNull]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry
            }
        ];

        for (const visitor of visitors) {
            for (const testEntry of TEST_ENTRIES) {
                if (visitor[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    visitor[$enum.handleUnexpected] ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct visitor method is called (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            if (handlerMock === testEntry.handlerMock) {
                                expect(handlerMock.mock.calls.length).toBe(1);
                            } else {
                                expect(handlerMock.mock.calls.length).toBe(0);
                            }
                        }
                    });

                    test(`Value is passed to handler (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);
                        expect(testEntry.handlerMock.mock.calls.length).toBe(1);
                        const args = testEntry.handlerMock.mock.calls[0];
                        expect(args.length).toBe(1);
                        expect(args[0]).toBe(testEntry.value);
                    });

                    test(`Handler result is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .visitValue(testEntry.value)
                            .with(visitor);
                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });

                    test(`No visitor method is called for unhandled unexpected value(${testEntry.value})`, () => {
                        try {
                            $enum.visitValue(testEntry.value).with(visitor);
                        } catch (error) {
                            // ignore error
                        }

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            expect(handlerMock.mock.calls.length).toBe(0);
                        }
                    });
                }
            }
        }
    });

    describe("With undefined", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB | undefined;
            handlerMock: jest.Mock<string>;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                handlerMock: handlerMockR,
                result: "Red!"
            },
            {
                value: RGB.G,
                handlerMock: handlerMockG,
                result: "Green!"
            },
            {
                value: RGB.B,
                handlerMock: handlerMockB,
                result: "Blue!"
            },
            {
                value: undefined,
                handlerMock: handlerMockUndefined,
                result: "Undefined!"
            },
            {
                isUnexpected: true,
                value: (null as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (null)"
            },
            {
                isUnexpected: true,
                value: ("unexpected!" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (unexpected!)"
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: ("toString" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (toString)"
            }
        ];

        const visitors: EnumValueVisitorWithUndefined<RGB, string>[] = [
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleUndefined]: handlerMockUndefined
            },
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleUndefined]: handlerMockUndefined,
                [$enum.handleUnexpected]: handlerMockUnexpected
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleUndefined]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry
            }
        ];

        for (const visitor of visitors) {
            for (const testEntry of TEST_ENTRIES) {
                if (visitor[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    visitor[$enum.handleUnexpected] ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct visitor method is called (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            if (handlerMock === testEntry.handlerMock) {
                                expect(handlerMock.mock.calls.length).toBe(1);
                            } else {
                                expect(handlerMock.mock.calls.length).toBe(0);
                            }
                        }
                    });

                    test(`Value is passed to handler (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);
                        expect(testEntry.handlerMock.mock.calls.length).toBe(1);
                        const args = testEntry.handlerMock.mock.calls[0];
                        expect(args.length).toBe(1);
                        expect(args[0]).toBe(testEntry.value);
                    });

                    test(`Handler result is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .visitValue(testEntry.value)
                            .with(visitor);
                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });

                    test(`No visitor method is called for unhandled unexpected value(${testEntry.value})`, () => {
                        try {
                            $enum.visitValue(testEntry.value).with(visitor);
                        } catch (error) {
                            // ignore error
                        }

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            expect(handlerMock.mock.calls.length).toBe(0);
                        }
                    });
                }
            }
        }
    });

    describe("With null and undefined", () => {
        interface TestEntry {
            isUnexpected?: boolean;
            value: RGB | null | undefined;
            handlerMock: jest.Mock<string>;
            result: string;
        }

        const TEST_ENTRIES: TestEntry[] = [
            {
                value: RGB.R,
                handlerMock: handlerMockR,
                result: "Red!"
            },
            {
                value: RGB.G,
                handlerMock: handlerMockG,
                result: "Green!"
            },
            {
                value: RGB.B,
                handlerMock: handlerMockB,
                result: "Blue!"
            },
            {
                value: null,
                handlerMock: handlerMockNull,
                result: "Null!"
            },
            {
                value: undefined,
                handlerMock: handlerMockUndefined,
                result: "Undefined!"
            },
            {
                isUnexpected: true,
                value: ("unexpected!" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (unexpected!)"
            },
            {
                isUnexpected: true,
                // matches a standard property name on Object.prototype
                value: ("toString" as any) as RGB,
                handlerMock: handlerMockUnexpected,
                result: "Unexpected! (toString)"
            }
        ];

        const visitors: EnumValueVisitorWithNullAndUndefined<RGB, string>[] = [
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleNull]: handlerMockNull,
                [$enum.handleUndefined]: handlerMockUndefined
            },
            {
                [RGB.R]: handlerMockR,
                [RGB.G]: handlerMockG,
                [RGB.B]: handlerMockB,
                [$enum.handleNull]: handlerMockNull,
                [$enum.handleUndefined]: handlerMockUndefined,
                [$enum.handleUnexpected]: handlerMockUnexpected
            },
            {
                [RGB.R]: $enum.unhandledEntry,
                [RGB.G]: $enum.unhandledEntry,
                [RGB.B]: $enum.unhandledEntry,
                [$enum.handleNull]: $enum.unhandledEntry,
                [$enum.handleUndefined]: $enum.unhandledEntry,
                [$enum.handleUnexpected]: $enum.unhandledEntry
            }
        ];

        for (const visitor of visitors) {
            for (const testEntry of TEST_ENTRIES) {
                if (visitor[RGB.R] === $enum.unhandledEntry) {
                    test(`Unhandled entry throws error (${testEntry.value}`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unhandled value: ${testEntry.value}`);
                    });
                } else if (
                    visitor[$enum.handleUnexpected] ||
                    !testEntry.isUnexpected
                ) {
                    test(`Correct visitor method is called (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            if (handlerMock === testEntry.handlerMock) {
                                expect(handlerMock.mock.calls.length).toBe(1);
                            } else {
                                expect(handlerMock.mock.calls.length).toBe(0);
                            }
                        }
                    });

                    test(`Value is passed to handler (${testEntry.value})`, () => {
                        $enum.visitValue(testEntry.value).with(visitor);
                        expect(testEntry.handlerMock.mock.calls.length).toBe(1);
                        const args = testEntry.handlerMock.mock.calls[0];
                        expect(args.length).toBe(1);
                        expect(args[0]).toBe(testEntry.value);
                    });

                    test(`Handler result is returned (${testEntry.value})`, () => {
                        const result = $enum
                            .visitValue(testEntry.value)
                            .with(visitor);
                        expect(result).toBe(testEntry.result);
                    });
                } else {
                    test(`Unhandled unexpected value throws error (${testEntry.value})`, () => {
                        expect(() => {
                            $enum.visitValue(testEntry.value).with(visitor);
                        }).toThrowError(`Unexpected value: ${testEntry.value}`);
                    });

                    test(`No visitor method is called for unhandled unexpected value(${testEntry.value})`, () => {
                        try {
                            $enum.visitValue(testEntry.value).with(visitor);
                        } catch (error) {
                            // ignore error
                        }

                        for (const handlerMock of ALL_HANDLER_MOCKS) {
                            expect(handlerMock.mock.calls.length).toBe(0);
                        }
                    });
                }
            }
        }
    });
});
