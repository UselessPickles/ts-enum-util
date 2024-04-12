import { $enum } from "../src";

// NOTE: Intentionally out of order keys and values to confirm original
//       defined order is retained
enum TestEnum {
    D = 0, // duplicate of A
    B = -1.7, // not a positive integer
    A = 0,
    C = 2
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

        expect(Object.keys(TestEnum)).toEqual([
            "0",
            "2",
            "D",
            "B",
            "-1.7",
            "A",
            "C"
        ]);
        expect(Object.getOwnPropertyNames(TestEnum)).toEqual([
            "0",
            "2",
            "D",
            "B",
            "-1.7",
            "A",
            "C"
        ]);

        const result = [];
        // tslint:disable-next-line:forin
        for (const key in TestEnum) {
            result.push(key);
        }

        expect(result).toEqual(["0", "2", "D", "B", "-1.7", "A", "C"]);
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
                    value: TestEnum.D
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

            expect(result).toEqual(["D0", "B-1.7", "A0", "C2"]);

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

            expect(result).toEqual(["D0", "B-1.7", "A0", "C2"]);

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
        expect(enumWrapper.asKeyOrDefault(undefined, "foo")).toBe("foo");
    });

    test("isValue()", () => {
        expect(enumWrapper.isValue(TestEnum.A)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.B)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.C)).toBe(true);
        expect(enumWrapper.isValue(TestEnum.D)).toBe(true);

        expect(enumWrapper.isValue(-1)).toBe(false);
        expect(enumWrapper.isValue(null)).toBe(false);
        expect(enumWrapper.isValue(undefined)).toBe(false);
    });

    test("asValueOrThrow()", () => {
        expect(enumWrapper.asValueOrThrow(TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrThrow(TestEnum.B)).toBe(TestEnum.B);
        expect(enumWrapper.asValueOrThrow(TestEnum.C)).toBe(TestEnum.C);
        expect(enumWrapper.asValueOrThrow(TestEnum.D)).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.asValueOrThrow(-1);
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

        expect(enumWrapper.asValueOrDefault(-1)).toBe(undefined);
        expect(enumWrapper.asValueOrDefault(null, TestEnum.A)).toBe(TestEnum.A);
        expect(enumWrapper.asValueOrDefault(undefined, -2)).toBe(-2);
    });

    test("getKeyOrThrow()", () => {
        // A and D have duplicate values, but A is ordered after D, and last duplicate entry wins,
        // so A's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKeyOrThrow(TestEnum.A)).toBe("A");
        expect(enumWrapper.getKeyOrThrow(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKeyOrThrow(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKeyOrThrow(TestEnum.D)).toBe("A");

        expect(() => {
            enumWrapper.getKeyOrThrow(-1);
        }).toThrow();

        expect(() => {
            enumWrapper.getKeyOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.getKeyOrThrow(undefined);
        }).toThrow();
    });

    test("getKeyOrDefault()", () => {
        // A and D have duplicate values, but A is ordered after D, and last duplicate entry wins,
        // so A's key is returned when looking up the value of A or D.
        expect(enumWrapper.getKeyOrDefault(TestEnum.A)).toBe("A");
        expect(enumWrapper.getKeyOrDefault(TestEnum.B)).toBe("B");
        expect(enumWrapper.getKeyOrDefault(TestEnum.C)).toBe("C");
        expect(enumWrapper.getKeyOrDefault(TestEnum.D)).toBe("A");

        expect(enumWrapper.getKeyOrDefault(-1)).toBe(undefined);
        expect(enumWrapper.getKeyOrDefault(null, "A")).toBe("A");
        expect(enumWrapper.getKeyOrDefault(undefined, "foo")).toBe("foo");
    });

    test("getValueOrThrow()", () => {
        expect(enumWrapper.getValueOrThrow("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrThrow("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValueOrThrow("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValueOrThrow("D")).toBe(TestEnum.D);

        expect(() => {
            enumWrapper.getValueOrThrow("blah");
        }).toThrow();

        expect(() => {
            // Name of a property on Object.prototype
            enumWrapper.getValueOrThrow("toString");
        }).toThrow();

        expect(() => {
            enumWrapper.getValueOrThrow(null);
        }).toThrow();

        expect(() => {
            enumWrapper.getValueOrThrow(undefined);
        }).toThrow();
    });

    test("getValueOrDefault()", () => {
        expect(enumWrapper.getValueOrDefault("A")).toBe(TestEnum.A);
        expect(enumWrapper.getValueOrDefault("B")).toBe(TestEnum.B);
        expect(enumWrapper.getValueOrDefault("C")).toBe(TestEnum.C);
        expect(enumWrapper.getValueOrDefault("D")).toBe(TestEnum.D);

        expect(enumWrapper.getValueOrDefault("blah")).toBe(undefined);
        // Name of a property on Object.prototype
        expect(enumWrapper.getValueOrDefault("toString")).toBe(undefined);
        expect(enumWrapper.getValueOrDefault(null, TestEnum.A)).toBe(
            TestEnum.A
        );
        expect(enumWrapper.getValueOrDefault(undefined, -1)).toBe(-1);
    });

    test("createEnumSubset()", () => {
        expect(enumWrapper.createEnumSubset("A", "C")).toEqual({
            A: TestEnum.A,
            C: TestEnum.C
        });
    });
});
