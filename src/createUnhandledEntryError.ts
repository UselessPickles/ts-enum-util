/**
 * Creates an Error with a message explaining that an unhandled
 * value was encountered.
 * @param unhandledValue - The unhandled value.
 * @return an Error with a message explaining that an unhandled
 * value was encountered.
 */
export function createUnhandledEntryError(
    unhandledValue: string | number | null | undefined
): Error {
    return new Error(`Unhandled value: ${unhandledValue}`);
}
