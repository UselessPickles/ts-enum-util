import {EnumWrapper, $enum} from "../src";

enum TestEnum {
    A,
    B,
    C
}

describe("$enum: number enum", () => {
    test("useCache = true", () => {
        const result1 = $enum(TestEnum, true);
        const result2 = $enum(TestEnum, true);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });

    test("useCache = false", () => {
        const result1 = $enum(TestEnum, false);
        const result2 = $enum(TestEnum, false);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns new instance
        expect(result1).not.toBe(result2);
    });

    test("useCache = default (true)", () => {
        const result1 = $enum(TestEnum);
        const result2 = $enum(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });
});
