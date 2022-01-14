import { $enum } from "ts-enum-util";

type RGB = "r" | "g" | "b";

declare const rgb: RGB | null | undefined;

// Return type is inferred
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});
// $ExpectType string
$enum.mapValue(rgb).with({
    r: "10",
    g: "20",
    b: "30",
    [$enum.handleNull]: "-1",
    [$enum.handleUndefined]: "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: $enum.unhandledEntry,
    b: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});

// handleUnexpected is allowed
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1,
    [$enum.handleUnexpected]: -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleNull]: $enum.unhandledEntry,
    [$enum.handleUndefined]: $enum.unhandledEntry,
    [$enum.handleUnexpected]: $enum.unhandledEntry
});

// Missing value handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    r: 10,
    b: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});

// Unexpected value handler causes error
$enum.mapValue(rgb).with({
    r: 10,
    // $ExpectError
    oops: 42,
    g: 20,
    b: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});

// missing null handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleUndefined]: -1
});

// missing undefined handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleNull]: -1
});
