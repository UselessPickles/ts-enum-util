import { StrictEnumParam } from "ts-enum-util";

enum TestEnum {
    A,
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
// $ExpectError
foo(10);
// $ExpectError
foo(num);
