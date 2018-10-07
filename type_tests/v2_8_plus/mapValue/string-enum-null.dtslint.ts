import { $enum } from "../../../dist/types";

enum RGB {
    R = "r",
    G = "g",
    B = "b"
}

declare const rgb: RGB | null;

// Return type is inferred
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleNull]: -1
});
// $ExpectType string
$enum.mapValue(rgb).with({
    [RGB.R]: "10",
    [RGB.G]: "20",
    [RGB.B]: "30",
    [$enum.handleNull]: "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: $enum.unhandled,
    [RGB.B]: 30,
    [$enum.handleNull]: -1
});

// handleUnexpected is allowed
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUnexpected]: -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleNull]: $enum.unhandled,
    [$enum.handleUnexpected]: $enum.unhandled
});

// Missing value handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.B]: 30,
    [$enum.handleNull]: -1
});

// Unexpected value handler causes error
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    // $ExpectError
    oops: 42,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleNull]: -1
});

// missing null handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30
});

// Unnecessary undefined handler causes error
$enum.mapValue(rgb).with({
    [RGB.R]: 10,
    [RGB.G]: 20,
    [RGB.B]: 30,
    [$enum.handleNull]: -1,
    // $ExpectError
    [$enum.handleUndefined]: -1
});
