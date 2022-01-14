# ts-enum-util | Enum Value Visitor/Mapper

Generic TypeScript Visitor and Mapper for Enums and String/Number Literal Type Unions

# Contents

<!-- TOC depthFrom:2 -->

-   [Basic Usage Examples](#basic-usage-examples)
    -   [Visitor](#visitor)
    -   [Mapper](#mapper)
-   [General Usage and Terminology](#general-usage-and-terminology)
    -   [Visitor](#visitor-1)
    -   [Mapper](#mapper-1)
-   [Handling Null/Undefined](#handling-nullundefined)
-   [Handling Unexpected Values at Run Time](#handling-unexpected-values-at-run-time)
-   [Choosing to Not Handle Certain Values](#choosing-to-not-handle-certain-values)
-   [Visitor Method Return Values](#visitor-method-return-values)
-   [Being Explicit About Visitor/Mapper Result Type](#being-explicit-about-visitormapper-result-type)
-   [Visitor Method Parameters](#visitor-method-parameters)
-   [Sharing Visitor Methods Across Multiple Values](#sharing-visitor-methods-across-multiple-values)
    -   [Without Using Visitor Method Parameters](#without-using-visitor-method-parameters)
    -   [Using Visitor Method Parameters](#using-visitor-method-parameters)
-   [Visiting/Mapping Enums](#visitingmapping-enums)
    -   [Visits/Maps Enum _Values_ - Not Names](#visitsmaps-enum-_values_---not-names)
    -   [Enum Visitor Method Parameter Types](#enum-visitor-method-parameter-types)
    -   [Only Literal "Union Enums" Are Supported](#only-literal-union-enums-are-supported)
    -   [Both String and Numeric Enums Are Supported](#both-string-and-numeric-enums-are-supported)
-   [What's up with this chained `$enum.visitValue().with()` syntax?](#whats-up-with-this-chained-enumvisitvaluewith-syntax)

<!-- /TOC -->

## Migrating from `ts-string-visitor`

See [Migration Guide: Upgrading From `ts-string-visitor`](./docs/migration_from_ts-string-visitor.md)

## Basic Usage Examples

### Visitor

Example of the generalized visitor.

```ts
import { $enum } from "ts-enum-util";

type RGB = "r" | "g" | "b";

// Example function that uses $enum.visitValue() to convert a RGB value
// to a display label
function getRgbLabel(rgb: RGB): string {
    // Pass the value to $enum.visitValue(), and provide a visitor
    // implementation to $enum.visitValue().with()
    return $enum.visitValue(rgb).with({
        // The visitor must have a function property for every
        // possible value of the string literal union type.
        // TypeScript compilation will fail if you miss any values,
        // or if you include extras that don't exist in the type.
        r: () => {
            return "Red";
        },
        g: () => {
            // This function is called when "g" is passed in as the
            // value for 'rgb'. The return value of this function is
            // returned by $enum.visitValue().with().
            return "Green";
        },
        b: () => {
            return "Blue";
        }
    });
}

const result = getRgbLabel("g"); // result === "Green"
```

### Mapper

Example of the simpler Mapper, for when you just need to map string/number literal union or enum values to some other value without any logic.

```ts
import { $enum } from "ts-enum-util";

type RGB = "r" | "g" | "b";

// Example function that uses $enum.mapValue() to convert a RGB value
// to a display label
function getRgbLabel(rgb: RGB): string {
    // Pass the value to $enum.mapValue(), and provide a mapper
    // implementation to $enum.mapValue().with()
    return $enum.mapValue(rgb).with({
        // The mapper must have a property for every
        // possible value of the string literal union type.
        // TypeScript compilation will fail if you miss any values,
        // or if you include extras that don't exist in the type.
        r: "Red",
        // This propery's value is looked up and returned when
        // "g" is passed in as the value for 'rgb'.
        g: "Green",
        b: "Blue"
    });
}

const result = getRgbLabel("g"); // result === "Green"
```

## General Usage and Terminology

This section explains in general how to use `ts-enum-util`'s Enum value Visitor/Mapper, and defines some terminology that is used throughout this document.

### Visitor

A visitor is used to execute a function based on the value of a string/number literal union or enum type.

The `$enum.visitValue` method is used to "visit" a string/number literal union or enum value as follows:

`[result] = $enum.visitValue([value]).with([visitor])`

Where:

-   `[value]` is a value whose type is either a string/number literal union or enum.
-   `[visitor]` is an object whose property names match all possible values of `[value]`'s type, and the property values are functions that will be called when the corresponding property name value is passed to `$enum.visitValue`.
-   `[result]` is the value returned by whichever visitor function is called. NOTE: Visitors are not required to return a value. You may choose to implement a visitor that only performs logic for each possible string literal/enum value.

Note: Every visitor method must have the same return type. You may want to consider [Being Explicit About Visitor/Mapper Result Type](#being-explicit-about-visitormapper-result-type).

See the [Visitor](#visitor) usage example.

### Mapper

A mapper is used to simply convert the value of a string/number literal union or enum type into some other value. This is less powerful than a visitor, but also simpler with less boilerplate code.

The `$enum.mapValue` method is used to "map" a string/number literal union or enum value as follows:

`[result] = $enum.mapValue([value]).with([mapper])`

Where:

-   `[value]` is a value whose type is either a string/number literal union or enum.
-   `[mapper]` is an object whose property names match all possible values of `[value]`'s type, and the property values are the mapped values that will be returned when the corresponding property name value is passed to `$enum.mapValue`.
-   `[result]` is the value of whichever `[mapper]` property matched `[value]`.

Note: Every property of your mapper must be of the same type. You may want to consider [Being Explicit About Visitor/Mapper Result Type](#being-explicit-about-visitormapper-result-type).

See the [Mapper](#mapper) usage example.

## Handling Null/Undefined

The `$enum.visitValue` and `$enum.mapValue` methods are overloaded to handle every combination of its parameter being possibly `null` and/or `undefined`.

If (and only if) the parameter may be `null`, then your visitor/mapper MUST include a property named `[$enum.handleNull]`. The value of this property will be used to visit/map `null` values.

If (and only if) the parameter may be `undefined`, then your visitor/mapper MUST include a property named `[$enum.handleUndefined]`. The value of this property will be used to visit/map `undefined` values.

`$enum.handleNull` and `$enum.handleUndefined` are both unique symbols that guarantee zero possibility of
naming collision with actual values that you may be visiting/mapping.

Example (Visitor):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB | null): string {
    // The type of 'rgb' includes 'null', so the visitor must
    // handle null
    return $enum.visitValue(rgb).with({
        r: () => {
            return "Red";
        },
        g: () => {
            return "Green";
        },
        b: () => {
            return "Blue";
        },
        [$enum.handleNull]: () => {
            return "null";
        }
    });
}

const result = getRgbLabel(null); // result === "null"
```

Example (Mapper):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB | null): string {
    // The type of 'rgb' includes 'null', so the mapper must
    // handle null
    return $enum.mapValue(rgb).with({
        r: "Red",
        g: "Green",
        b: "Blue",
        [$enum.handleNull]: "null"
    });
}

const result = getRgbLabel(null); // result === "null"
```

## Handling Unexpected Values at Run Time

When processing data from an external source at run time (e.g., data from an API), there's no guarantee that it will be constrained to the expected types/values in your TypeScript code. Both `$enum.visitValue` and `$enum.mapValue` will detect unexpected values at run time. The default behavior is to throw an error when an unexpected value is encountered at run time. The encountered value is included in the error message for convenience.

If you would like to override the default behavior, then you may provide the optional `[$enum.handleUnexpected]` property in your visitor or mapper implementation.

`$enum.handleUndefined` is a unique symbol that guarantee zero possibility of
naming collision with actual values that you may be visiting/mapping.

The parameter of the `handleUnexpected` method in a visitor is of type `string`, possibly unioned with type `null` and/or `undefined`, depending on whether `null`/`undefined` are unexpected values for the particular usage of `$enum.visitValue`.

See also: [Visitor Method Parameters](#visitor-method-parameters) and [Handling Null/Undefined](#handling-nullundefined).

Example (Visitor):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB): string {
    return $enum.visitValue(rgb).with({
        r: () => {
            return "Red";
        },
        g: () => {
            return "Green";
        },
        b: () => {
            return "Blue";
        },
        [$enum.handleUnexpected]: () => {
            return "Unexpected!";
        }
    });
}

// Type casting to force an unexpected value at run time
const result = getRgbLabel(("blah" as unknown) as RGB); // result === "Unexpected"
```

Example (Mapper):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB): string {
    return $enum.mapValue(rgb).with({
        r: "Red",
        g: "Green",
        b: "Blue",
        [$enum.handleUnexpected]: "Unexpected!"
    });
}

// Type casting to force an unexpected value at run time
const result = getRgbLabel(("blah" as unknown) as RGB); // result === "Unexpected!"
```

## Choosing to Not Handle Certain Values

Sometimes you need to write code that is intentionally designed to only expect/handle a subset of possibilities, and you really just want to throw an error if one of the unsupported values is encountered. Simply provide `$enum.unhandledEntry` as the entry for an unhandled value in a visitor/mapper implementation, and an error will be thrown if that value is encountered at runtime.

Example (Visitor):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB): string {
    return $enum.visitValue(rgb).with({
        r: () => {
            return "Red";
        },
        g: $enum.unhandledEntry,
        b: () => {
            return "Blue";
        }
    });
}

// Throws error: "Unhandled value: g"
const result = getRgbLabel("g");
```

Example (Mapper):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB): string {
    return $enum.mapValue(rgb).with({
        r: "Red",
        g: $enum.mapValue.unhandled,
        b: "Blue"
    });
}

// Throws error: "Unhandled value: g"
const result = getRgbLabel("g");
```

## Visitor Method Return Values

Your visitor methods can return a value, which will be returned by the call to `$enum.visitValue().with()`.

BEWARE: All visitor methods within a given visitor MUST have the same return type. If you have a mixture of return types, then the compiler will decide that one of them is correct, and the others are wrong. The resulting compiler error may be confusing if you and the compiler do not agree on what the correct return type should have been.

Keep reading to learn how to avoid this confusion...

## Being Explicit About Visitor/Mapper Result Type

When designing a visitor/mapper to return a value, it is often helpful to explicitly provide the desired return type as a template parameter to the `with()` function.

Example (Visitor):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB): string {
    // Tell the compiler that you intend to return a string from the
    // visitor
    return $enum.visitValue(rgb).with<string>({
        // Compiler error for this property
        r: () => {
            return 10;
        },
        g: () => {
            return "Green";
        },
        b: () => {
            return "Blue";
        }
    });
}
```

Example (Mapper):

```ts
type RGB = "r" | "g" | "b";

function getRgbLabel(rgb: RGB): string {
    // Tell the compiler that you intend to return a string from the
    // mapper
    return $enum.mapValue(rgb).with<string>({
        // Compiler error for this property
        r: 10,
        g: "Green",
        b: "Blue"
    });
}
```

In the above examples, it is guaranteed that the compiler will complain about the `"r"` property being/returning type `number` instead of `string`. If you did not provide the <string> hint then the compiler may infer the return type of the visitor/mapper to be `number` and confusingly complain that the OTHER properties are wrong!

## Visitor Method Parameters

The methods of the visitor implementation receive a single parameter: the value being visited. The type of the parameter for each method is EXACTLY the type of the value handled by that method.
Here's a simple (albeit pointless) identity visitor implementation to demonstrate:

```ts
type RGB = "r" | "g" | "b";

function rgbIdentity(rgb: RGB | null | undefined): RGB | null | undefined {
    return $enum.visitValue(rgb).with({
        r: (value) => {
            // type of 'value' is exactly "r"
            // (not RGB | null | undefined)
            return value;
        },
        g: (value) => {
            // type of 'value' is exactly "g"
            return value;
        },
        b: (value) => {
            // type of 'value' is exactly "b"
            return value;
        },
        [$enum.handleNull]: (value) => {
            // type of 'value' is exactly null
            return value;
        },
        [$enum.handleUndefined]: (value) => {
            // type of 'value' is exactly undefined
            return value;
        }
    });
}

const result = rgbIdentity("g"); // result === "g"
```

## Sharing Visitor Methods Across Multiple Values

Sometimes you want to handle multiple values in the same way, but duplicating code is bad. Here's some examples of how you can share code across multiple values in a visitor.

### Without Using Visitor Method Parameters

If your shared code does not need to reference the value being visited, then it is very simple to share visitor methods across multiple values:

```ts
type RGB = "r" | "g" | "b";

// test if a color value is "supported"
function isSupportedColor(rgb: RGB | null | undefined): boolean {
    // pre-define a handler for all "supported" values
    const handleSupported = (): boolean => {
        return true;
    };

    // pre-defined a handler for all "unsupported" values
    const handleUnsupported = (): boolean => {
        return false;
    };

    return $enum.visitValue(rgb).with<boolean>({
        r: handleSupported,
        // Green is ugly - UNSUPPORTED!
        g: handleUnsupported,
        b: handleSupported,
        [$enum.handleNull]: handleUnsupported,
        [$enum.handleUndefined]: handleUnsupported
    });
}
```

### Using Visitor Method Parameters

If your shared code needs to reference the value being visited, then you have to be conscious of the parameter types involved. The type of the parameter of the shared method must include the types of all values it will handle. Let's enhance the previous example to log every value that is visited.

```ts
type RGB = "r" | "g" | "b";

// test if a color value is "supported"
function isSupportedColor(rgb: RGB | null | undefined): boolean {
    // Since this handler is not used for null/undefined, there's no
    // need to include those types for the param.
    // The type technically only needs to be ("r" | "b"), but type
    // RGB is more convenient and there's no harm in being overly
    // permissive in this case.
    const handleSupported = (value: RGB): boolean => {
        // Since the type 'value' does not include null/undefined, we
        // can safely call value.toupperCase() without performing a
        // null check first.
        // This is an example of why being restrictive with the type
        // of shared handler can be beneficial.
        console.log(`handling supported value: ${value.toUpperCase()}`);
        return true;
    };

    // This handler is used to handle null/undefined, so it MUST
    // include those types for the param.
    // Again, the type only technically needs to be
    // ("g" | null | undefined), but being more permissive can be
    // more convenient when it's not harmful.
    const handleUnsupported = (value: RGB | null | undefined): boolean => {
        console.warn(`unsupported color encountered: ${value}`);
        return false;
    };

    return $enum.visitValue(rgb).with<boolean>({
        r: handleSupported,
        // Green is ugly - UNSUPPORTED!
        g: handleUnsupported,
        b: handleSupported,
        [$enum.handleNull]: handleUnsupported,
        [$enum.handleUndefined]: handleUnsupported
    });
}
```

## Visiting/Mapping Enums

### Visits/Maps Enum _Values_ - Not Names

TypeScript enums can be visited/mapped with `ts-enum-util`. The important detail to understand is that the _values_ (not the identifiers/names) of the enums are used as the visitor/mapper property names.

```ts
enum RGB {
    // "R" is the name of the identifier.
    // "r" is the value.
    R = "r",
    G = "g",
    B = "b"
}

function getRgbLabel(rgb: RGB): string {
    return $enum.visitValue(rgb).with<string>({
        // This works (my preferred style)
        [RGB.R]: () => {
            return "Red";
        },
        // This also works
        g: () => {
            return "Green";
        },
        // This does NOT work!
        B: () => {
            return "Blue";
        }
    });
}
```

### Enum Visitor Method Parameter Types

Be aware that the type of an enum value is a more specific type than a string literal type. For maximum compile-time type checking benefit, you should treat enums as enum types whenever possible, rather than string literals:

-   Compare against members of the enum, rather than string literals.
-   Use the enum type for variables, params, return types, etc., rather than type string.

### Only Literal "Union Enums" Are Supported

`ts-enum-util`'s Enum value Visitor/Mapper can only work on enums that qualify as "union enums". All members must have literal (non-calculated) values.

Read more about "Union enums and enum member types" here: [Enums - TypeScript](https://www.typescriptlang.org/docs/handbook/enums.html)

### Both String and Numeric Enums Are Supported

String enums are fine. Numeric enums are fine. Even heterogeneous enums (mix of both string and numeric values)
are supported, if you like that kind of thing.

## What's up with this chained `$enum.visitValue().with()` syntax?

You might wonder why I didn't implement `ts-enum-util`'s Enum Value Visitor as a single overloaded `$enum.visitValue` method that accepts both the value AND the visitor. The chained approach I settled on was necessary to:

-   Ensure that the type of visitor (whether it needs to handle null and/or undefined) is driven by whether the visited value may possibly be null/undefined. This is necessary to provide relevant compiler error messages when something isn't right with your code.
-   Allow the return type to be explicitly provided, while allowing the compiler to infer the type of the visited value.

Read more details about other approaches I tried and their flaws in [this github issue comment](https://github.com/Microsoft/TypeScript/issues/20643#issuecomment-352328395).
