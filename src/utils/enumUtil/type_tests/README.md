## Compile-Time Tests
This directory contains tests of compile-time types, using `dtslint`. Tests are broken down into subdirectories for different ranges of TypeScript versions. The code in these tests is not exectuted. It is only evaluated for compile-time type assertions.

Each subdirectory is a complete independent environment for `dtslint`, each with its own `tsconfig.json`, `tslint.json`, and dummy `index.d.ts` files.