# Decision

**GIVEN** RC output calls jsxDEV and production React cannot execute it
**WHEN** building package output
**THEN** explicitly disable development JSX and test production rendering in a separate process. Do not rely on caller NODE_ENV or patch generated source.
