[![npm version](https://img.shields.io/npm/v/ts-enum-util.svg)](https://www.npmjs.com/package/ts-enum-util)
[![Join the chat at https://gitter.im/ts-enum-util/Lobby](https://badges.gitter.im/ts-enum-util/Lobby.svg)](https://gitter.im/ts-enum-util/Lobby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Build Status](https://travis-ci.org/UselessPickles/ts-enum-util.svg?branch=master)](https://travis-ci.org/UselessPickles/ts-enum-util)
[![Coverage Status](https://coveralls.io/repos/github/UselessPickles/ts-enum-util/badge.svg?branch=master)](https://coveralls.io/github/UselessPickles/ts-enum-util?branch=master)

# ts-enum-util
Strictly typed utilities for working with TypeScript enums.

# Contents
<!-- TOC depthFrom:2 -->

- [What is it?](#what-is-it)
- [Other TypeScript Enum Projects](#other-typescript-enum-projects)
- [Installation](#installation)
- [Usage Examples](#usage-examples)
    - [Basic setup for all examples](#basic-setup-for-all-examples)
    - [Get an `EnumWrapper` instance for an enum](#get-an-enumwrapper-instance-for-an-enum)
    - [Get count of enum entries](#get-count-of-enum-entries)
    - [Get lists of enum data](#get-lists-of-enum-data)
    - [Lookup value by key](#lookup-value-by-key)
    - [Reverse lookup key by value](#reverse-lookup-key-by-value)
    - [Validate/convert enum keys](#validateconvert-enum-keys)
    - [Validate/convert enum values](#validateconvert-enum-values)
    - [Iteration and Mapping](#iteration-and-mapping)
    - [Wrapped enums are Array-Like](#wrapped-enums-are-array-like)
    - [Wrapped enums are Map-Like](#wrapped-enums-are-map-like)
- [Requirements](#requirements)
- [Limitations](#limitations)
- [General Concepts](#general-concepts)
    - [Enum-Like Object](#enum-like-object)
    - [EnumWrapper](#enumwrapper)
    - [Specific Typing](#specific-typing)
    - [Map-Like Interface](#map-like-interface)
    - [Array-Like Interface](#array-like-interface)
    - [Guaranteed Order of Iteration](#guaranteed-order-of-iteration)
    - [Caching](#caching)
- [API Reference](#api-reference)
    - [Terminology](#terminology)
    - [$enum](#enum)
    - [Types](#types)
        - [EnumWrapper](#enumwrapper-1)
        - [EnumWrapper.Entry](#enumwrapperentry)
        - [EnumWrapper.Iteratee](#enumwrapperiteratee)
    - [Array-Like Interface](#array-like-interface-1)
        - [EnumWrapper.prototype.length](#enumwrapperprototypelength)
        - [EnumWrapper.prototype.[index]](#enumwrapperprototypeindex)
    - [Map-Like Interface](#map-like-interface-1)
        - [EnumWrapper.prototype.size](#enumwrapperprototypesize)
        - [EnumWrapper.prototype.keys](#enumwrapperprototypekeys)
        - [EnumWrapper.prototype.values](#enumwrapperprototypevalues)
        - [EnumWrapper.prototype.entries](#enumwrapperprototypeentries)
        - [EnumWrapper.prototype.@@iterator](#enumwrapperprototypeiterator)
        - [EnumWrapper.prototype.forEach](#enumwrapperprototypeforeach)
    - [Iteration](#iteration)
        - [EnumWrapper.prototype.forEach](#enumwrapperprototypeforeach-1)
        - [EnumWrapper.prototype.map](#enumwrapperprototypemap)
    - [Get Arrays of Enum Data](#get-arrays-of-enum-data)
        - [EnumWrapper.prototype.getKeys](#enumwrapperprototypegetkeys)
        - [EnumWrapper.prototype.getValues](#enumwrapperprototypegetvalues)
        - [EnumWrapper.prototype.getEntries](#enumwrapperprototypegetentries)
    - [Key Validation/Typecasting](#key-validationtypecasting)
        - [EnumWrapper.prototype.isKey](#enumwrapperprototypeiskey)
        - [EnumWrapper.prototype.asKeyOrThrow](#enumwrapperprototypeaskeyorthrow)
        - [EnumWrapper.prototype.asKeyOrDefault](#enumwrapperprototypeaskeyordefault)
    - [Value Validation/Typecasting](#value-validationtypecasting)
        - [EnumWrapper.prototype.isValue](#enumwrapperprototypeisvalue)
        - [EnumWrapper.prototype.asValueOrThrow](#enumwrapperprototypeasvalueorthrow)
        - [EnumWrapper.prototype.asValueOrDefault](#enumwrapperprototypeasvalueordefault)
    - [Lookup Key by Value](#lookup-key-by-value)
        - [EnumWrapper.prototype.getKeyOrThrow](#enumwrapperprototypegetkeyorthrow)
        - [EnumWrapper.prototype.getKeyOrDefault](#enumwrapperprototypegetkeyordefault)
    - [Lookup Value by Key](#lookup-value-by-key)
        - [EnumWrapper.prototype.getValueOrThrow](#enumwrapperprototypegetvalueorthrow)
        - [EnumWrapper.prototype.getValueOrDefault](#enumwrapperprototypegetvalueordefault)

<!-- /TOC -->

## What is it?
`ts-enum-util` provides utilities to improve the usefulness of enums. Examples include:
- Get a list of an enum's keys, values, or key/value pairs.
- Lookup values by key with run-time key validation and optional result defaulting.
- Reverse lookup of keys by value (for string enums too!) with run-time value validation and optional result defaulting.
- Run-time validation that a specified value or key is valid for a given enum, with compile-time type guards.
- Treat an enum like an Array.
- Treat an enum like a Map.

All of these utilities are very specifically typed for each enum via generics and type inference.

## Other TypeScript Enum Projects
- `ts-string-visitor` [[github](https://github.com/UselessPickles/ts-string-visitor), [npm](https://www.npmjs.com/package/ts-string-visitor)] - Generic TypeScript Visitor and Mapper for String Enums and String Literal Union Types

## Installation
Install via [NPM](https://www.npmjs.com/package/ts-enum-util):
```
npm i -s ts-enum-util
```

## Usage Examples
Several small examples `ts-enum-util`'s capabilities to give you a quick overview of what it can do, as well as an organized "by example" reference.

Pay special attention to the comments indicating the compile-time type of various results. See [Specific Typing](#specific-typing) for more about data types.

See [API Reference](#api-reference) for more details about method signatures and behaviors.

### Basic setup for all examples
```ts
// import the $enum helper function
import {$enum} from "ts-enum-util";

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
Use the [$enum](#enum) function to get an `EnumWrapper` instance for a particular enum.
Read about how `EnumWrapper` instances are cached: [Caching](#caching).

```ts
// type: EnumWrapper<string, RGB>
const wrappedRgb = $enum(RGB);
```

### Get count of enum entries
See also:
- [Wrapped enums are Array-Like](#wrapped-enums-are-array-like)
- [Wrapped enums are Map-Like](#wrapped-enums-are-map-like)
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
- [Guaranteed Order of Iteration](#guaranteed-order-of-iteration)
- [Wrapped enums are Array-Like](#wrapped-enums-are-array-like)
- [Wrapped enums are Map-Like](#wrapped-enums-are-map-like)
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
const value1 = $enum(RGB).getValueOrThrow("G");

// throws: Error("Unexpected value: blah. Expected one of: R,G,B")
const value2 = $enum(RGB).getValueOrThrow("blah");

// type: RGB | undefined
// value: undefined
const value3 = $enum(RGB).getValueOrDefault("blah");

// type: RGB
// value: "r"
const value4 = $enum(RGB).getValueOrDefault("blah", RGB.R);

// type: string
// value: "BLAH!"
const value5 = $enum(RGB).getValueOrDefault("blah", "BLAH!");
```

### Reverse lookup key by value
```ts
// type: ("R" | "G" | "B")
// value: "G"
const key1 = $enum(RGB).getKeyOrThrow("g");

// throws: Error("Unexpected value: blah. Expected one of: r,g,b")
const key2 = $enum(RGB).getKeyOrThrow("blah");

// type: ("R" | "G" | "B") | undefined
// value: undefined
const key3 = $enum(RGB).getKeyOrDefault("blah");

// type: ("R" | "G" | "B")
// value: "R"
const key4 = $enum(RGB).getKeyOrDefault("blah", "R");

// type: string
// value: "BLAH!"
const key4 = $enum(RGB).getKeyOrDefault("blah", "BLAH!");
```

### Validate/convert enum keys
```ts
// Some arbitrary string
declare const str: string;

// Returns `true` if 'str' is a valid key of RGB
if($enum(RGB).isKey(str)) {
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
if($enum(RGB).isValue(str)) {
    // isValue() is a type guard
    // type of 'str' in here is RGB
}

// type: RGB
// throws error if 'str' is not a valid value for RGB
const value1 = $enum(RGB).asValueOrThrow(str);

// type: RGB | undefined
// value is undefined if 'str' is not a valid value for RGB
const value2 = $enum(RGB).asValueOrDefault(str);

// type: RGB | undefined
// value is RGB.G if 'str' is not a valid value for RGB
const value3 = $enum(RGB).asValueOrDefault(str, RGB.G);
```

### Iteration and Mapping
See also:
- [Guaranteed Order of Iteration](#guaranteed-order-of-iteration)
```ts
const wrappedRgb = $enum(RGB);

// iterate all entries in the enum
wrappedRgb.forEach((value, key, wrappedEnum, index) => {
    // type of value is RGB
    // type of key is ("R" | "G" | "B")
    // wrappedEnum is a reference to wrappedRgb
    // index is based on sorted key order
});

// Convert all entries of the enum to an array of mapped values
// value: ["R: r", "G: g", "B: b"]
const mapped = wrappedRgb.map((value, key, wrappedEnum, index) => {
    // type of value is RGB
    // type of key is ("R" | "G" | "B")
    // wrappedEnum is a reference to wrappedRgb
    // index is based on sorted key order
    return `${key}: ${value}`;
});
```

### Wrapped enums are Array-Like
A wrapped enum can be treated like an array of enum "entry" tuples.

See also:
- [Array-Like Interface](#array-like-interface)
- [Guaranteed Order of Iteration](#guaranteed-order-of-iteration)
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
A wrapped enum is similar to a read-only `Map` of enum "entry" tuples.

See also:
- [Map-Like Interface](#map-like-interface)
- [Guaranteed Order of Iteration](#guaranteed-order-of-iteration)
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
    // index is based on sorted key order
    // NOTE: index param is extra compared to Map's forEach
});
```

## Requirements
- *ES6 Features*: The following ES6 features are used by `ts-enum-util`, so they must exist (either natively or via polyfill) in the run-time environment:
    - `Map`
    - `Symbol.iterator`

## Limitations
- Does not work with enums that are merged with a namespace containing values (variables, functions, etc.), or otherwise have any additional properties added to the enum's runtime object.
- Requires the `preserveConstEnums` TypeScript compiler option to work with `const enums`.
- For certain `Iterable` features of `WrappedEnum` to work, you must either compile with a target of `es6` or higher, or enable the `downlevelIteration` compiler option.

## General Concepts
### Enum-Like Object
`ts-enum-util` technically works with any "enum-like" object, which is any object whose property values are of type `string` or `number`.

The most obvious example is a TypeScript `enum`. It can be a standard enum of numeric values, a string enum, or even an enum with a mix of numeric and string values.

### EnumWrapper
The bulk of `ts-enum-util`'s functionality is implemented via an `EnumWrapper` class, which is instantiated with a reference to an enum-like object and implements all the useful utility methods for that enum.

You likely won't ever directly reference the `EnumWrapper` class because it's much more convenient to use the [$enum](#enum) function to obtain a reference to an `EnumWrapper` instance.

### Specific Typing
The various methods of `ts-enum-util` are generic and overloaded to ensure that params and results are as specifically-typed as possible. This is acheived through generics, type inference, and overloading of the `$enum` function signature that is used to obtain an `EnumWrapper` instance for a particular enum.

For example, when obtaining a key or keys from an `EnumWrapper`, the data type will be a string literal union containing only the specific key names that exist in the enum.

This helps maximize the usefulness of `ts-enum-util` by making it compatible with other strictly typed code related to enums.

### Map-Like Interface
A subset of `EnumWrapper`'s interface overlaps with much of the ES6 `Map` interface. `EnumWrapper` is similar to a read-only `Map` of enum values, keyed by the enum names. The following Map-like features are implemented:
* [size](#enumwrapperprototypesize) property.
* [keys](#enumwrapperprototypekeys), [values](#enumwrapperprototypevalues), and [entries](#enumwrapperprototypeentries) methods.
* [forEach](#enumwrapperprototypeforeach) method.
* [@@iterator](#enumwrapperprototypeiterator) method (`EnumWrapper` is iterable!).

NOTE: The `Map` interface's `has()` and `get()` methods are intentionally NOT implemented in the interest of clarity and consistency of naming with respect to other `EnumWrapper`-specific methods. The equivalent methods are [isKey](#enumwrapperprototypeiskey) and [getValueOrDefault](#enumwrapperprototypegetvalueordefault) (with second param omitted).

### Array-Like Interface
`EnumWrapper` implements the `ArrayLike` interface. It is usable as a readonly array of [EnumWrapper.Entry](#enumwrapperentry). This allows you to pass an `EnumWrapper` instance to any method that is designed read/iterate an array-like value, such as most of [lodash](#https://lodash.com/)'s methods for collections and arrays.

### Guaranteed Order of Iteration
ECMAScript does not guarantee a specific order when iterating properties/keys of objects. While many implementations do consistently iterate object properties/keys in the order in which they were added to the object, it is not safe to rely upon an assumption that all implementations will do the same.

`EnumWrapper` sorts the keys of the enum and uses this sorted order to guarantee consistent ordering of all array/iterator results across all implementations. Just beware that the order may not be what you expect.

Example:
```ts
// enum defined with keys alphabetically out of order
enum ABC = {
    B,
    A,
    C
}

// keys are sorted: ["A", "B", "C"]
const values = $enum(ABC).getKeys();

// values are ordered by sorted key order: [1, 0, 2]
const values = $enum(ABC).getValues();
```

### Caching
By default, `EnumWrapper` instances are cached for quick subsequent retrieval via the [$enum](#enum) function.

The reasoning behind this is that enums are static constructs. A given project will have a relatively small finite number of enums that never change during execution. The combination of caching and the simple [$enum](#enum) function allows you to obtain an `EnumWrapper` instance conveniently whenever you need it, without worrying about maintaining a global reference to it. Of course, it's still good practice to at least temporarily store a reference to the `EnumWrapper` instance within certain code contexts where you heavily use a particular enum's wrapper.

Consider explicitly avoiding caching (via an optional param to `$enum`) if you are using `ts-enum-util` to work with an ad-hoc dynamically generated "enum-like" object that is specific to a particular function execution, class instance, etc.. This is useful to avoid cluttering the cache and unnecessarily occupying memory with an `EnumWrapper` that will never be retrieved from the cache.

## API Reference
Also see the source code or the distributed `index.d.ts` file for complete details of method signatures/overloads, detailed method/param documentation, etc.

See [Usage Examples](#usage-examples) if you prefer a "by example" reference.

### Terminology
Throughout this reference, the following aliases for types will be used:
- `EnumLike`: An enum-like object type. See [Enum-Like Object](#enum-like-object).
- `KeyType`: The type of the enum's keys. This is usually a string literal union type of the enum's names, but may also simply be `string` if an `EnumWrapper` was created for an object whose possible property names are not known at compile time.
- `EnumType`: The specific enum type of the enum values. This is usually the enum type itself, but may also simply be the same as `ValueType` (see below) if a `EnumWrapper` was created for an object that is not actually an enum, but is only "enum-like".
- `ValueType`: The widened type of the enum's values. Will be `number`, `string`, or `number | string`, depending on whether the wrapped enum-like object contains only number, only string, or both number and string values.

### $enum
This is where it all begins. This method returns an [EnumWrapper](#enum-wrapper-1) instance that provides useful utilities for `enumObj`.

See [Caching](#caching) for more about caching of `EnumWrapper` instances.
```ts
function $enum(
    enumObj: EnumLike,
    useCache: boolean = true
): EnumWrapper
```
- `enumObj` - An enum or "enum-like" object.
- `useCache` - False to force a new instance of `EnumWrapper` to be created and returned without any caching.

### Types
#### EnumWrapper
This is the class that implements all the enum utilities. It's a generic class that requires an overloaded helper function to properly instantiate, so the constructor is private. Use [$enum()](#enum) to get/create an instance of `EnumWrapper`.
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

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
type EnumWrapper.Iteratee<R> = (
    value: EnumType,
    key: KeyType,
    enumWrapper: EnumWrapper,
    index: number
) => R
```
- `R` - Generic type param for the return type of the function. The signifigance of the return type/value depends on teh context in which the iteratee is being used.
- `value` - The value of the enum entry.
- `key` - The key of the enum entry.
- `enumWrapper` - A reference to the `EnumWrapper` instance that is being iterated.
- `index` - The index of the enum entry

### Array-Like Interface
See also: [Array-Like Interface](#array-like-interface)

#### EnumWrapper.prototype.length
A read-only property containing the number of entries in the enum.
```ts
readonly EnumWrapper.prototype.length: number
```

#### EnumWrapper.prototype.[index]
The index signature is implemented on `EnumWrapper` to allow you to access `[key, value]` tuples by index like an array. The values accessed by indexing are readonly.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
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

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.keys(): IterableIterator<KeyType>
```

#### EnumWrapper.prototype.values
Returns an `Iterator` that will iterate all values of the enum.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.values(): IterableIterator<EnumType>
```

#### EnumWrapper.prototype.entries
Returns an `Iterator` that will iterate all [key, value] pairs of the enum.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
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

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.forEach(
    iteratee: EnumWrapper.Iteratee,
    context?: any
): void
```
- `iteratee`: See [EnumWrapper.Iteratee](#enumwraperriteratee). The return value of this function is ignored.
- `context`: If provided, then the value will be used as the `this` context when executing `iteratee`.

### Iteration
#### EnumWrapper.prototype.forEach
See [EnumWrapper.prototype.forEach](#enumwrapperprototypeforeach) in the [Map-Like Interface](#map-like-interface-1) section.

#### EnumWrapper.prototype.map
Builds and returns a new array containing the results of calling the provided `iteratee` function on every entry in the enum.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.map<R>(
    iteratee: EnumWrapper.Iteratee,
    context?: any
): R[]
```
- `R`: Generic type param that indicates the type of entries in the resulting array. If not specified, then it will be inferred from the return type of `iteratee`.
- `iteratee`: See [EnumWrapper.Iteratee](#enumwraperriteratee).
- `context`: If provided, then the value will be used as the `this` context when executing `iteratee`.

### Get Arrays of Enum Data
#### EnumWrapper.prototype.getKeys
Returns an array of all keys in the enum.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.getKeys(): KeyType[]
```

#### EnumWrapper.prototype.getValues
Returns an array of all values in the enum. If the enum contains any duplicate values, then so will the returned array.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.getValues(): EnumType[]
```

#### EnumWrapper.prototype.getEntries
Returns a list of `[key, value]` tuples representing all entries in the enum.

See [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) for details about the ordering.
```ts
EnumWrapper.prototype.getEntries(): EnumWrapper.Entry[]
```

### Key Validation/Typecasting
#### EnumWrapper.prototype.isKey
```ts
Returns `true` if the provided `key` is a valid key for the enum.

Also acts as a type guard to tell the compiler that the provided `key` is the more specific `KeyType` type.
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

This method is overloaded so that its return type is as specific as possible, depending on the type of the `defaultKey` param.
```ts
EnumWrapper.prototype.asKeyOrDefault(
    key: string | null | undefined,
    defaultKey?: KeyType | string
): KeyType | string | undefined
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

This method is overloaded so that its return type is as specific as possible, depending on the type of the `defaultValue` param.
```ts
EnumWrapper.prototype.asValueOrDefault(
    value: ValueType | null | undefined,
    defaultValue?: EnumType | ValueType
): EnumType | ValueType | undefined
```

### Lookup Key by Value
#### EnumWrapper.prototype.getKeyOrThrow
Performs a reverse lookup to get the key that corresponds to the provided `value`.

If the enum has duplicate values matching the provided `value`, then the key for the last duplicate entry (in order specified by the [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) section) is returned.

If the provided `value` is NOT valid, then an `Error` is thrown.
```ts
EnumWrapper.prototype.getKeyOrThrow(
    value: ValueType | null | undefined
): KeyType
```

#### EnumWrapper.prototype.getKeyOrDefault
Performs a reverse lookup to get the key that corresponds to the provided `value`.

If the enum has duplicate values matching the provided `value`, then the key for the last duplicate entry (in order specified by the [Guaranteed Order of Iteration](#guaranteed-order-of-iteration) section) is returned.

If the provided `value` is NOT valid, then `defaultKey` is returned.

This method is overloaded so that its return type is as specific as possible, depending on the type of the `defaultKey` param.
```ts
EnumWrapper.prototype.getKeyOrDefault(
    value: ValueType | null | undefined,
    defaultKey?: KeyType | string
): KeyType | string | undefined
```

### Lookup Value by Key
#### EnumWrapper.prototype.getValueOrThrow
Returns the value corresponding to the provided `key`.

If the provided `key` is NOT valid, then an `Error` is thrown.
```ts
EnumWrapper.prototype.getValueOrThrow(
    key: string | null | undefined
): EnumType
```

#### EnumWrapper.prototype.getValueOrDefault
Returns the value corresponding to the provided `key`.

If the provided `key` is NOT valid, then `defaultValue` is returned.

This method is overloaded so that its return type is as specific as possible, depending on the type of the `defaultValue` param.
```ts
EnumWrapper.prototype.getValueOrDefault(
    key: string | null | undefined,
    defaultValue?: EnumType | ValueType
): EnumType | ValueType | undefined
```

