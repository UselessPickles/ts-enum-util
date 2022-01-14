import { $enum } from "ts-enum-util";

enum RGB {
    R = "r",
    G = "g",
    B = "b"
}

declare const rgb: RGB | null;

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
    [$enum.handleNull]: (value) => {
        // $ExpectType null
        value;
    },
    [$enum.handleUnexpected]: (value) => {
        // $ExpectType string | undefined
        value;
    }
});

// handleUnexpected is optional
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => {},
    [RGB.G]: (value) => {},
    [RGB.B]: (value) => {},
    [$enum.handleNull]: (value) => {}
});

// Return type is inferred
// $ExpectType number
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => 10,
    [RGB.G]: (value) => 20,
    [RGB.B]: (value) => 30,
    [$enum.handleNull]: (value) => -1
});
// $ExpectType string
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => "10",
    [RGB.G]: (value) => "20",
    [RGB.B]: (value) => "30",
    [$enum.handleNull]: (value) => "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => 10,
    [RGB.G]: $enum.unhandledEntry,
    [RGB.B]: (value) => 30,
    [$enum.handleNull]: (value) => -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => 10,
    [RGB.G]: (value) => 20,
    [RGB.B]: (value) => 30,
    [$enum.handleNull]: $enum.unhandledEntry,
    [$enum.handleUnexpected]: $enum.unhandledEntry
});

// Missing value handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    [RGB.R]: (value) => {},
    [RGB.B]: (value) => {},
    [$enum.handleNull]: (value) => {}
});

// Missing null handler causes error
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
    [$enum.handleNull]: (value) => {}
});

// Unnecessary undefined handler causes error
$enum.visitValue(rgb).with<void>({
    [RGB.R]: (value) => {},
    [RGB.G]: (value) => {},
    [RGB.B]: (value) => {},
    [$enum.handleNull]: (value) => {},
    // $ExpectError
    [$enum.handleUndefined]: (value) => {}
});
