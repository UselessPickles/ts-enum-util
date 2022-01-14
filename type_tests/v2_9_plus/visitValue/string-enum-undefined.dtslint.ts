import { $enum } from "ts-enum-util";

enum RGB {
    R = "r",
    G = "g",
    B = "b"
}

declare const rgb: RGB | undefined;

// Test param types
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => {
        // $ExpectType RGB.R
        value;
    },
    [RGB.G]: (value) => {
        // $ExpectType RGB.G
        value;
    },
    [RGB.B]: (value) => {
        // $ExpectType RGB.B
        value;
    },
    [$enum.handleUndefined]: (value) => {
        // $ExpectType undefined
        value;
    },
    [$enum.handleUnexpected]: (value) => {
        // $ExpectType string | null
        value;
    }
});

// handleUnexpected is optional
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => {},
    [RGB.G]: (value) => {},
    [RGB.B]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Return type is inferred
// $ExpectType number
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => 10,
    [RGB.G]: (value) => 20,
    [RGB.B]: (value) => 30,
    [$enum.handleUndefined]: (value) => -1
});
// $ExpectType string
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => "10",
    [RGB.G]: (value) => "20",
    [RGB.B]: (value) => "30",
    [$enum.handleUndefined]: (value) => "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => 10,
    [RGB.G]: $enum.unhandledEntry,
    [RGB.B]: (value) => 30,
    [$enum.handleUndefined]: (value) => -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => 10,
    [RGB.G]: (value) => 20,
    [RGB.B]: (value) => 30,
    [$enum.handleUndefined]: $enum.unhandledEntry,
    [$enum.handleUnexpected]: $enum.unhandledEntry
});

// Missing value handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    [RGB.R]: (value) => {},
    [RGB.B]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Missing undefined handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    [RGB.R]: (value) => {},
    [RGB.G]: (value) => {},
    [RGB.B]: (value) => {}
});

// Unexpected value handler causes error
$enum.visitValue(rgb).with<void>({
    [RGB.R]: (value) => {},
    // $ExpectError
    oops: (value) => {},
    [RGB.G]: (value) => {},
    [RGB.B]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Unnecessary null handler causes error
$enum.visitValue(rgb).with<void>({
    [RGB.R]: (value) => {},
    [RGB.G]: (value) => {},
    [RGB.B]: (value) => {},
    // $ExpectError
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});
