// tslint:disable:no-empty
import { $enum } from "../../src";
import { expectType, expectError } from "tsd";

type RGB = "r" | "g" | "b";

declare const rgb: RGB;

// Test param types
$enum.visitValue(rgb).with({
    r: (value) => {
        expectType<"r">(value);
    },
    g: (value) => {
        expectType<"g">(value);
    },
    b: (value) => {
        expectType<"b">(value);
    },
    [$enum.handleUnexpected]: (value) => {
        expectType<string | null | undefined>(value);
    }
});

// handleUnexpected is optional
$enum.visitValue(rgb).with({
    r: (value) => {},
    g: (value) => {},
    b: (value) => {}
});

// Return type is inferred
expectType<number>(
    $enum.visitValue(rgb).with({
        r: (value) => 10,
        g: (value) => 20,
        b: (value) => 30
    })
);
expectType<string>(
    $enum.visitValue(rgb).with({
        r: (value) => "10",
        g: (value) => "20",
        b: (value) => "30"
    })
);

// Return type is inferred when "unhandled" entries exist
expectType<number>(
    $enum.visitValue(rgb).with({
        r: (value) => 10,
        g: $enum.unhandledEntry,
        b: (value) => 30
    })
);

// special handlers can be unhandled
expectType<number>(
    $enum.visitValue(rgb).with({
        r: (value) => 10,
        g: (value) => 20,
        b: (value) => 30,
        [$enum.handleUnexpected]: $enum.unhandledEntry
    })
);

// Missing value handler causes error
expectError(
    $enum.visitValue(rgb).with<void>({
        r: (value) => {},
        b: (value) => {}
    })
);

// Unexpected value handler causes error
// expectError(
//     $enum.visitValue(rgb).with<void>({
//         r: (value) => {},
//         oops: (value) => {},
//         g: (value) => {},
//         b: (value) => {}
//     })
// );

// Unnecessary null handler causes error
// expectError(
//     $enum.visitValue(rgb).with<void>({
//         r: (value) => {},
//         g: (value) => {},
//         b: (value) => {},
//         [$enum.handleNull]: (value) => {}
//     })
// );

// Unnecessary undefined handler causes error
// expectError(
//     $enum.visitValue(rgb).with<void>({
//         r: (value) => {},
//         g: (value) => {},
//         b: (value) => {},
//         [$enum.handleUndefined]: (value) => {}
//     })
// );
