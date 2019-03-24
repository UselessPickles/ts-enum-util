/**
 * Creates an Error with a message explaining that an unhandled
 * value was encountered.
 * @param unhandledValue - The unhandled value.
 * @return an Error with a message explaining that an unhandled
 * value was encountered.
 */
export function createUnhandledEntryError(unhandledValue: unknown): Error {
    return new Error(`Unhandled value: ${unhandledValue}`);
}

/**
 * Creates an Error with a message explaining that an unexpected
 * value was encountered.
 * @param unexpectedValue - The unexpected value.
 * @return an Error with a message explaining that an unexpected
 * value was encountered.
 */
export function createUnexpectedValueError(unexpectedValue: unknown): Error {
    return new Error(
        `Unexpected value: ${unexpectedValue}; type: ${typeof unexpectedValue}`
    );
}
