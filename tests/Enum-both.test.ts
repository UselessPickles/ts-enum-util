import {Enum, EnumWrapper} from "../src";

enum TestEnum {
    A,
    B = "2",
    C = 2 // duplicate of B, but number instead of string
}

describe("Enum: number enum", () => {
    test("Enum()", () => {
        const result1 = Enum(TestEnum);
        const result2 = Enum(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });
});
