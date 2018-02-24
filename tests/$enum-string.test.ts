import {EnumWrapper, $enum} from "../src";

enum TestEnum {
    A = "a",
    B = "b",
    C = "c"
}

describe("$enum: string enum", () => {
    test("returns cached instance", () => {
        const result1 = $enum(TestEnum);
        const result2 = $enum(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });
});
