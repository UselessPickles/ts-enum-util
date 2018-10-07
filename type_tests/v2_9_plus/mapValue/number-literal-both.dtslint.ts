import { $enum } from "../../../dist/types";

type RGB = 1 | 2 | 3;

declare const rgb: RGB | null | undefined;

// Return type is inferred
// $ExpectType number
$enum.mapValue(rgb).with({
    [1]: 10,
    [2]: 20,
    [3]: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});
// $ExpectType string
$enum.mapValue(rgb).with({
    [1]: "10",
    [2]: "20",
    [3]: "30",
    [$enum.handleNull]: "-1",
    [$enum.handleUndefined]: "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.mapValue(rgb).with({
    [1]: 10,
    [2]: $enum.unhandled,
    [3]: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});

// handleUnexpected is allowed
// $ExpectType number
$enum.mapValue(rgb).with({
    [1]: 10,
    [2]: 20,
    [3]: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1,
    [$enum.handleUnexpected]: -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.mapValue(rgb).with({
    [1]: 10,
    [2]: 20,
    [3]: 30,
    [$enum.handleNull]: $enum.unhandled,
    [$enum.handleUndefined]: $enum.unhandled,
    [$enum.handleUnexpected]: $enum.unhandled
});

// Missing value handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    [1]: 10,
    [3]: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});

// Unexpected value handler causes error
$enum.mapValue(rgb).with({
    [1]: 10,
    // $ExpectError
    oops: 42,
    [2]: 20,
    [3]: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1
});

// missing null handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    [1]: 10,
    [2]: 20,
    [3]: 30,
    [$enum.handleUndefined]: -1
});

// missing undefined handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    [1]: 10,
    [2]: 20,
    [3]: 30,
    [$enum.handleNull]: -1
});
