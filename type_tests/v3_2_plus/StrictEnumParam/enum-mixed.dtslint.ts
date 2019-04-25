import { StrictEnumParam } from "ts-enum-util";

enum TestEnum {
    A,
    B,
    C = "c"
}

declare const value: TestEnum;
declare const str: string;
declare const num: number;
declare const numstr: number | string;

declare function foo<Value extends TestEnum>(
    // tslint:disable-next-line:no-unnecessary-generics
    value: StrictEnumParam<TestEnum, Value>
): void;

foo(TestEnum.A);
foo(TestEnum.C);
foo(1);
foo(value);
// $ExpectError
foo("blah");
// $ExpectError
foo(10);
// $ExpectError
foo(str);
// $ExpectError
foo(num);
// $ExpectError
foo(numstr);
