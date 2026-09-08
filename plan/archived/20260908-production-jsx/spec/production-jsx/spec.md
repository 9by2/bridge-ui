# Production JSX Contract

Package JavaScript must not import react/jsx-dev-runtime. Root and direct Button, Input and Dialog composition must render with production React. Packed verification executes its SSR bundle with NODE_ENV=production after building. No consumer compiler/runtime alias is required.
