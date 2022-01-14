# Migration Guide: from `ts-string-visitor`

The functionality of `ts-string-visitor`
([npm](https://www.npmjs.com/package/ts-string-visitor),
[github](https://github.com/UselessPickles/ts-string-visitor)) was merged into
`ts-enum-util` v4. This guide will help you convert existing `ts-string-visitor`-based
code to use equivalent functionality in `ts-enum-util`.

# Contents

<!-- TOC depthFrom:2 -->

-   [By Example](#by-example)
    -   [String Visitor](#string-visitor)
    -   [String Mapper](#string-mapper)
-   [Notes About Differences](#notes-about-differences)
    -   [Numeric Values Now Supported!](#numeric-values-now-supported)
    -   [Simplified imports](#simplified-imports)
    -   [Special keys for handling `null`/`undefined`/unexpected values](#special-keys-for-handling-nullundefinedunexpected-values)

<!-- /TOC -->

## By Example

Here's a couple simple code examples of `ts-string-visitor` code and equivalent
code using `ts-enum-util` to demonstrate the differences.

All examples assume a variable named `value` of type `RGB | null |undefined`
exists, where `RGB` is defined as:

```ts
enum RGB {
    R = "r",
    G = "g",
    B = "b"
}
```

### String Visitor

Using `ts-string-visitor`:

```ts
import { visitString } from "ts-string-visitor";

visitString(value).with({
    [RGB.R]: () => {},
    // explicitly unhandled entry
    [RGB.G]: visitString.unhandled,
    [RGB.B]: () => {},
    handleNull: () => {},
    handleUndefined: () => {},
    handleUnexpected: () => {}
});
```

Using `ts-enum-util`:

```ts
import { $enum } from "ts-enum-util";

$enum.visitValue(value).with({
    [RGB.R]: () => {},
    // explicitly unhandled entry
    [RGB.G]: $enum.unhandledEntry,
    [RGB.B]: () => {},
    [$enum.handleNull]: () => {},
    [$enum.handleUndefined]: () => {},
    [$enum.handleUnexpected]: () => {}
});
```

### String Mapper

Using `ts-string-visitor`:

```ts
import { mapString } from "ts-string-visitor";

const result = mapString(value).with({
    [RGB.R]: 1,
    // explicitly unhandled entry
    [RGB.G]: mapString.unhandled,
    [RGB.B]: 2,
    handleNull: 3,
    handleUndefined: 4,
    handleUnexpected: 5
});
```

Using `ts-enum-util`:

```ts
import { $enum } from "ts-enum-util";

const result = $enum.mapValue(value).with({
    [RGB.R]: 1,
    // explicitly unhandled entry
    [RGB.G]: $enum.unhandledEntry,
    [RGB.B]: 2,
    [$enum.handleNull]: 3,
    [$enum.handleUndefined]: 4,
    [$enum.handleUnexpected]: 5
});
```

## Notes About Differences

### Numeric Values Now Supported!

`ts-string-visitor` only supported visiting/mapping string literal/enum types. Thanks to advancements in key types in TypeScript 2.9, `ts-enum-util`'s Value Visitor/Mapper functionality now supports numeric literal/enum types too!

### Simplified imports

Everything now is now conveniently accessible as a property of `$enum`, so there's
less for you to remember. Just start typing `$enum.` and your IDE should be able
to help you with adding the `import` statement and suggesting available
methods/properties of `$enum`.

### Special keys for handling `null`/`undefined`/unexpected values

The special keys for handling `null`, `undefined`, and unexpected values
used to be simple string keys. Now they are `unique symbol` keys, which guarantee
zero chance of collision between the special handler keys and legitimate string
literal or string enum values to be visited/mapped, in case you really are processing a value that could literally be `"handleNull"`, etc.
