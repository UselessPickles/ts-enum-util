import { $enum } from "../../../dist/types";

type RGB = "r" | "g" | "b";

declare const rgb: RGB;

// Return type is inferred
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30
});
// $ExpectType string
$enum.mapValue(rgb).with({
    r: "10",
    g: "20",
    b: "30"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: $enum.unhandled,
    b: 30
});

// handleUnexpected is allowed
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleUnexpected]: -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    [$enum.handleUnexpected]: $enum.unhandled
});

// Missing value handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    r: 10,
    b: 30
});

// Unexpected value handler causes error
$enum.mapValue(rgb).with({
    r: 10,
    // $ExpectError
    oops: 42,
    g: 20,
    b: 30
});

// Unnecessary null handler causes error
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    // $ExpectError
    [$enum.handleNull]: -1
});

// Unnecessary undefined handler causes error
$enum.mapValue(rgb).with({
    r: 10,
    g: 20,
    b: 30,
    // $ExpectError
    [$enum.handleUndefined]: -1
});
