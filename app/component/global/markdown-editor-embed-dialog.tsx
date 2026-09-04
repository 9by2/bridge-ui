import { Button } from "@cue/web/app/component/shadcn/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@cue/web/app/component/shadcn/dialog"
import { Input } from "@cue/web/app/component/shadcn/input"
import { Label } from "@cue/web/app/component/shadcn/label"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { SocialEmbedPasteMarkdown } from "@cue/web/shared/lib/social-embed"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { Link2Icon } from "lucide-react"
import { useState, type RefObject } from "react"

export interface MarkdownEditorInsertEmbedButtonProps {
  readonly editorRef: RefObject<MDXEditorMethods | null>
}

const EmbedUrlInputId = "markdown-editor-embed-url"

/**
 * Toolbar button that lets a Studio user manually insert a social embed by typing/pasting a URL,
 * rather than only relying on the paste-to-embed shortcut in `markdown-editor.component.tsx`
 * (which has no visible affordance). Reuses `SocialEmbedPasteMarkdown` so both entry points build
 * the exact same `::embed[url]{platform="..."}` directive markdown.
 */
export function MarkdownEditorInsertEmbedButton({ editorRef }: MarkdownEditorInsertEmbedButtonProps) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [showError, setShowError] = useState(false)

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen) {
      setUrl("")
      setShowError(false)
    }
  }

  function handleUrlChange(value: string) {
    setUrl(value)
    setShowError(false)
  }

  function handleInsert() {
    const embedMarkdown = SocialEmbedPasteMarkdown(url)
    if (!embedMarkdown) {
      setShowError(true)
      return
    }

    // MDXEditorMethods.insertMarkdown inserts at the current Lexical selection, which the
    // dialog's own focus steals; MDXEditor's own docs say to "use the focus if necessary" —
    // re-focus (defaulting to end-of-document) before inserting so the embed always lands
    // instead of silently no-oping. Verified live: without this, clicking Insert closed the
    // dialog but inserted nothing.
    editorRef.current?.focus(() => editorRef.current?.insertMarkdown(embedMarkdown), { defaultSelection: "rootEnd" })
    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button type="button" variant="ghost" size="icon-sm" aria-label={m.markdown_editor_insert_embed_button()}>
            <Link2Icon aria-hidden="true" />
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{m.markdown_editor_embed_dialog_title()}</DialogTitle>
          <DialogDescription>{m.markdown_editor_embed_dialog_description()}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-1.5">
          <Label htmlFor={EmbedUrlInputId}>{m.markdown_editor_embed_dialog_url_label()}</Label>
          <Input
            id={EmbedUrlInputId}
            value={url}
            onChange={(event) => handleUrlChange(event.currentTarget.value)}
            aria-invalid={showError}
          />
          {showError ? (
            <p className="text-destructive-text text-sm">{m.markdown_editor_embed_dialog_unsupported_url()}</p>
          ) : null}
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
            {m.markdown_editor_embed_dialog_cancel()}
          </Button>
          <Button type="button" disabled={!url.trim()} onClick={handleInsert}>
            {m.markdown_editor_embed_dialog_insert()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
