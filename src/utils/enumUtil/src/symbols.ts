/**
 * Unique symbol to be used as the value of an entry in a value
 * visitor/mapper implementation to indicate that the entry is explicitly
 * not handled.
 * If the corresponding value is encountered at run-time, then an error is
 * thrown.
 */
export const unhandledEntry = Symbol("ts-enum-util:unhandledEntry");

/**
 * Unique symbol used as a property name in value visitor/mapper
 * implementations to define a special null value handler.
 * A symbol is used to avoid any possibility of a collision with an actual
 * string enum value.
 */
export const handleNull = Symbol("ts-enum-util:handleNull");

/**
 * Unique symbol used as a property name in value visitor/mapper
 * implementations to define a special undefined value handler.
 * A symbol is used to avoid any possibility of a collision with an actual
 * string enum value.
 */
export const handleUndefined = Symbol("ts-enum-util:handleUndefined");

/**
 * Unique symbol used as a property name in value visitor/mapper
 * implementations to define a special "unexpected" value handler (handles
 * values at run-time that are unexpected based on compile time type).
 * A symbol is used to avoid any possibility of a collision with an actual
 * string enum value.
 */
export const handleUnexpected = Symbol("ts-enum-util:handleUnexpected");
