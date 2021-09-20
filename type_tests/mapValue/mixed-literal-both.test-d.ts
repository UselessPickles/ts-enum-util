import { $enum } from "../../src";
import { expectType, expectError } from "tsd";

type RGB = 1 | "g" | 3;

declare const rgb: RGB | null | undefined;

// Return type is inferred
expectType<number>(
    $enum.mapValue(rgb).with({
        1: 10,
        g: 20,
        3: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1
    })
);
expectType<string>(
    $enum.mapValue(rgb).with({
        1: "10",
        g: "20",
        3: "30",
        [$enum.handleNull]: "-1",
        [$enum.handleUndefined]: "-1"
    })
);

// Return type is inferred when "unhandled" entries exist
expectType<number>(
    $enum.mapValue(rgb).with({
        1: 10,
        g: $enum.unhandledEntry,
        3: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1
    })
);

// handleUnexpected is allowed
expectType<number>(
    $enum.mapValue(rgb).with({
        1: 10,
        g: 20,
        3: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1,
        [$enum.handleUnexpected]: -1
    })
);

// special handlers can be unhandled
expectType<number>(
    $enum.mapValue(rgb).with({
        1: 10,
        g: 20,
        3: 30,
        [$enum.handleNull]: $enum.unhandledEntry,
        [$enum.handleUndefined]: $enum.unhandledEntry,
        [$enum.handleUnexpected]: $enum.unhandledEntry
    })
);

// Missing value handler causes error
expectError(
    $enum.mapValue(rgb).with({
        1: 10,
        3: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1
    })
);

// Unexpected value handler causes error
expectError(
    $enum.mapValue(rgb).with({
        1: 10,
        oops: 42,
        g: 20,
        3: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1
    })
);

// missing null handler causes error
expectError(
    $enum.mapValue(rgb).with({
        1: 10,
        g: 20,
        3: 30,
        [$enum.handleUndefined]: -1
    })
);

// missing undefined handler causes error
expectError(
    $enum.mapValue(rgb).with({
        1: 10,
        g: 20,
        3: 30,
        [$enum.handleNull]: -1
    })
);
