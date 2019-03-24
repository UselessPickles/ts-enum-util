import { $enum } from "ts-enum-util";

type RGB = 1 | 2 | 3;

declare const rgb: RGB | null | undefined;

// Test param types
$enum.visitValue(rgb).with({
    1: (value) => {
        // $ExpectType 1
        value;
    },
    2: (value) => {
        // $ExpectType 2
        value;
    },
    3: (value) => {
        // $ExpectType 3
        value;
    },
    [$enum.handleNull]: (value) => {
        // $ExpectType null
        value;
    },
    [$enum.handleUndefined]: (value) => {
        // $ExpectType undefined
        value;
    },
    [$enum.handleUnexpected]: (value) => {
        // $ExpectType any
        value;
    }
});

// handleUnexpected is optional
$enum.visitValue(rgb).with({
    1: (value) => {},
    2: (value) => {},
    3: (value) => {},
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Return type is inferred
// $ExpectType number
$enum.visitValue(rgb).with({
    1: (value) => 10,
    2: (value) => 20,
    3: (value) => 30,
    [$enum.handleNull]: (value) => -1,
    [$enum.handleUndefined]: (value) => -1
});
// $ExpectType string
$enum.visitValue(rgb).with({
    1: (value) => "10",
    2: (value) => "20",
    3: (value) => "30",
    [$enum.handleNull]: (value) => "-1",
    [$enum.handleUndefined]: (value) => "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.visitValue(rgb).with({
    1: (value) => 10,
    2: $enum.unhandledEntry,
    3: (value) => 30,
    [$enum.handleNull]: (value) => -1,
    [$enum.handleUndefined]: (value) => -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.visitValue(rgb).with({
    1: (value) => 10,
    2: (value) => 20,
    3: (value) => 30,
    [$enum.handleNull]: $enum.unhandledEntry,
    [$enum.handleUndefined]: $enum.unhandledEntry,
    [$enum.handleUnexpected]: $enum.unhandledEntry
});

// Missing value handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    1: (value) => {},
    3: (value) => {},
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Missing null handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    1: (value) => {},
    2: (value) => {},
    3: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Missing undefined handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    1: (value) => {},
    2: (value) => {},
    3: (value) => {},
    [$enum.handleNull]: (value) => {}
});

// Unexpected value handler causes error
$enum.visitValue(rgb).with<void>({
    1: (value) => {},
    // $ExpectError
    oops: (value) => {},
    2: (value) => {},
    3: (value) => {},
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});
