import { StrictEnumParam } from "ts-enum-util";

type TestType = "a" | "b" | "c";

declare const value: TestType;

declare function foo<Value extends TestType>(
    // tslint:disable-next-line:no-unnecessary-generics
    value: StrictEnumParam<TestType, Value>
): void;

foo("a");
foo(value);
