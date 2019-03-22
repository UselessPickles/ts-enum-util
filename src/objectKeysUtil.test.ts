import {
    isNonArrayIndexKey,
    getOwnEnumerableNonArrayIndexKeysES6,
    getOwnEnumerableNonArrayIndexKeysES5,
    getOwnEnumerableNonArrayIndexKeysES3
} from "./objectKeysUtil";

describe("objectKeysUtil", () => {
    describe("isNonArrayIndexKey", () => {
        test("Integers ranging from 0 to 2^32-2 are array indexes", () => {
            expect(isNonArrayIndexKey("0")).toBe(false);
            expect(isNonArrayIndexKey("1")).toBe(false);
            expect(isNonArrayIndexKey("42")).toBe(false);
            // 2^32-2
            expect(isNonArrayIndexKey("4294967294")).toBe(false);
        });

        test("Integers >= 2^32-1 are NOT array indexes", () => {
            // 2^32-1
            expect(isNonArrayIndexKey("4294967295")).toBe(true);
            // 2^32
            expect(isNonArrayIndexKey("4294967296")).toBe(true);
        });

        test("Negative integers are NOT array indexes", () => {
            expect(isNonArrayIndexKey("-1")).toBe(true);
            expect(isNonArrayIndexKey("-42")).toBe(true);
        });

        test("Non-integer numbers are NOT array indexes", () => {
            expect(isNonArrayIndexKey("3.14")).toBe(true);
            expect(isNonArrayIndexKey("-1.7")).toBe(true);
        });

        test("Integers ranging from 0 to 2^32-2, but with extra formatting, are NOT array indexes", () => {
            expect(isNonArrayIndexKey("01")).toBe(true);
            expect(isNonArrayIndexKey(" 1")).toBe(true);
            expect(isNonArrayIndexKey("1 ")).toBe(true);
            expect(isNonArrayIndexKey("1,000")).toBe(true);
        });

        test("Non-numeric keys are NOT array indexes", () => {
            expect(isNonArrayIndexKey("1A")).toBe(true);
            expect(isNonArrayIndexKey("Hello!")).toBe(true);
            expect(isNonArrayIndexKey(" ")).toBe(true);
            expect(isNonArrayIndexKey("")).toBe(true);
        });
    });

    describe("getOwnEnumerableNonArrayIndexKeys", () => {
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

        const expected = ["B", "A", "C"];

        test.each([
            ["ES6", getOwnEnumerableNonArrayIndexKeysES6],
            ["ES5", getOwnEnumerableNonArrayIndexKeysES5],
            ["ES3", getOwnEnumerableNonArrayIndexKeysES3]
        ])("getOwnEnumerableNonArrayIndexKeys%s", (label, func) => {
            expect(func(obj)).toEqual(expected);
        });
    });
});
