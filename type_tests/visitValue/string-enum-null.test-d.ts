// tslint:disable:no-empty
import { $enum } from "../../src";
import { expectType, expectError } from "tsd";

enum RGB {
    R = "r",
    G = "g",
    B = "b"
}

declare const rgb: RGB | null;

// Test param types
$enum.visitValue(rgb).with({
    [RGB.R]: (value) => {
        expectType<RGB.R>(value);
    },
    [RGB.G]: (value) => {
        expectType<RGB.G>(value);
    },
    [RGB.B]: (value) => {
        expectType<RGB.B>(value);
    },
    [$enum.handleNull]: (value) => {
        expectType<null>(value);
    },
    [$enum.handleUnexpected]: (value) => {
        expectType<string | undefined>(value);
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
expectType<number>(
    $enum.visitValue(rgb).with({
        [RGB.R]: (value) => 10,
        [RGB.G]: (value) => 20,
        [RGB.B]: (value) => 30,
        [$enum.handleNull]: (value) => -1
    })
);
expectType<string>(
    $enum.visitValue(rgb).with({
        [RGB.R]: (value) => "10",
        [RGB.G]: (value) => "20",
        [RGB.B]: (value) => "30",
        [$enum.handleNull]: (value) => "-1"
    })
);

// Return type is inferred when "unhandled" entries exist
expectType<number>(
    $enum.visitValue(rgb).with({
        [RGB.R]: (value) => 10,
        [RGB.G]: $enum.unhandledEntry,
        [RGB.B]: (value) => 30,
        [$enum.handleNull]: (value) => -1
    })
);

// special handlers can be unhandled
expectType<number>(
    $enum.visitValue(rgb).with({
        [RGB.R]: (value) => 10,
        [RGB.G]: (value) => 20,
        [RGB.B]: (value) => 30,
        [$enum.handleNull]: $enum.unhandledEntry,
        [$enum.handleUnexpected]: $enum.unhandledEntry
    })
);

// Missing value handler causes error
expectError(
    $enum.visitValue(rgb).with<void>({
        [RGB.R]: (value) => {},
        [RGB.B]: (value) => {},
        [$enum.handleNull]: (value) => {}
    })
);

// Missing null handler causes error
expectError(
    $enum.visitValue(rgb).with<void>({
        [RGB.R]: (value) => {},
        [RGB.G]: (value) => {},
        [RGB.B]: (value) => {}
    })
);

// Unexpected value handler causes error
// expectError(
//     $enum.visitValue(rgb).with<void>({
//         [RGB.R]: (value) => {},
//         oops: (value) => {},
//         [RGB.G]: (value) => {},
//         [RGB.B]: (value) => {},
//         [$enum.handleNull]: (value) => {}
//     })
// );

// Unnecessary undefined handler causes error
// expectError(
//     $enum.visitValue(rgb).with<void>({
//         [RGB.R]: (value) => {},
//         [RGB.G]: (value) => {},
//         [RGB.B]: (value) => {},
//         [$enum.handleNull]: (value) => {},
//         [$enum.handleUndefined]: (value) => {}
//     })
// );
