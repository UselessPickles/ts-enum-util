# ts-enum-util | Enum Wrapper Utilities

Usage documentation for the `EnumWrapper` portion of `ts-enum-util`.

# Contents

<!-- TOC depthFrom:2 -->

-   [Usage Examples](#usage-examples)
    -   [Basic setup for all examples](#basic-setup-for-all-examples)
    -   [Get an `EnumWrapper` instance for an enum](#get-an-enumwrapper-instance-for-an-enum)
    -   [Get count of enum entries](#get-count-of-enum-entries)
    -   [Get lists of enum data](#get-lists-of-enum-data)
    -   [Lookup value by key](#lookup-value-by-key)
    -   [Reverse lookup key by value](#reverse-lookup-key-by-value)
    -   [Validate/convert enum keys](#validateconvert-enum-keys)
    -   [Validate/convert enum values](#validateconvert-enum-values)
    -   [Iteration and Mapping](#iteration-and-mapping)
    -   [Wrapped enums are Array-Like](#wrapped-enums-are-array-like)
    -   [Wrapped enums are Map-Like](#wrapped-enums-are-map-like)
-   [Limitations](#limitations)
-   [Known Issues](#known-issues)
    -   [`WeakMap` Polyfill](#weakmap-polyfill)
-   [General Concepts](#general-concepts)
    -   [Enum-Like Object](#enum-like-object)
    -   [EnumWrapper](#enumwrapper)
    -   [Specific Typing](#specific-typing)
    -   [Map-Like Interface](#map-like-interface)
    -   [Array-Like Interface](#array-like-interface)
    -   [Order of Iteration](#order-of-iteration)
    -   [Caching](#caching)
-   [API Reference](#api-reference)
    -   [Terminology](#terminology)
    -   [\$enum](#\enum)
    -   [Types](#types)
        -   [EnumWrapper](#enumwrapper-1)
        -   [EnumWrapper.Entry](#enumwrapperentry)
        -   [EnumWrapper.Iteratee](#enumwrapperiteratee)
    -   [Array-Like Interface](#array-like-interface-1)
        -   [EnumWrapper.prototype.length](#enumwrapperprototypelength)
        -   [EnumWrapper.prototype.[index]](#enumwrapperprototypeindex)
    -   [Map-Like Interface](#map-like-interface-1)
        -   [EnumWrapper.prototype.size](#enumwrapperprototypesize)
        -   [EnumWrapper.prototype.keys](#enumwrapperprototypekeys)
        -   [EnumWrapper.prototype.values](#enumwrapperprototypevalues)
        -   [EnumWrapper.prototype.entries](#enumwrapperprototypeentries)
        -   [EnumWrapper.prototype.@@iterator](#enumwrapperprototypeiterator)
        -   [EnumWrapper.prototype.forEach](#enumwrapperprototypeforeach)
    -   [Iteration](#iteration)
        -   [EnumWrapper.prototype.forEach](#enumwrapperprototypeforeach-1)
        -   [EnumWrapper.prototype.map](#enumwrapperprototypemap)
    -   [Get Arrays of Enum Data](#get-arrays-of-enum-data)
        -   [EnumWrapper.prototype.getKeys](#enumwrapperprototypegetkeys)
        -   [EnumWrapper.prototype.getValues](#enumwrapperprototypegetvalues)
        -   [EnumWrapper.prototype.getEntries](#enumwrapperprototypegetentries)
    -   [Get Ordered Index of Keys/Values](#get-ordered-index-of-keysvalues)
        -   [EnumWrapper.prototype.indexOfKey](#enumwrapperprototypeindexofkey)
        -   [EnumWrapper.prototype.indexOfValue](#enumwrapperprototypeindexofvalue)
    -   [Key Validation/Typecasting](#key-validationtypecasting)
        -   [EnumWrapper.prototype.isKey](#enumwrapperprototypeiskey)
        -   [EnumWrapper.prototype.asKeyOrThrow](#enumwrapperprototypeaskeyorthrow)
        -   [EnumWrapper.prototype.asKeyOrDefault](#enumwrapperprototypeaskeyordefault)
    -   [Value Validation/Typecasting](#value-validationtypecasting)
        -   [EnumWrapper.prototype.isValue](#enumwrapperprototypeisvalue)
        -   [EnumWrapper.prototype.asValueOrThrow](#enumwrapperprototypeasvalueorthrow)
        -   [EnumWrapper.prototype.asValueOrDefault](#enumwrapperprototypeasvalueordefault)
    -   [Lookup Key by Value](#lookup-key-by-value)
        -   [EnumWrapper.prototype.getKey](#enumwrapperprototypegetkey)
    -   [Lookup Value by Key](#lookup-value-by-key)
        -   [EnumWrapper.prototype.getValue](#enumwrapperprototypegetvalue)

<!-- /TOC -->

## Usage Examples

Here's several small examples `ts-enum-util`'s Enum Wrapper capabilities to give you a quick overview of what it can do, as well as an organized "by example" reference.

Pay special attention to the comments indicating the compile-time type of various results. See [Specific Typing](#specific-typing) for more about data types.

See [API Reference](#api-reference) for more details about method signatures and behaviors.

### Basic setup for all examples

```ts
// import the $enum helper function
import { $enum } from "ts-enum-util";

// Example string enum
// (basic numeric enums also supported)
// (enums with a mix of numeric and string values also supported)
enum RGB {
    R = "r",
    G = "g",
    B = "b"
}
```

### Get an `EnumWrapper` instance for an enum

Use the [\$enum](#enum) function to get an `EnumWrapper` instance for a particular enum.
Read about how `EnumWrapper` instances are cached: [Caching](#caching).

```ts
// type: EnumWrapper<string, RGB>
const wrappedRgb = $enum(RGB);
```

### Get count of enum entries

See also:

-   [Wrapped enums are Array-Like](#wrapped-enums-are-array-like)
-   [Wrapped enums are Map-Like](#wrapped-enums-are-map-like)

```ts
// Part of the Map-like interface implementation
// type: number
// value: 3
const size = $enum(RGB).size;

// Part of the Array-like interface implementation
// type: number
// value: 3
const length = $enum(RGB).length;
```

### Get lists of enum data

See also:

-   [Order of Iteration](#order-of-iteration)
-   [Wrapped enums are Array-Like](#wrapped-enums-are-array-like)
-   [Wrapped enums are Map-Like](#wrapped-enums-are-map-like)

```ts
// type: ("R" | "G" | "B")[]
// value: ["R", "G", "B"]
const keys = $enum(RGB).getKeys();

// type: RGB[]
// value: ["r", "g", "b"]
const values = $enum(RGB).getValues();

// List of key/value pair tuples
// type: [("R" | "G" | "B"), RGB][]
// value: [["R", "r"], ["G", "g"], ["B", "b"]]
const entries = $enum(RGB).getEntries();
```

### Lookup value by key

```ts
// type: RGB
// value: "g"
const value1 = $enum(RGB).getValue("G");

// compiler error: type of key is invalid
// (use asKeyOrThrow or asKeyOrDefault to test/convert
//  untrustworthy key values first)
const value2 = $enum(RGB).getValue("blah");

// type: RGB
// value: "r"
const value4 = $enum(RGB).getValue(undefined, RGB.R);

// compiler error: type of default value is invalid
// (use asValueOrThrow or asValueOrDefault to test/convert
//  untrustworthy default values first)
const value5 = $enum(RGB).getValue("blah", "BLAH!");
```

### Reverse lookup key by value

```ts
// type: ("R" | "G" | "B")
// value: "G"
const key1 = $enum(RGB).getKey("g");

// compiler error: type of value is invalid
// (use asValueOrThrow or asValueOrDefault to test/convert
//  untrustworthy values first)
const key2 = $enum(RGB).getKey("blah");

// type: ("R" | "G" | "B")
// value: "R"
const key4 = $enum(RGB).getKey(undefined, "R");

// compiler error: type of default key is invalid
// (use asKeyOrThrow or asKeyOrDefault to test/convert
//  untrustworthy default key values first)
const key4 = $enum(RGB).getKey(undefined, "BLAH!");
```

### Validate/convert enum keys

```ts
// Some arbitrary string
declare const str: string;

// Returns `true` if 'str' is a valid key of RGB
if ($enum(RGB).isKey(str)) {
    // isKey() is a type guard
    // type of 'str' in here is ("R" | "G" | "B")
}

// type: ("R" | "G" | "B")
// throws error if 'str' is not a valid key for RGB
const key1 = $enum(RGB).asKeyOrThrow(str);

// type: ("R" | "G" | "B") | undefined
// value is undefined if 'str' is not a valid key for RGB
const key2 = $enum(RGB).asKeyOrDefault(str);

// type: ("R" | "G" | "B")
// value is "G" if 'str' is not a valid key for RGB
const key3 = $enum(RGB).asKeyOrDefault(str, "G");
```

### Validate/convert enum values

```ts
// Some arbitrary string
declare const str: string;

// Returns `true` if 'str' is a valid value of RGB
if ($enum(RGB).isValue(str)) {
    // isValue() is a type guard
    // type of 'str' in here is RGB
}

// type: RGB
// throws error if 'str' is not a valid value for RGB
const value1 = $enum(RGB).asValueOrThrow(str);

// type: RGB | undefined
// value is undefined if 'str' is not a valid value for RGB
const value2 = $enum(RGB).asValueOrDefault(str);

// type: RGB
// value is RGB.G if 'str' is not a valid value for RGB
const value3 = $enum(RGB).asValueOrDefault(str, RGB.G);
```

### Iteration and Mapping

See also:

-   [Order of Iteration](#order-of-iteration)

```ts
const wrappedRgb = $enum(RGB);

// iterate all entries in the enum
wrappedRgb.forEach((value, key, wrappedEnum, index) => {
    // type of value is RGB
    // type of key is ("R" | "G" | "B")
    // wrappedEnum is a reference to wrappedRgb
    // index is based on original defined order of the enum
});

// Convert all entries of the enum to an array of mapped values
// value: ["R: r", "G: g", "B: b"]
const mapped = wrappedRgb.map((value, key, wrappedEnum, index) => {
    // type of value is RGB
    // type of key is ("R" | "G" | "B")
    // wrappedEnum is a reference to wrappedRgb
    // index is based on original defined order of the enum
    return `${key}: ${value}`;
});
```

### Wrapped enums are Array-Like

A wrapped enum is similar to a readonly array of enum "entry" tuples.

See also:

-   [Array-Like Interface](#array-like-interface)
-   [Order of Iteration](#order-of-iteration)

```ts
const wrappedRgb = $enum(RGB);

// type: number
// value: 3
const length = wrappedRgb.length;

// type: [("R" | "G" | "B"), RGB]
// value: ["G", "g"]
const entry = wrappedRgb[1];
```

### Wrapped enums are Map-Like

A wrapped enum is similar to a read-only `Map` of enum name -> enum value.

See also:

-   [Map-Like Interface](#map-like-interface) (has explanation of why there's no `get()` or `has()` method)
-   [Order of Iteration](#order-of-iteration)

```ts
const wrappedRgb = $enum(RGB);

// type: number
// value: 3
const size = wrappedRgb.size;

// EnumWrapper is directly iterable like a Map
for (const [key, value] of wrappedRgb) {
    // type of key: ("R" | "G" | "B")
    // type of value: RGB
}

for (const key of wrappedRgb.keys()) {
    // type of key: ("R" | "G" | "B")
}

for (const value of wrappedRgb.values()) {
    // type of value: RGB
}

wrappedRgb.forEach((value, key, wrappedEnum, index) => {
    // type of value is RGB
    // type of key is ("R" | "G" | "B")
    // wrappedEnum is a reference to wrappedRgb
    // index is based on original defined order of the enum
    // NOTE: index param is extra compared to Map's forEach
});
```

## Limitations

-   Does not work with enums that are merged with a namespace containing values (variables, functions, etc.), or otherwise have any additional properties added to the enum's runtime object.
-   Requires the `preserveConstEnums` TypeScript compiler option to work with `const enums`.
-   For certain `Iterable` features of `WrappedEnum` to work, you must either compile with a target of `es6` or higher, or enable the `downlevelIteration` compiler option.

## Known Issues

### `WeakMap` Polyfill

`WeakMap` polyfills typically store values directly on the "key" object (the run-time `enum` object, in this case) as a non-enumerable "secret" (randomly generated) property. This allows for quick O(1) constant time lookups and garbage collection of the value along with the key object, but does add a property to the object. The `WeakMap` secret property will NOT be iterated in `for ... in` loops, and will NOT be included in the results of `Object.keys()`, but it WILL be included in the result of `Object.getOwnPropertyNames()`.

It's hard to imagine this actually causing any problems, and all mainstream browsers have natively supported `WeakMap` since about 2014-2015, so I have decided to go ahead with relying on `WeakMap`. If you run into a problem caused by this, please [report an issue on github](https://github.com/UselessPickles/ts-enum-util/issues).

Read more about the use of `WeakMap` for caching `EnumWrapper` instances here: [Caching](#caching)

## General Concepts

### Enum-Like Object

`ts-enum-util` technically works with any "enum-like" object, which is any object whose property values are of type `string` or `number`.

The most obvious example is a TypeScript `enum`. It can be a standard enum of numeric values, a string enum, or even an enum with a mix of numeric and string values.

### EnumWrapper

The `EnumWrapper` class wraps around an enum-like object and implements all the useful utility methods for that enum.

You likely won't ever directly reference the `EnumWrapper` class because it's much more convenient to use the [\$enum()](#enum) function to obtain a reference to an `EnumWrapper` instance.

### Specific Typing

`EnumWrapper` is genericly typed based on the wrapped enum-like object with several method overloaded to ensure that params and results are as specifically-typed as possible.

For example, when obtaining a key or keys from an `EnumWrapper`, the data type will be a string literal union containing only the specific key names that exist in the enum.

This helps maximize the usefulness of `EnumWrapper` by making it compatible with other strictly typed code related to enums.

### Map-Like Interface

A subset of `EnumWrapper`'s interface overlaps with much of the ES6 `Map` interface. `EnumWrapper` is similar to a read-only `Map` of enum values, keyed by the enum names. The following Map-like features are implemented:

-   [size](#enumwrapperprototypesize) property.
-   [keys](#enumwrapperprototypekeys), [values](#enumwrapperprototypevalues), and [entries](#enumwrapperprototypeentries) methods.
-   [forEach](#enumwrapperprototypeforeach) method.
-   [@@iterator](#enumwrapperprototypeiterator) method (`EnumWrapper` is iterable!).

NOTE: The `Map` interface's `has()` and `get()` methods are intentionally NOT implemented in the interest of clarity and consistency of naming with respect to other `EnumWrapper`-specific methods. The equivalent methods are [isKey](#enumwrapperprototypeiskey) and [getValue](#enumwrapperprototypegetvalue) (with second param omitted).

### Array-Like Interface

`EnumWrapper` implements the `ArrayLike` interface. It is usable as a readonly array of [EnumWrapper.Entry](#enumwrapperentry). This allows you to pass an `EnumWrapper` instance to any method that is designed read/iterate an array-like value, such as most of [lodash](#https://lodash.com/)'s methods for collections and arrays.

### Order of Iteration

`EnumWrapper` does its best to retain the order in which the enum's entries were
originally listed in source code.

When executed in an environment with an ES6-compliant implementation of
`Object.getOwnPropertyNames`, then the order of iteration is _guaranteed_ to match
the order in which the enum was originally defined in source code.

If `Object.getOwnPropertyNames` is not available in the run-time environment, then
there techincally is no official guarantee of the order in which the enum will be
processed by `EnumWrapper`. However, a variety of de-facto standards of how various
browsers and JS run-time environments have implemented object key/property ordering
combined with limited subset of keys/properties processed by `EnumUtil`
(own, enumerable, non-array-index properties only) allows for extremely high practical
confidence that order of definition within the source code will be retained.

Example:

```ts
// enum defined with keys alphabetically out of order and
// values out of order
enum ABC = {
    B = 3,
    A = 1,
    C = 2
}

// defined order is retained: ["B", "A", "C"]
const values = $enum(ABC).getKeys();

// defined order is retained: [3, 1, 2]
const values = $enum(ABC).getValues();
```

### Caching

`EnumWrapper` instances are cached using an ES6 `WeakMap` for quick subsequent retrieval via the [\$enum](#enum) function. This allows you to easily access the `EnumWrapper` functionality for a given enum via the `$enum` function throughout your codebase without worrying about storing a reference to an `EnumWrapper` that is accessible by all of the relevant code.

The use of the `WeakMap` means that even if you use `ts-enum-util` on temporary, dynamically-generated, enum-like objects, there will be no excessive cache bloat or memory leaks. A cached `EnumWrapper` instance will be garbage collected when the enum-like object it is mapped to is garbage collected.

Although `WeakMap` lookups can be extremely efficient (constant time lookups in typical implementations), beware that the ECMAScript specification only requires lookups to be "on average" less than O(n) linear time. As such, you should still excercise caution against needlessly obtaining cached references via `$enum` when making heavy use of `EnumWrapper` functionality. Consider storing the result of `$enum()` in a local variable before making multiple calls to its methods, especially if the `EnumWrapper`'s features are used within a loop.

Despite the above warning, it is noteworthy that even the worst case implementation still produces extremely quick lookups for a relatively small number of items (like the number of enums that you are likely have in a project). For example, see [this performance test](https://www.measurethat.net/Benchmarks/Show/2513/5/map-keyed-by-object) of lookups into maps containing 500 entries, including a simple `Map` polyfill implementation.

Read about a potential [`WeakMap` Polyfill issue](#weakmap-polyfill).

Read more about `WeakMap` on the [MDN website](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap).

## API Reference

Also see the source code or the distributed `.d.ts` types files for complete details of method signatures/overloads, detailed method/param documentation, etc.

See [Usage Examples](#usage-examples) if you prefer a "by example" reference.

### Terminology

Throughout this reference, the following aliases for types will be used:

-   `EnumLike`: An enum-like object type. See [Enum-Like Object](#enum-like-object).
-   `KeyType`: The type of the enum's keys. This is usually a string literal union type of the enum's names, but may also simply be `string` if an `EnumWrapper` was created for an object whose possible property names are not known at compile time.
-   `EnumType`: The specific enum type of the enum values. This is usually the enum type itself, but may also simply be the same as `ValueType` (see below) if a `EnumWrapper` was created for an object that is not actually an enum, but is only "enum-like".
-   `ValueType`: The widened type of the enum's values. Will be `number`, `string`, or `number | string`, depending on whether the wrapped enum-like object contains only number, only string, or both number and string values.

### \$enum

This is where it all begins. This method returns an [EnumWrapper](#enum-wrapper-1) instance that provides useful utilities for `enumObj`.

See [Caching](#caching) for more about caching of `EnumWrapper` instances.

```ts
function $enum(enumObj: EnumLike): EnumWrapper;
```

-   `enumObj` - An enum or "enum-like" object.

### Types

#### EnumWrapper

This is the class that implements all the enum utilities. It's a generic class that requires an overloaded helper function to properly instantiate, so the constructor is private. Use [\$enum()](#enum) to get/create an instance of `EnumWrapper`.

```ts
class EnumWrapper
```

#### EnumWrapper.Entry

A generic type alias for a tuple containing a key and value pair, representing a complete "entry" in the enum. The tuple is defined as `Readonly` to prevent accidental corruption of the `EnumWrapper` instance's data.

```ts
type EnumWrapper.Entry = Readonly<[KeyType, EnumType]>
```

#### EnumWrapper.Iteratee

A generic type alias for a function signature to be used in iteration methods. This is compliant with the signature of an iteratee for a `Map<KeyType, EnumType>.forEach()` method, but also has an additional `index` param at the end of the parameter list.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
type EnumWrapper.Iteratee<R> = (
    value: EnumType,
    key: KeyType,
    enumWrapper: EnumWrapper,
    index: number
) => R
```

-   `R` - Generic type param for the return type of the function. The signifigance of the return type/value depends on teh context in which the iteratee is being used.
-   `value` - The value of the enum entry.
-   `key` - The key of the enum entry.
-   `enumWrapper` - A reference to the `EnumWrapper` instance that is being iterated.
-   `index` - The index of the enum entry

### Array-Like Interface

See also: [Array-Like Interface](#array-like-interface)

#### EnumWrapper.prototype.length

A read-only property containing the number of entries in the enum.

```ts
readonly EnumWrapper.prototype.length: number
```

#### EnumWrapper.prototype.[index]

The index signature is implemented on `EnumWrapper` to allow you to access `[key, value]` tuples by index like an array. The values accessed by indexing are readonly.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
readonly EnumWrapper.prototype.[index: number]: EnumWrapper.Entry
```

### Map-Like Interface

See also: [Map-Like Interface](#map-like-interface)

#### EnumWrapper.prototype.size

A read-only property containing the number of entries in the enum.

```ts
readonly EnumWrapper.prototype.size: number
```

#### EnumWrapper.prototype.keys

Returns an `Iterator` that will iterate all keys of the enum.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.keys(): IterableIterator<KeyType>
```

#### EnumWrapper.prototype.values

Returns an `Iterator` that will iterate all values of the enum.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.values(): IterableIterator<EnumType>
```

#### EnumWrapper.prototype.entries

Returns an `Iterator` that will iterate all [key, value] pairs of the enum.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.entries(): IterableIterator<EnumWrapper.Entry>
```

#### EnumWrapper.prototype.@@iterator

Same as [EnumWrapper.prototype.entries](#enumwrapperprototypeentries).

Allows an `EnumWrapper` to be directly iterated as a collection of `[key, value]` tuples.

```ts
EnumWrapper.prototype.@@iterator(): IterableIterator<EnumWrapper.Entry>
```

#### EnumWrapper.prototype.forEach

Iterates every entry in the enum and calls the provided `iteratee` function.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.forEach(
    iteratee: EnumWrapper.Iteratee<void>,
    context?: any
): void
```

-   `iteratee`: See [EnumWrapper.Iteratee](#enumwraperriteratee). The return value of this function is ignored.
-   `context`: If provided, then the value will be used as the `this` context when executing `iteratee`.

### Iteration

#### EnumWrapper.prototype.forEach

See [EnumWrapper.prototype.forEach](#enumwrapperprototypeforeach) in the [Map-Like Interface](#map-like-interface-1) section.

#### EnumWrapper.prototype.map

Builds and returns a new array containing the results of calling the provided `iteratee` function on every entry in the enum.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.map<R>(
    iteratee: EnumWrapper.Iteratee<R>,
    context?: any
): R[]
```

-   `R`: Generic type param that indicates the type of entries in the resulting array. If not specified, then it will be inferred from the return type of `iteratee`.
-   `iteratee`: See [EnumWrapper.Iteratee](#enumwraperriteratee).
-   `context`: If provided, then the value will be used as the `this` context when executing `iteratee`.

### Get Arrays of Enum Data

#### EnumWrapper.prototype.getKeys

Returns an array of all keys in the enum.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.getKeys(): KeyType[]
```

#### EnumWrapper.prototype.getValues

Returns an array of all values in the enum. If the enum contains any duplicate values, then so will the returned array.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.getValues(): EnumType[]
```

#### EnumWrapper.prototype.getEntries

Returns a list of `[key, value]` tuples representing all entries in the enum.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.getEntries(): EnumWrapper.Entry[]
```

### Get Ordered Index of Keys/Values

#### EnumWrapper.prototype.indexOfKey

Returns the ordered index of a key of the enum.
This can be useful for implementing comparators based on the iteration order
of the enum, for example.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.indexOfKey(key: KeyType): number
```

-   `key`: A valid key of the enum.

#### EnumWrapper.prototype.indexOfValue

Returns the ordered index of a value of the enum.
This can be useful for implementing comparators based on the iteration order
of the enum, for example.

See [Order of Iteration](#order-of-iteration) for details about the ordering.

```ts
EnumWrapper.prototype.indexOfValue(value: EnumType): number
```

-   `value`: A valid value of the enum.

### Key Validation/Typecasting

#### EnumWrapper.prototype.isKey

Returns `true` if the provided `key` is a valid key for the enum.

Also acts as a type guard to tell the compiler that the provided `key` is the more specific `KeyType` type.

```ts
EnumWrapper.prototype.isKey(
    key: string | null | undefined
): key is KeyType
```

#### EnumWrapper.prototype.asKeyOrThrow

If the provided `key` is a valid key for the enum, then the `key` is returned, but cast to the more specific `KeyType` type.
If the provided `key` is NOT valid, then an `Error` is thrown.

```ts
EnumWrapper.prototype.asKeyOrThrow(
    key: string | null | undefined
): KeyType
```

#### EnumWrapper.prototype.asKeyOrDefault

If the provided `key` is a valid key for the enum, then the `key` is returned, but cast to the more specific `KeyType` type.
If the provided `key` is NOT valid, then `defaultKey` is returned.
If the provided `defaultKey` is not valid, then an `Error` is thrown.

This method is overloaded so that its return type is as specific as possible, depending on whether the
`key` and `defaultKey` params are possibly undefined.

```ts
EnumWrapper.prototype.asKeyOrDefault(
    key: string | null | undefined,
    defaultKey?: KeyType
): KeyType | undefined
```

### Value Validation/Typecasting

#### EnumWrapper.prototype.isValue

Returns `true` if the provided `value` is a valid value for the enum.

Also acts as a type guard to tell the compiler that the provided `value` is the more specific `EnumType` type.

```ts
EnumWrapper.prototype.isValue(
    value: ValueType | null | undefined
): key is EnumType
```

#### EnumWrapper.prototype.asValueOrThrow

If the provided `value` is a valid value for the enum, then the `value` is returned, but cast to the more specific `EnumType` type.
If the provided `value` is NOT valid, then an `Error` is thrown.

```ts
EnumWrapper.prototype.asValueOrThrow(
    value: ValueType | null | undefined
): EnumType
```

#### EnumWrapper.prototype.asValueOrDefault

If the provided `value` is a valid value for the enum, then the `value` is returned, but cast to the more specific `EnumType` type.
If the provided `value` is NOT valid, then `defaultValue` is returned.
If the provided `defaultValue` is not valid, then an `Error` is thrown.

This method is overloaded so that its return type is as specific as possible, depending on whether the
`value` and `defaultValue` params are possibly undefined.

```ts
EnumWrapper.prototype.asValueOrDefault(
    value: ValueType | null | undefined,
    defaultValue?: EnumType
): EnumType | undefined
```

### Lookup Key by Value

#### EnumWrapper.prototype.getKey

Performs a reverse lookup to get the key that corresponds to the provided `value`.

If the enum has duplicate values matching the provided `value`, then the key for the last duplicate entry (in order specified by the [Order of Iteration](#order-of-iteration) section) is returned.

If the provided `value` is null/undefined, then `defaultKey` is returned.
If either the provided `value` or `defaultKey` are invalid, then an `Error` is thrown.

If you have an untrustworthy `value` and want a default key if `value` is invalid,
then pass `value` through `asValueOrDefault` before passing it to `getKey`.

This method is overloaded so that its return type is as specific as possible, depending on whether the
`value` and `defaultKey` params are possibly undefined.

```ts
EnumWrapper.prototype.getKey(
    value: EnumType | null | undefined,
    defaultKey?: KeyType
): KeyType | undefined
```

### Lookup Value by Key

#### EnumWrapper.prototype.getValue

Returns the value corresponding to the provided `key`.

If the provided `key` is null/undefined, then `defaultValue` is returned.
If either the provided `key` or `defaultValue` are invalid, then an `Error` is thrown.

If you have an untrustworthy `key` and want a default value if `key` is invalid,
then pass `key` through `asKeyOrDefault` before passing it to `getValue`.

This method is overloaded so that its return type is as specific as possible, depending on whether the
`key` and `defaultValue` params are possibly undefined.

```ts
EnumWrapper.prototype.getValue(
    key: KeyType | null | undefined,
    defaultValue?: EnumType
): EnumType | undefined
```
