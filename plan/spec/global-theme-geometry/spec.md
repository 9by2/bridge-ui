# Spec: Global Theme Geometry

**Spec ID:** `global-theme-geometry`
**Proposal:** `global-theme-geometry`
**Status:** accepted

## Requirements

### REQ-001: Inherited owned geometry

Theme radius and space overrides affect owned controls, surfaces, overlays, and detail recipes at runtime, including scoped nested Themes and portals. Existing defaults and explicit local variant resets remain intact. Generated Shadcn source is outside scope.

### REQ-002: Density

Density adjusts shared spacing and padding without changing fixed control heights, semantic state, or keyboard behavior.
