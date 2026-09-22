# Resizable Sheet Evaluation

## Steps

1. Run `CATALOG_PORT=6017 bun catalog:test`.
2. Open the `sheet/resizable` catalog example.
3. Select **Open resizable sheet**.
4. Drag the centered handle on the left edge of the right sheet to resize it horizontally.

## Result

`sheet/resizable renders accessibly` passed in the Bun.WebView catalog suite. The handle is exposed as the `Resize width` separator. The previous full suite reported unrelated pre-existing failures in BridgeCalendar contrast and catalog readiness timeouts.
