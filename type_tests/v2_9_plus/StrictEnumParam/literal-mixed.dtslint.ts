import { StrictEnumParam } from "ts-enum-util";

type TestType = 1 | 2 | "c";

declare const value: TestType;

declare function foo<Value extends TestType>(
    // tslint:disable-next-line:no-unnecessary-generics
    value: StrictEnumParam<TestType, Value>
): void;

foo(1);
foo("c");
foo(value);
