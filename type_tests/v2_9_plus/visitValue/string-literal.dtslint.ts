import { $enum } from "ts-enum-util";

type RGB = "r" | "g" | "b";

declare const rgb: RGB;

// Test param types
$enum.visitValue(rgb).with({
    r: (value) => {
        // $ExpectType "r"
        value;
    },
    g: (value) => {
        // $ExpectType "g"
        value;
    },
    b: (value) => {
        // $ExpectType "b"
        value;
    },
    [$enum.handleUnexpected]: (value) => {
        // $ExpectType any
        value;
    }
});

// handleUnexpected is optional
$enum.visitValue(rgb).with({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {}
});

// Return type is inferred
// $ExpectType number
$enum.visitValue(rgb).with({
    r: (value) => 10,
    g: (value) => 20,
    b: (value) => 30
});
// $ExpectType string
$enum.visitValue(rgb).with({
    r: (value) => "10",
    g: (value) => "20",
    b: (value) => "30"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.visitValue(rgb).with({
    r: (value) => 10,
    g: $enum.unhandledEntry,
    b: (value) => 30
});

// special handlers can be unhandled
// $ExpectType number
$enum.visitValue(rgb).with({
    r: (value) => 10,
    g: (value) => 20,
    b: (value) => 30,
    [$enum.handleUnexpected]: $enum.unhandledEntry
});

// Missing value handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    b: (value) => {}
});

// Unexpected value handler causes error
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    // $ExpectError
    oops: (value) => {},
    g: (value) => {},
    b: (value) => {}
});

// Unnecessary null handler causes error
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {},
    // $ExpectError
    [$enum.handleNull]: (value) => {}
});

// Unnecessary undefined handler causes error
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {},
    // $ExpectError
    [$enum.handleUndefined]: (value) => {}
});
