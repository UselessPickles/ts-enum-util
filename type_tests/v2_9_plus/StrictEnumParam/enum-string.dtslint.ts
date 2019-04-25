import { StrictEnumParam } from "ts-enum-util";

enum TestEnum {
    A = "a",
    B = "b",
    C = "c"
}

declare const value: TestEnum;

declare function foo<Value extends TestEnum>(
    // tslint:disable-next-line:no-unnecessary-generics
    value: StrictEnumParam<TestEnum, Value>
): void;

foo(TestEnum.A);
foo(value);
