import { $enum } from "../../../dist/types";

enum RGB {
    R = "r",
    G = "g",
    B = "b"
}

declare const rgb: RGB;

// Return type is inferred
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30
});
// $ExpectType string
$enum.mapValue(rgb).with({
    [RGB.R]: "10",
    [RGB.G]: "20",
    [RGB.B]: "30"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: $enum.unhandled,
    [RGB.B]: 30
});

// handleUnexpected is allowed
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleUnexpected]: -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleUnexpected]: $enum.unhandled
});

// Missing value handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.B]: 30
});

// Unexpected value handler causes error
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    // $ExpectError
    oops: 42,
    [RGB.G]: 20,
    [RGB.B]: 30
});

// Unnecessary null handler causes error
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    // $ExpectError
    [$enum.handleNull]: -1
});

// Unnecessary undefined handler causes error
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    // $ExpectError
    [$enum.handleUndefined]: -1
});

// Test enum value computed property names (no compiler error).
// (only supported as of TS 2.6.1)
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30
});
