### Compile-Time Tests: TypeScript 2.9+

Proper support for defining types with numeric enum/literal key types is only
supported in TypeScript 2.9+, so these tests focus on using `$enum.visitValue`
and `$enum.mapValue` with number and mixed number+string enums/literals.
