import { $enum } from "ts-enum-util";

type RGB = 1 | 2 | 3;

declare const rgb: RGB | null | undefined;

// Return type is inferred
// $ExpectType number
$enum.mapValue(rgb).with({
    1: 10,
    2: 20,
    3: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1,
});
// $ExpectType string
$enum.mapValue(rgb).with({
    1: "10",
    2: "20",
    3: "30",
    [$enum.handleNull]: "-1",
    [$enum.handleUndefined]: "-1",
});

// Return type is inferred when "unhandled" entries exist
// TODO: report error in @next to TypeScript. Re-enable test if it is fixed.
// ExpectType number
// $enum.mapValue(rgb).with({
//     1: 10,
//     2: $enum.unhandledEntry,
//     3: 30,
//     [$enum.handleNull]: -1,
//     [$enum.handleUndefined]: -1
// });

// handleUnexpected is allowed
// $ExpectType number
$enum.mapValue(rgb).with({
    1: 10,
    2: 20,
    3: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1,
    [$enum.handleUnexpected]: -1,
});

// special handlers can be unhandled
// $ExpectType number
$enum.mapValue(rgb).with({
    1: 10,
    2: 20,
    3: 30,
    [$enum.handleNull]: $enum.unhandledEntry,
    [$enum.handleUndefined]: $enum.unhandledEntry,
    [$enum.handleUnexpected]: $enum.unhandledEntry,
});

// Missing value handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    1: 10,
    3: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1,
});

// Unexpected value handler causes error
$enum.mapValue(rgb).with({
    1: 10,
    // $ExpectError
    oops: 42,
    2: 20,
    3: 30,
    [$enum.handleNull]: -1,
    [$enum.handleUndefined]: -1,
});

// missing null handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    1: 10,
    2: 20,
    3: 30,
    [$enum.handleUndefined]: -1,
});

// missing undefined handler causes error
// $ExpectError
$enum.mapValue(rgb).with({
    1: 10,
    2: 20,
    3: 30,
    [$enum.handleNull]: -1,
});
