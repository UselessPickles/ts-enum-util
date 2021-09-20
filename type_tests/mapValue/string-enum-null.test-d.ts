import { $enum } from "../../src";
import { expectType, expectError } from "tsd";

enum RGB {
    R = "r",
    G = "g",
    B = "b"
}

declare const rgb: RGB | null;

// Return type is inferred
expectType<number>(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.G]: 20,
        [RGB.B]: 30,
        [$enum.handleNull]: -1
    })
);
expectType<string>(
    $enum.mapValue(rgb).with({
        [RGB.R]: "10",
        [RGB.G]: "20",
        [RGB.B]: "30",
        [$enum.handleNull]: "-1"
    })
);

// Return type is inferred when "unhandled" entries exist
expectType<number>(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.G]: $enum.unhandledEntry,
        [RGB.B]: 30,
        [$enum.handleNull]: -1
    })
);

// handleUnexpected is allowed
expectType<number>(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.G]: 20,
        [RGB.B]: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUnexpected]: -1
    })
);

// special handlers can be unhandled
expectType<number>(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.G]: 20,
        [RGB.B]: 30,
        [$enum.handleNull]: $enum.unhandledEntry,
        [$enum.handleUnexpected]: $enum.unhandledEntry
    })
);

// Missing value handler causes error
expectError(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.B]: 30,
        [$enum.handleNull]: -1
    })
);

// Unexpected value handler causes error
expectError(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        oops: 42,
        [RGB.G]: 20,
        [RGB.B]: 30,
        [$enum.handleNull]: -1
    })
);

// missing null handler causes error
expectError(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.G]: 20,
        [RGB.B]: 30
    })
);

// Unnecessary undefined handler causes error
expectError(
    $enum.mapValue(rgb).with({
        [RGB.R]: 10,
        [RGB.G]: 20,
        [RGB.B]: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1
    })
);
