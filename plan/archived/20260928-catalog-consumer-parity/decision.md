# Decisions: Catalog Consumer Parity

| GIVEN                                                    | WHEN                                          | THEN                                                                                                   |
| -------------------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Catalog put `utilities` after StyleX layers              | Examples relied on utilities to restyle parts | Catalog adopts consumer order; examples lose that power like consumers                                 |
| Example header/footer used 16px/12px                     | Choosing package contract                     | Keep 8px via `--bridge-unit-8` (user decision); header content goes through SidebarMenuButton to align |
| Menu/sidebar em font compounded to 12.25px               | Nested inside SidebarGroupContent             | Use root-relative `--bridge-text-size-*`                                                               |
| Pagination borderless and Empty frames were example-only | A real consumer need                          | Add `activeVariant` and `EmptyVariant`                                                                 |
| Paragraph menu items squeezed to 128px                   | Menu width locked to trigger                  | Content width within max(anchor, 8rem)..min(20rem, viewport); Combobox keeps anchor width              |
