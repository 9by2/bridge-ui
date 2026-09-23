# Design

Convert shared font sizes and radius defaults from pixels to em, using the current Theme 16px font baseline. Convert both the CSS declarations and StyleX fallback expressions so standalone recipes behave consistently. `em` on font size is relative to the parent; `em` on radius is relative to the element font size, so browser checks must cover representative components.
