import { $enum } from "../../../dist/types";

type RGB = "r" | "g" | "b";

declare const rgb: RGB | null | undefined;

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
    [$enum.handleNull]: (value) => {
        // $ExpectType null
        value;
    },
    [$enum.handleUndefined]: (value) => {
        // $ExpectType undefined
        value;
    },
    [$enum.handleUnexpected]: (value) => {
        // $ExpectType string
        value;
    }
});

// handleUnexpected is optional
$enum.visitValue(rgb).with({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {},
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Return type is inferred
// $ExpectType number
$enum.visitValue(rgb).with({
    r: (value) => 10,
    g: (value) => 20,
    b: (value) => 30,
    [$enum.handleNull]: (value) => -1,
    [$enum.handleUndefined]: (value) => -1
});
// $ExpectType string
$enum.visitValue(rgb).with({
    r: (value) => "10",
    g: (value) => "20",
    b: (value) => "30",
    [$enum.handleNull]: (value) => "-1",
    [$enum.handleUndefined]: (value) => "-1"
});

// Return type is inferred when "unhandled" entries exist
// $ExpectType number
$enum.visitValue(rgb).with({
    r: (value) => 10,
    g: $enum.unhandled,
    b: (value) => 30,
    [$enum.handleNull]: (value) => -1,
    [$enum.handleUndefined]: (value) => -1
});

// special handlers can be unhandled
// $ExpectType number
$enum.visitValue(rgb).with({
    r: (value) => 10,
    g: (value) => 20,
    b: (value) => 30,
    [$enum.handleNull]: $enum.unhandled,
    [$enum.handleUndefined]: $enum.unhandled,
    [$enum.handleUnexpected]: $enum.unhandled
});

// Missing value handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    b: (value) => {},
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Missing null handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});

// Missing undefined handler causes error
// $ExpectError
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {},
    [$enum.handleNull]: (value) => {}
});

// Unexpected value handler causes error
$enum.visitValue(rgb).with<void>({
    r: (value) => {},
    // $ExpectError
    oops: (value) => {},
    g: (value) => {},
    b: (value) => {},
    [$enum.handleNull]: (value) => {},
    [$enum.handleUndefined]: (value) => {}
});
