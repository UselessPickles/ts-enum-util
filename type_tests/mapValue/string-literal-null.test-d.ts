import { $enum } from "../../src";
import { expectType, expectError } from "tsd";

type RGB = "r" | "g" | "b";

declare const rgb: RGB | null;

// Return type is inferred
expectType<number>(
    $enum.mapValue(rgb).with({
        r: 10,
        g: 20,
        b: 30,
        [$enum.handleNull]: -1
    })
);
expectType<string>(
    $enum.mapValue(rgb).with({
        r: "10",
        g: "20",
        b: "30",
        [$enum.handleNull]: "-1"
    })
);

// Return type is inferred when "unhandled" entries exist
expectType<number>(
    $enum.mapValue(rgb).with({
        r: 10,
        g: $enum.unhandledEntry,
        b: 30,
        [$enum.handleNull]: -1
    })
);

// handleUnexpected is allowed
expectType<number>(
    $enum.mapValue(rgb).with({
        r: 10,
        g: 20,
        b: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUnexpected]: -1
    })
);

// special handlers can be unhandled
expectType<number>(
    $enum.mapValue(rgb).with({
        r: 10,
        g: 20,
        b: 30,
        [$enum.handleNull]: $enum.unhandledEntry,
        [$enum.handleUnexpected]: $enum.unhandledEntry
    })
);

// Missing value handler causes error
expectError(
    $enum.mapValue(rgb).with({
        r: 10,
        b: 30,
        [$enum.handleNull]: -1
    })
);

// Unexpected value handler causes error
expectError(
    $enum.mapValue(rgb).with({
        r: 10,
        oops: 42,
        g: 20,
        b: 30,
        [$enum.handleNull]: -1
    })
);

// missing null handler causes error
expectError(
    $enum.mapValue(rgb).with({
        r: 10,
        g: 20,
        b: 30
    })
);

// Unnecessary undefined handler causes error
expectError(
    $enum.mapValue(rgb).with({
        r: 10,
        g: 20,
        b: 30,
        [$enum.handleNull]: -1,
        [$enum.handleUndefined]: -1
    })
);
