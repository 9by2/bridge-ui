import { Dropzone } from "@bridge/ui/app/component/global/dropzone.component"
import { Button } from "@bridge/ui/app/component/shadcn/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@bridge/ui/app/component/shadcn/dialog"
import { Input } from "@bridge/ui/app/component/shadcn/input"
import { Label } from "@bridge/ui/app/component/shadcn/label"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import type * as MdxEditor from "@mdxeditor/editor"
import { useState } from "react"

type MdxEditorModule = typeof MdxEditor

const ImageAltTextInputId = "markdown-editor-image-alt-text"

/**
 * Minimal `FileList`-shaped value for MDXEditor's `saveImage$` cell, which expects
 * `SaveImageParameters.file?: FileList`. Deliberately not built from the `DataTransfer` API:
 * `DataTransfer` is unavailable in jsdom (this file's own component tests would fail), and this
 * app-facing shape only needs `length`/`item()` to satisfy MDXEditor's own consumer.
 */
function BuildFileList(file: File): FileList {
  const list = {
    0: file,
    length: 1,
    item: (index: number) => (index === 0 ? file : null)
  }
  return list as unknown as FileList
}

/**
 * Replaces MDXEditor's default `ImageDialog` (a plain native `<input type="file">`) with the
 * app's shared drag-and-drop `Dropzone` component, so inline image upload matches every other
 * file-upload surface in Studio. Built as a factory taking the already dynamically-imported
 * `@mdxeditor/editor` module so this file never statically imports it (matches the SSR-safety
 * pattern enforced by `test/component/global/markdown-editor-ssr-import.test.ts`); the returned
 * component reads `imageDialogState$`/`saveImage$`/`closeImageDialog$` through the module's own
 * re-exported `@mdxeditor/gurx` hooks.
 */
export function CreateMarkdownEditorImageDialog(editor: MdxEditorModule) {
  const { useCellValues, usePublisher, imageDialogState$, saveImage$, closeImageDialog$ } = editor

  return function MarkdownEditorImageDialog() {
    const [dialogState] = useCellValues(imageDialogState$)
    const saveImage = usePublisher(saveImage$)
    const closeImageDialog = usePublisher(closeImageDialog$)
    const [file, setFile] = useState<File | undefined>(undefined)
    const [altText, setAltText] = useState("")

    const isOpen = dialogState.type !== "inactive"

    function resetState() {
      setFile(undefined)
      setAltText("")
    }

    function handleOpenChange(open: boolean) {
      if (open) return
      resetState()
      closeImageDialog()
    }

    function handleSave() {
      if (!file) return
      saveImage({ file: BuildFileList(file), altText })
      resetState()
    }

    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{m.markdown_editor_image_dialog_title()}</DialogTitle>
          </DialogHeader>
          <Dropzone
            accept={{ "image/*": [] }}
            multiple={false}
            files={file ? [file] : []}
            inputProps={{ "aria-label": m.markdown_editor_image_upload_input_label() }}
            onFilesChange={(nextFiles) => setFile(nextFiles[0])}
          />
          <div className="grid gap-1.5">
            <Label htmlFor={ImageAltTextInputId}>{m.markdown_editor_image_alt_text_label()}</Label>
            <Input
              id={ImageAltTextInputId}
              value={altText}
              onChange={(event) => setAltText(event.currentTarget.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => handleOpenChange(false)}>
              {m.markdown_editor_image_dialog_cancel()}
            </Button>
            <Button type="button" disabled={!file} onClick={handleSave}>
              {m.markdown_editor_image_dialog_save()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
}
