import {EnumWrapper} from "../src";

enum TestEnum {
    A = "a",
    B = "b",
    C = "c"
}

describe("EnumWrapper: string enum", () => {
    const enumWrapper = EnumWrapper.createInstance(TestEnum);

    test("getInstance()", () => {
        const result1 = EnumWrapper.getInstance(TestEnum);
        const result2 = EnumWrapper.getInstance(TestEnum);

        expect(result1 instanceof EnumWrapper).toBe(true);
        // returns cached instance
        expect(result1).toBe(result2);
    });

    test("names()", () => {
        const expected = [
            "A",
            "B",
            "C"
        ];
        const result = enumWrapper.names();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = "C";
        expect(enumWrapper.names()).toEqual(expected);
    });

    test("values()", () => {
        const expected = [
            TestEnum.A,
            TestEnum.B,
            TestEnum.C
        ];
        const result = enumWrapper.values();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = TestEnum.C;
        expect(enumWrapper.values()).toEqual(expected);
    });

    test("tuples()", () => {
        const expected = [
            ["A", TestEnum.A],
            ["B", TestEnum.B],
            ["C", TestEnum.C]
        ];
        const result = enumWrapper.tuples();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0][1] = TestEnum.C;
        expect(enumWrapper.tuples()).toEqual(expected);
    });

    test("pairs()", () => {
        const expected = [
            { name: "A", value: TestEnum.A },
            { name: "B", value: TestEnum.B },
            { name: "C", value: TestEnum.C }
        ];
        const result = enumWrapper.pairs();
        expect(result).toEqual(expected);

        // test for defensive copy (cast to any necessary to bypass readonly)
        (result[0] as any).value = TestEnum.C;
        expect(enumWrapper.pairs()).toEqual(expected);
    });

    test("isName()", () => {
        expect(enumWrapper.isName("A")).toBe(true);
        expect(enumWrapper.isName("B")).toBe(true);
        expect(enumWrapper.isName("C")).toBe(true);

        expect(enumWrapper.isName(undefined)).toBe(false);
        expect(enumWrapper.isName("blah")).toBe(false);
    });

    test("asName()", () => {
        expect(enumWrapper.asName("A")).toBe("A");
        expect(enumWrapper.asName("B")).toBe("B");
        expect(enumWrapper.asName("C")).toBe("C");

        expect(() => {
            enumWrapper.asName(undefined);
        }).toThrow();

        expect(() => {
            enumWrapper.asName("blah");
        }).toThrow();
    });

    test("asNameOrDefault()", () => {
        expect(enumWrapper.asNameOrDefault("A")).toBe("A");
        expect(enumWrapper.asNameOrDefault("B")).toBe("B");
        expect(enumWrapper.asNameOrDefault("C")).toBe("C");

        expect(enumWrapper.asNameOrDefault(undefined)).toBe(undefined);
        expect(enumWrapper.asNameOrDefault("blah")).toBe(undefined);
        expect(enumWrapper.asNameOrDefault("blah", "A")).toBe("A");
        expect(enumWrapper.asNameOrDefault("blah", "foo")).toBe("foo");
    });

    test("getValue()", () => {
        expect(enumWrapper.getValue("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValue("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValue("C")).toBe(TestEnum.C);

        expect(() => {
            enumWrapper.getValue(undefined);
        }).toThrow();

        expect(() => {
            enumWrapper.getValue("blah");
        }).toThrow();
    });

    test("getValueOrDefault()", () => {
        expect(enumWrapper.getValueOrDefault("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrDefault("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValueOrDefault("C")).toBe(TestEnum.C);

        expect(enumWrapper.getValueOrDefault(undefined)).toBe(undefined);
        expect(enumWrapper.getValueOrDefault("blah")).toBe(undefined);
        expect(enumWrapper.getValueOrDefault("blah", TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrDefault("blah", "foo")).toBe("foo");
    });

    test("isValue()", () => {
        expect(enumWrapper.isValue(TestEnum.A)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.B)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.C)).toBe(true);

        expect(enumWrapper.isValue(undefined)).toBe(false);
        expect(enumWrapper.isValue("foo")).toBe(false);
    });

    test("asValue()", () => {
        expect(enumWrapper.asValue(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValue(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValue(TestEnum.C)).toBe(TestEnum.C);

        expect(() => {
            enumWrapper.asValue(undefined);
        }).toThrow();

        expect(() => {
            enumWrapper.asValue("foo");
        }).toThrow();
    });

    test("getName()", () => {
        expect(enumWrapper.getName(TestEnum.A)).toBe("A");
        expect(enumWrapper.getName(TestEnum.B)).toBe("B");
        expect(enumWrapper.getName(TestEnum.C)).toBe("C");

        expect(() => {
            enumWrapper.getName(undefined);
        }).toThrow();

        expect(() => {
            enumWrapper.getName("foo");
        }).toThrow();
    });

    test("getNameOrDefault()", () => {
        expect(enumWrapper.getNameOrDefault(TestEnum.A)).toBe("A");
        expect(enumWrapper.getNameOrDefault(TestEnum.B)).toBe("B");
        expect(enumWrapper.getNameOrDefault(TestEnum.C)).toBe("C");

        expect(enumWrapper.getNameOrDefault(undefined)).toBe(undefined);
        expect(enumWrapper.getNameOrDefault("blah")).toBe(undefined);
        expect(enumWrapper.getNameOrDefault("blah", "A")).toBe("A");
        expect(enumWrapper.getNameOrDefault("blah", "foo")).toBe("foo");
    });
});
