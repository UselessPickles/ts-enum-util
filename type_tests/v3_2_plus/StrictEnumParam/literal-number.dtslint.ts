import { StrictEnumParam } from "ts-enum-util";

type TestType = 1 | 2 | 3;
declare const value: TestType;
declare const num: number;

declare function foo<Value extends TestType>(
    // tslint:disable-next-line:no-unnecessary-generics
    value: StrictEnumParam<TestType, Value>
): void;

foo(1);
foo(value);
// $ExpectError
foo(10);
// $ExpectError
foo(num);
