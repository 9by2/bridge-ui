# Decision: Sidebar Example

### DEC-001: Isolate one configuration per preview

**GIVEN** desktop Sidebar uses fixed positioning
**WHEN** multiple Sidebar configurations render in one document
**THEN** they overlap and cannot demonstrate their geometry accurately.

### DEC-002: Show complete shell composition

**GIVEN** Sidebar behavior depends on its provider, gap, and inset relationship
**WHEN** a catalog example documents a configuration
**THEN** it renders Sidebar and SidebarInset together with realistic navigation and content.

### DEC-003: Match child order to sidebar side

**GIVEN** Sidebar reserves layout space through an in-flow gap before its fixed container
**WHEN** the sidebar is configured on the right
**THEN** SidebarInset renders before Sidebar so the reserved gap and fixed surface occupy the same edge without overlap.

### DEC-004: Variants must differ by surface geometry

**GIVEN** sidebar, floating, and inset are separate public variants
**WHEN** each variant renders in the catalog
**THEN** sidebar is flush, floating pads and visibly elevates the navigation surface, and inset additionally gives the content a 12px gutter, outline, and visible elevation.
