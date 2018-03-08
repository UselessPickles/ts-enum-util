import { EnumWrapper, $enum } from "../src";

enum TestEnum {
    A,
    B = "2",
    C = 2 // duplicate of B, but number instead of string
}

describe("$enum: number+string enum", () => {
    test("returns cached instance", () => {
        const result1 = $enum(TestEnum);
        const result2 = $enum(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });
});
