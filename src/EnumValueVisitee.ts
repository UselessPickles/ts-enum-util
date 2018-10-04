import { Symbols } from "./Symbols";
import { createUnhandledEntryError } from "./createUnhandledEntryError";
import {
    EnumValueVisitorHandler,
    EnumValueVisitorCore,
    EnumValueVisitor,
    EnumValueVisitorWithNull,
    EnumValueVisitorWithUndefined,
    EnumValueVisitorWithNullAndUndefined
} from "./EnumValueVisitor";

/**
 * A wrapper around a string literal or string enum value to be visited.
 * Do not use this class directly. Use the {@link visitString} function to get an instance of this class.
 *
 * @template E - A string literal type or string enum type.
 */
export class EnumValueVisitee<E extends string | number> {
    /**
     * Do not use this constructor directly. Use the {@link visitString} function to get an instance of this class.
     * @param value - The value to be wrapped by this "visitee".
     */
    public constructor(private readonly value: E) {}

    /**
     * Visits the wrapped value using the supplied visitor.
     * Calls the visitor method whose name matches the wrapped value.
     *
     * @template R - The return type of the visitor methods.
     *
     * @param visitor - A visitor implementation for type E that returns type R.
     * @returns The return value of the visitor method that is called.
     */
    public with<R>(visitor: EnumValueVisitor<E, R>): R {
        if (visitor.hasOwnProperty(this.value)) {
            const handler = (visitor as EnumValueVisitorCore<E, R>)[this.value];
            return processEntry(handler, this.value);
        } else if (visitor[Symbols.handleUnexpected]) {
            return processEntry(visitor[Symbols.handleUnexpected]!, this.value);
        } else {
            throw new Error(`Unexpected value: ${this.value}`);
        }
    }
}

/**
 * A wrapper around a string literal or string enum value to be visited.
 * For values that may be null.
 * Do not use this class directly. Use the {@link visitString} function to get an instance of this class.
 *
 * NOTE: At run time, this class is used by {@link visitString} ONLY for handling null values.
 *       {@link EnumValueVisitee} contains the core run time implementation that is applicable to all
 *       "EnumValueVisitee" classes.
 *
 * @template E - A string literal type or string enum type.
 */
export class EnumValueVisiteeWithNull<E extends string | number> {
    /**
     * Visits the wrapped value using the supplied visitor.
     * If the wrapped value is null, calls the visitor's {@link StringNullVisitor#handleNull} method.
     * Otherwise, calls the visitor method whose name matches the wrapped value.
     *
     * @template R - The return type of the visitor methods.
     *
     * @param visitor - A visitor implementation for type E that returns type R.
     * @returns The return value of the visitor method that is called.
     */
    public with<R>(visitor: EnumValueVisitorWithNull<E, R>): R {
        // This class is used at run time for visiting null values regardless of the compile time
        // type being visited, so we actually have to check if handleNull exists.
        if (visitor[Symbols.handleNull]) {
            return processEntry(visitor[Symbols.handleNull], null);
        } else if (visitor[Symbols.handleUnexpected]) {
            return processEntry(
                visitor[Symbols.handleUnexpected]!,
                (null as any) as E
            );
        } else {
            throw new Error(`Unexpected value: null`);
        }
    }
}

/**
 * A wrapper around a string literal or string enum value to be visited.
 * For values that may be undefined.
 * Do not use this class directly. Use the {@link visitString} function to get an instance of this class.
 *
 * NOTE: At run time, this class is used by {@link visitString} ONLY for handling undefined values.
 *       {@link EnumValueVisitee} contains the core run time implementation that is applicable to all
 *       "EnumValueVisitee" classes.
 *
 * @template E - A string literal type or string enum type.
 */
export class EnumValueVisiteeWithUndefined<E extends string | number> {
    /**
     * Visits the wrapped value using the supplied visitor.
     * If the wrapped value is undefined, calls the visitor's {@link StringNullVisitor#handleUndefined} method.
     * Otherwise, calls the visitor method whose name matches the wrapped value.
     *
     * @template R - The return type of the visitor methods.
     *
     * @param visitor - A visitor implementation for type E that returns type R.
     * @returns The return value of the visitor method that is called.
     */
    public with<R>(visitor: EnumValueVisitorWithUndefined<E, R>): R {
        // This class is used at run time for visiting undefined values regardless of the compile time
        // type being visited, so we actually have to check if handleUndefined exists.
        if (visitor[Symbols.handleUndefined]) {
            return processEntry(visitor[Symbols.handleUndefined], undefined);
        } else if (visitor[Symbols.handleUnexpected]) {
            return processEntry(
                visitor[Symbols.handleUnexpected]!,
                (undefined as any) as E
            );
        } else {
            throw new Error(`Unexpected value: undefined`);
        }
    }
}

/**
 * A wrapper around a string literal or string enum value to be visited.
 * For values that may be null and undefined.
 * Do not use this class directly. Use the {@link visitString} function to get an instance of this class.
 *
 * NOTE: No run time implementation of this class actually exists. This is only used for compile-time
 *       typing. {@link EnumValueVisitee} contains the core run time implementation that is applicable to all
 *       "EnumValueVisitee" classes, while {@link EnumValueVisiteeWithNull} and {@link EnumValueVisiteeWithUndefined}
 *       are used at run time to handle null and undefined values.
 *
 * @template E - A string literal type or string enum type.
 */
export declare class EnumValueVisiteeWithNullAndUndefined<
    E extends string | number
> {
    /**
     * Visits the wrapped value using the supplied visitor.
     * If the wrapped value is null, calls the visitor's {@link StringNullVisitor#handleNull} method.
     * If the wrapped value is undefined, calls the visitor's {@link StringNullVisitor#handleUndefined} method.
     * Otherwise, calls the visitor method whose name matches the wrapped value.
     *
     * @template R - The return type of the visitor methods.
     *
     * @param visitor - A visitor implementation for type E that returns type R.
     * @returns The return value of the visitor method that is called.
     */
    public with<R>(visitor: EnumValueVisitorWithNullAndUndefined<E, R>): R;
}

/**
 * Common implementation for processing an entry of a string visitor.
 * @param entry - Either the visitor handler implementation for an entry, or an UnhandledEntry.
 * @param value - The value being mapped.
 * @return The result of executing the provided entry, if it is not an UnhandledEntry.
 * @throws {Error} If the provided entry is an UnhandledEntry.
 */
function processEntry<E extends string | number | null | undefined, R>(
    entry: EnumValueVisitorHandler<E, R> | typeof Symbols.unhandledEntry,
    value: E
): R {
    if (entry === Symbols.unhandledEntry) {
        throw createUnhandledEntryError(value);
    } else {
        return entry(value);
    }
}
