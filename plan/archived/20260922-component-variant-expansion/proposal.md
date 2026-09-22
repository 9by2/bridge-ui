# Component Variant Expansion

**Proposal:** `component-variant-expansion`
**Status:** done
**Phase:** [Quality](../../ADHD.md#quality)

## Problem

The catalog and public API lack several common semantic variants, and multiple examples fail to demonstrate supported behavior. Table framing is also split between two public components despite being one composed table pattern.

## Scope

### In scope

- Add semantic and surface variants for Alert, Badge, Card, Checkbox, Slider, StatusStamp, and Textarea.
- Add line-separated, chevron-enabled Collapsible and a button-style Combobox trigger.
- Replace the file-only image editor contract with a ReactCrop-compatible wrapper and retain Bridge crop export support.
- Consolidate framed Table composition under Table while retaining TableFrame compatibility exports.
- Repair Calendar spacing and MultiSelect command surface styling.
- Expand catalog examples for drawer side directions, Page line tabs, resizable layouts, responsive image sizing, and all changed APIs.

### Out of scope

- Consumer migrations.
- Changes to generated `app/component/shadcn/` source.
- New product-specific copy or workflows.

## Success Criteria

- [x] Public variants and composition contracts are exported, documented, and represented in the catalog.
- [x] ImageCrop accepts the ReactCrop option/callback contract and Bridge output export remains available.
- [x] Existing TableFrame imports continue to work while Table provides canonical frame composition.
- [x] Relevant public behavior passes targeted tests; catalog and package gates pass.
- [x] Bun.WebView evidence records the expanded catalog states.

## Specs

| Spec                        | Path                                       | Summary                                              |
| --------------------------- | ------------------------------------------ | ---------------------------------------------------- |
| component-variant-expansion | `spec/component-variant-expansion/spec.md` | Public component contracts and catalog requirements. |

## References

- [ADHD.md](../../ADHD.md)
- [React Image Crop API](https://github.com/dominictobias/react-image-crop)
- Mobbin: [Retool component inventory](https://mobbin.com/sites/sections/2516034c-7096-4637-80c6-424444c9d100), [Pitch status page](https://mobbin.com/sites/sections/d1d34bd1-4101-4a65-b95f-e3f4b45ad3c2), [Dropbox disclosure rows](https://mobbin.com/sites/sections/9dba533e-4f46-4931-9ad0-4d3e0e6fe103)
