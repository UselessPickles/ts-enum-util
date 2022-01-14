import {
    isNonNumericKey,
    getOwnEnumerableNonNumericKeysES6,
    getOwnEnumerableNonNumericKeysES5,
    getOwnEnumerableNonNumericKeysES3
} from "../src/objectKeysUtil";

describe("objectKeysUtil", () => {
    describe("isNonNumericKey", () => {
        test("Integers are numeric keys", () => {
            expect(isNonNumericKey("0")).toBe(false);
            expect(isNonNumericKey("1")).toBe(false);
            expect(isNonNumericKey("42")).toBe(false);
            // 2^32-2
            expect(isNonNumericKey("4294967294")).toBe(false);
        });

        test("Integers >= 2^32-1 are numeric keys", () => {
            // 2^32-1
            expect(isNonNumericKey("4294967295")).toBe(false);
            // 2^32
            expect(isNonNumericKey("4294967296")).toBe(false);
        });

        test("Negative integers are numeric keys", () => {
            expect(isNonNumericKey("-1")).toBe(false);
            expect(isNonNumericKey("-42")).toBe(false);
        });

        test("Floating point numbers are numeric keys", () => {
            expect(isNonNumericKey("3.14")).toBe(false);
            expect(isNonNumericKey("-1.7")).toBe(false);
        });

        test("Integers with extra formatting are NOT numeric keys", () => {
            expect(isNonNumericKey("01")).toBe(true);
            expect(isNonNumericKey(" 1")).toBe(true);
            expect(isNonNumericKey("1 ")).toBe(true);
            expect(isNonNumericKey("1,000")).toBe(true);
        });

        test("Floating point numbers with extra formatting are NOT numeric keys", () => {
            expect(isNonNumericKey("1.000")).toBe(true);
            expect(isNonNumericKey("01.2")).toBe(true);
            expect(isNonNumericKey(" 1.2")).toBe(true);
            expect(isNonNumericKey("1.2 ")).toBe(true);
            expect(isNonNumericKey("1,000.2")).toBe(true);
        });

        test("Non-numeric keys are NOT numeric keys", () => {
            expect(isNonNumericKey("1A")).toBe(true);
            expect(isNonNumericKey("Hello!")).toBe(true);
            expect(isNonNumericKey(" ")).toBe(true);
            expect(isNonNumericKey("")).toBe(true);
        });
    });

    describe("getOwnEnumerableNonNumericKeys", () => {
        const obj = ["a", "b", "c"];

        Object.defineProperty(obj, "B", {
            value: 4,
            enumerable: true
        });

        Object.defineProperty(obj, "A", {
            value: 3,
            enumerable: true
        });

        Object.defineProperty(obj, "D", {
            value: 2,
            enumerable: false
        });

        Object.defineProperty(obj, "C", {
            value: 1,
            enumerable: true
        });

        Object.defineProperty(obj, "1.2", {
            value: 42,
            enumerable: true
        });

        const expected = ["B", "A", "C"];

        test.each([
            ["ES6", getOwnEnumerableNonNumericKeysES6],
            ["ES5", getOwnEnumerableNonNumericKeysES5],
            ["ES3", getOwnEnumerableNonNumericKeysES3]
        ] as const)("getOwnEnumerableNonNumericKeys%s", (label, func) => {
            expect(func(obj)).toEqual(expected);
        });
    });
});
