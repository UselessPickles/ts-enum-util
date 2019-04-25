import { StrictEnumParam } from "ts-enum-util";

enum TestEnum {
    A = 1 << 0,
    B,
    C
}

declare const value: TestEnum;
declare const num: number;

declare function foo<Value extends TestEnum>(
    // tslint:disable-next-line:no-unnecessary-generics
    value: StrictEnumParam<TestEnum, Value>
): void;

foo(TestEnum.A);
foo(value);
foo(1);
// No error; can't prevent number -> enum params for computed enums
foo(10);
// No error; can't prevent number -> enum params for computed enums
foo(num);
