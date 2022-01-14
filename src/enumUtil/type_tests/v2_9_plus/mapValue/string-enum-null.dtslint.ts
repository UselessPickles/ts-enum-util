import { $enum } from "ts-enum-util";

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
    [RGB.G]: $enum.unhandledEntry,
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
    [$enum.handleNull]: $enum.unhandledEntry,
    [$enum.handleUnexpected]: $enum.unhandledEntry
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
