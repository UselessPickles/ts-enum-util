import { $enum } from "../src";

// NOTE: Intentionally out of order keys and values to confirm original
//       defined order is retained
enum TestEnum {
    D = "a", // duplicate of A
    B = "b",
    A = "a",
    C = "c"
}

describe("EnumWrapper: string enum", () => {
    const enumWrapper = $enum(TestEnum);

    test("@@toStringTag()", () => {
        expect(Object.prototype.toString.call(enumWrapper)).toBe(
            "[object EnumWrapper]"
        );
    });

    test("toString()", () => {
        expect(enumWrapper.toString()).toBe("[object EnumWrapper]");
    });

    test("does not observably alter the enum", () => {
        // Wrap the enum, then confirm that there are no extra properties/keys available
        $enum(TestEnum);

        expect(Object.keys(TestEnum)).toEqual(["D", "B", "A", "C"]);
        expect(Object.getOwnPropertyNames(TestEnum)).toEqual([
            "D",
            "B",
            "A",
            "C"
        ]);

        const result = [];
        for (const key in TestEnum) {
            if (true) {
                // bypass tslint error
                result.push(key);
            }
        }

        expect(result).toEqual(["D", "B", "A", "C"]);
    });

    describe("is immutable at run time", () => {
        test("length", () => {
            expect(() => {
                (enumWrapper as any).length = 42;
            }).toThrow();
        });

        test("size", () => {
            expect(() => {
                (enumWrapper as any).size = 42;
            }).toThrow();
        });

        test("index signature", () => {
            expect(() => {
                (enumWrapper as any)[0] = ["D", TestEnum.D];
            }).toThrow();
        });

        test("index signature entries", () => {
            expect(() => {
                (enumWrapper[0] as any)[0] = "BLAH!";
            }).toThrow();

            expect(() => {
                (enumWrapper[0] as any)[1] = "FOO!";
            }).toThrow();
        });
    });

    describe("is Array-Like", () => {
        test("length", () => {
            expect(enumWrapper.length).toBe(4);
        });

        test("index signature", () => {
            expect(enumWrapper[0]).toEqual(["D", TestEnum.D]);
            expect(enumWrapper[1]).toEqual(["B", TestEnum.B]);
            expect(enumWrapper[2]).toEqual(["A", TestEnum.A]);
            expect(enumWrapper[3]).toEqual(["C", TestEnum.C]);
        });
    });

    describe("is Map-Like", () => {
        test("size", () => {
            expect(enumWrapper.size).toBe(4);
        });

        describe("keys()", () => {
            test("returns an iterator", () => {
                const keys = enumWrapper.keys();
                const next = keys.next();

                expect(next).toEqual({
                    done: false,
                    value: "D"
                });
            });

            test("iterates all keys", () => {
                const expected = ["D", "B", "A", "C"];
                const result = Array.from(enumWrapper.keys());
                expect(result).toEqual(expected);
            });
        });

        describe("values()", () => {
            test("returns an iterator", () => {
                const values = enumWrapper.values();
                const next = values.next();

                expect(next).toEqual({
                    done: false,
                    value: TestEnum.A
                });
            });

            test("iterates all values", () => {
                const expected = [
                    TestEnum.D,
                    TestEnum.B,
                    TestEnum.A,
                    TestEnum.C
                ];
                const result = Array.from(enumWrapper.values());
                expect(result).toEqual(expected);
            });
        });

        describe("entries()", () => {
            test("returns an iterator", () => {
                const entries = enumWrapper.entries();
                const next = entries.next();

                expect(next).toEqual({
                    done: false,
                    value: ["D", TestEnum.D]
                });
            });

            test("iterates all entries", () => {
                const expected = [
                    ["D", TestEnum.D],
                    ["B", TestEnum.B],
                    ["A", TestEnum.A],
                    ["C", TestEnum.C]
                ];
                const result = Array.from(enumWrapper.entries());

                expect(result).toEqual(expected);
            });

            test("iterated entries are immutable", () => {
                const entry = enumWrapper.entries().next().value;

                expect(() => {
                    (entry[0] as any) = "C";
                }).toThrow();

                expect(() => {
                    (entry[1] as any) = TestEnum.C;
                }).toThrow();
            });
        });

        describe("@@iterator()", () => {
            test("returns an iterator", () => {
                const entries = enumWrapper[Symbol.iterator]();
                const next = entries.next();

                expect(next).toEqual({
                    done: false,
                    value: ["D", TestEnum.D]
                });
            });

            test("iterates all entries", () => {
                const expected = [
                    ["D", TestEnum.D],
                    ["B", TestEnum.B],
                    ["A", TestEnum.A],
                    ["C", TestEnum.C]
                ];
                const result = Array.from(enumWrapper[Symbol.iterator]());

                expect(result).toEqual(expected);
            });

            test("iterated entries are immutable", () => {
                const entry = enumWrapper[Symbol.iterator]().next().value;

                expect(() => {
                    (entry[0] as any) = "C";
                }).toThrow();

                expect(() => {
                    (entry[1] as any) = TestEnum.C;
                }).toThrow();
            });
        });

        describe("forEach()", () => {
            test("without context", () => {
                const context = {
                    iteratee: function(): void {
                        expect(this).not.toBe(context);
                    }
                };

                const iterateeSpy = jest.fn(context.iteratee);

                enumWrapper.forEach(iterateeSpy);

                expect(iterateeSpy.mock.calls).toEqual([
                    [TestEnum.D, "D", enumWrapper, 0],
                    [TestEnum.B, "B", enumWrapper, 1],
                    [TestEnum.A, "A", enumWrapper, 2],
                    [TestEnum.C, "C", enumWrapper, 3]
                ]);
            });

            test("with context", () => {
                const context = {
                    iteratee: function(): void {
                        expect(this).toBe(context);
                    }
                };

                const iterateeSpy = jest.fn(context.iteratee);

                enumWrapper.forEach(iterateeSpy, context);

                expect(iterateeSpy.mock.calls).toEqual([
                    [TestEnum.D, "D", enumWrapper, 0],
                    [TestEnum.B, "B", enumWrapper, 1],
                    [TestEnum.A, "A", enumWrapper, 2],
                    [TestEnum.C, "C", enumWrapper, 3]
                ]);
            });
        });
    });

    test("indexOfKey()", () => {
        expect(enumWrapper.indexOfKey("B")).toBe(1);
        expect(enumWrapper.indexOfKey("C")).toBe(3);
    });

    test("indexOfValue()", () => {
        expect(enumWrapper.indexOfValue(TestEnum.B)).toBe(1);
        expect(enumWrapper.indexOfValue(TestEnum.C)).toBe(3);
    });

    test("getKeys()", () => {
        const expected = ["D", "B", "A", "C"];
        const result = enumWrapper.getKeys();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = "C";
        expect(enumWrapper.getKeys()).toEqual(expected);
    });

    test("getValues()", () => {
        const expected = [TestEnum.D, TestEnum.B, TestEnum.A, TestEnum.C];
        const result = enumWrapper.getValues();
        expect(result).toEqual(expected);

        // test for defensive copy
        result[0] = TestEnum.C;
        expect(enumWrapper.getValues()).toEqual(expected);
    });

    describe("getEntries()", () => {
        test("returns array of entries", () => {
            const expected = [
                ["D", TestEnum.D],
                ["B", TestEnum.B],
                ["A", TestEnum.A],
                ["C", TestEnum.C]
            ];
            const result = enumWrapper.getEntries();
            expect(result).toEqual(expected);

            // test for defensive copy
            result[0] = ["C", TestEnum.C];
            expect(enumWrapper.getEntries()).toEqual(expected);
        });

        test("entries are immutable", () => {
            const entry = enumWrapper.getEntries()[0];

            expect(() => {
                (entry[0] as any) = "C";
            }).toThrow();

            expect(() => {
                (entry[1] as any) = TestEnum.C;
            }).toThrow();
        });
    });

    describe("map()", () => {
        test("without context", () => {
            const context = {
                iteratee: function(value: TestEnum, key: string): string {
                    expect(this).not.toBe(context);
                    return key + String(value);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            const result = enumWrapper.map(iterateeSpy);

            expect(result).toEqual(["Da", "Bb", "Aa", "Cc"]);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.D, "D", enumWrapper, 0],
                [TestEnum.B, "B", enumWrapper, 1],
                [TestEnum.A, "A", enumWrapper, 2],
                [TestEnum.C, "C", enumWrapper, 3]
            ]);
        });

        test("with context", () => {
            const context = {
                iteratee: function(value: TestEnum, key: string): string {
                    expect(this).toBe(context);
                    return key + String(value);
                }
            };

            const iterateeSpy = jest.fn(context.iteratee);

            const result = enumWrapper.map(iterateeSpy, context);

            expect(result).toEqual(["Da", "Bb", "Aa", "Cc"]);

            expect(iterateeSpy.mock.calls).toEqual([
                [TestEnum.D, "D", enumWrapper, 0],
                [TestEnum.B, "B", enumWrapper, 1],
                [TestEnum.A, "A", enumWrapper, 2],
                [TestEnum.C, "C", enumWrapper, 3]
            ]);
        });
    });

    test("isKey()", () => {
        expect(enumWrapper.isKey("A")).toBe(true);
        expect(enumWrapper.isKey("B")).toBe(true);
        expect(enumWrapper.isKey("C")).toBe(true);
        expect(enumWrapper.isKey("D")).toBe(true);

        expect(enumWrapper.isKey("blah")).toBe(false);
        // Name of a property on Object.prototype
        expect(enumWrapper.isKey("toString")).toBe(false);
        expect(enumWrapper.isKey(null)).toBe(false);
        expect(enumWrapper.isKey(undefined)).toBe(false);
    });

    test("asKeyOrThrow()", () => {
        expect(enumWrapper.asKeyOrThrow("A")).toBe("A");
        expect(enumWrapper.asKeyOrThrow("B")).toBe("B");
        expect(enumWrapper.asKeyOrThrow("C")).toBe("C");
        expect(enumWrapper.asKeyOrThrow("D")).toBe("D");

        expect(() => {
            enumWrapper.asKeyOrThrow("blah");
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.asKeyOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.asKeyOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.asKeyOrThrow(undefined);
        }).toThrow();
    });

    test("asKeyOrDefault()", () => {
        expect(enumWrapper.asKeyOrDefault("A")).toBe("A");
        expect(enumWrapper.asKeyOrDefault("B")).toBe("B");
        expect(enumWrapper.asKeyOrDefault("C")).toBe("C");
        expect(enumWrapper.asKeyOrDefault("D")).toBe("D");

        expect(enumWrapper.asKeyOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.asKeyOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.asKeyOrDefault(null, "A")).toBe("A");
        expect(enumWrapper.asKeyOrDefault(undefined, "A")).toBe("A");

        expect(() => {
            enumWrapper.asKeyOrDefault(undefined, "invalid!" as any);
        }).toThrow();
    });

    test("isValue()", () => {
        expect(enumWrapper.isValue(TestEnum.A)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.B)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.C)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.D)).toBe(true);

        expect(enumWrapper.isValue("foo")).toBe(false);
        // Name of a property on Object.prototype
        expect(enumWrapper.isValue("toString")).toBe(false);
        expect(enumWrapper.isValue(null)).toBe(false);
        expect(enumWrapper.isValue(undefined)).toBe(false);
    });

    test("asValueOrThrow()", () => {
        expect(enumWrapper.asValueOrThrow(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrThrow(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValueOrThrow(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValueOrThrow(TestEnum.D)).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.asValueOrThrow("foo");
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.asValueOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.asValueOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.asValueOrThrow(undefined);
        }).toThrow();
    });

    test("asValueOrDefault()", () => {
        expect(enumWrapper.asValueOrDefault(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValueOrDefault(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValueOrDefault(TestEnum.D)).toBe(TestEnum.D);

        expect(enumWrapper.asValueOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.asValueOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.asValueOrDefault(null, TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(undefined, TestEnum.A)).toBe(
            TestEnum.A
        );
    });

    test("getKey()", () => {
        // A and D have duplicate values, but A is ordered after D, and last duplicate entry wins,
        // so A's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKey(TestEnum.A)).toBe("A");
        expect(enumWrapper.getKey(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKey(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKey(TestEnum.D)).toBe("A");

        // Invalid value causes error
        expect(() => {
            enumWrapper.getKey((-1 as unknown) as TestEnum);
        }).toThrow();
        expect(() => {
            enumWrapper.getKey(("blah" as unknown) as TestEnum);
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.getKey(("toString" as unknown) as TestEnum);
        }).toThrow();

        expect(enumWrapper.getKey(null)).toBe(undefined);
        expect(enumWrapper.getKey(null, "A")).toBe("A");

        expect(enumWrapper.getKey(undefined)).toBe(undefined);
        expect(enumWrapper.getKey(undefined, "A")).toBe("A");

        // Invalid default key causes error
        expect(() => {
            enumWrapper.getKey(undefined, ("WRONG!" as unknown) as "A");
        }).toThrow();
        // Invalid default key causes error, even if the default won't be used
        expect(() => {
            enumWrapper.getKey(TestEnum.A, ("WRONG!" as unknown) as "A");
        }).toThrow();
    });

    test("getValue()", () => {
        expect(enumWrapper.getValue("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValue("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValue("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValue("D")).toBe(TestEnum.D);

        // Invalid key causes error
        expect(() => {
            enumWrapper.getValue(("blah" as unknown) as "A");
        }).toThrow();
        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.getValue(("toString" as unknown) as "A");
        }).toThrow();

        expect(enumWrapper.getValue(null)).toBe(undefined);
        expect(enumWrapper.getValue(null, TestEnum.A)).toBe(TestEnum.A);

        expect(enumWrapper.getValue(undefined)).toBe(undefined);
        expect(enumWrapper.getValue(undefined, TestEnum.A)).toBe(TestEnum.A);

        // Invalid default value causes error
        expect(() => {
            enumWrapper.getValue(undefined, (-1 as unknown) as TestEnum);
        }).toThrow();
        // Invalid default value causes error, even if the default won't be used
        expect(() => {
            enumWrapper.getValue("A", (-1 as unknown) as TestEnum);
        }).toThrow();
    });
});
