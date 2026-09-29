# Decisions

### DEC-001: CMS mapping stays in bridge-web

**GIVEN** the source interprets Tiptap extensions, CMS fallbacks, embeds, copy code and image policies **WHEN** migrating presentation **THEN** only mapped semantic nodes are passed to the package; app-specific interpretation stays in bridge-web.

### DEC-002: Thumbnail is independently exported

**GIVEN** the thumbnail is also used in editing lists **WHEN** building the player **THEN** expose a standalone YouTubeThumbnail and allow it as the player poster.

### DEC-003: Embed security

**GIVEN** iframe URLs can load third parties **WHEN** activating the player **THEN** accept only HTTPS youtube.com or youtube-nocookie.com /embed/ URLs, sandbox the iframe, and never load it before activation.
