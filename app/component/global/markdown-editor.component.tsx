import { MarkdownEditorInsertEmbedButton } from "@cue/web/app/component/global/markdown-editor-embed-dialog"
import { SocialEmbedDirectiveDescriptor } from "@cue/web/app/component/global/markdown-editor-embed-directive"
import { CreateMarkdownEditorImageDialog } from "@cue/web/app/component/global/markdown-editor-image-dialog"

import "@mdxeditor/editor/style.css"
import "@cue/web/app/component/global/markdown-editor.component.css"

import { m } from "@cue/web/shared/i18n/runtime/messages"
import { SocialEmbedPasteMarkdown } from "@cue/web/shared/lib/social-embed"
import type * as MdxEditor from "@mdxeditor/editor"
import type { MDXEditorMethods } from "@mdxeditor/editor"
import { useEffect, useMemo, useRef, useState, type ClipboardEvent, type RefObject } from "react"

interface MarkdownEditorComponentProps {
  readonly ariaLabel: string
  readonly extendedToolbar?: boolean
  readonly inputName?: string
  readonly markdown: string
  readonly onImageUpload?: (file: File) => Promise<string>
  readonly onMarkdownChange: (markdown: string) => void
  readonly placeholder?: string
}

const CodeBlockLanguages = {
  txt: "Text",
  js: "JavaScript",
  jsx: "JSX",
  ts: "TypeScript",
  tsx: "TSX",
  css: "CSS",
  html: "HTML",
  json: "JSON",
  md: "Markdown"
} as const

type MdxEditorModule = typeof MdxEditor

function MarkdownEditorToolbar({
  editor,
  editorRef,
  withExtended,
  withImage
}: {
  readonly editor: MdxEditorModule
  readonly editorRef: RefObject<MDXEditorMethods | null>
  readonly withExtended: boolean
  readonly withImage: boolean
}) {
  const {
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
    CodeToggle,
    CreateLink,
    DiffSourceToggleWrapper,
    InsertCodeBlock,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    Separator,
    UndoRedo
  } = editor

  const toolbarContent = (
    <>
      <UndoRedo />
      <Separator />
      <BlockTypeSelect />
      <ListsToggle />
      <Separator />
      <BoldItalicUnderlineToggles />
      <CodeToggle />
      <CreateLink />
      {withImage ? <InsertImage /> : null}
      <MarkdownEditorInsertEmbedButton editorRef={editorRef} />
      {withExtended ? (
        <>
          <Separator />
          <InsertTable />
          <InsertThematicBreak />
          <InsertCodeBlock />
        </>
      ) : (
        <>
          <Separator />
          <InsertThematicBreak />
        </>
      )}
    </>
  )

  if (!withExtended) return toolbarContent

  return <DiffSourceToggleWrapper>{toolbarContent}</DiffSourceToggleWrapper>
}

function CreateMarkdownEditorPlugins(
  editor: MdxEditorModule,
  editorRef: RefObject<MDXEditorMethods | null>,
  extendedToolbar: boolean,
  onImageUpload?: (file: File) => Promise<string>
) {
  const {
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    directivesPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin
  } = editor

  return [
    headingsPlugin({ allowedHeadingLevels: [1, 2, 3, 4] }),
    listsPlugin(),
    quotePlugin(),
    thematicBreakPlugin(),
    linkPlugin(),
    linkDialogPlugin(),
    directivesPlugin({
      directiveDescriptors: [SocialEmbedDirectiveDescriptor],
      escapeUnknownTextDirectives: true
    }),
    ...(onImageUpload
      ? [imagePlugin({ imageUploadHandler: onImageUpload, ImageDialog: CreateMarkdownEditorImageDialog(editor) })]
      : []),
    // tablePlugin/codeBlockPlugin/codeMirrorPlugin stay instantiated for every role: they own
    // MDXEditor's markdown parse/export for table and fenced-code nodes, not just the toolbar
    // buttons. Gating them behind `extendedToolbar` breaks round-tripping of pre-existing
    // table/code-block content for non-ROOT viewers (it degrades to raw pipe/backtick text
    // instead of a rendered table/code block) — verified live via Playwright
    // (.eval/0727-dev370-event-detail-editor/non-root-editor-existing-table-codeblock.png).
    // Only the toolbar buttons that let a user *insert* a new table/code block, and the
    // diff/source view-mode toggle, are role-gated.
    tablePlugin(),
    codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
    codeMirrorPlugin({ codeBlockLanguages: CodeBlockLanguages }),
    ...(extendedToolbar ? [diffSourcePlugin({ viewMode: "rich-text", diffMarkdown: "" })] : []),
    markdownShortcutPlugin(),
    toolbarPlugin({
      toolbarContents: () => (
        <MarkdownEditorToolbar
          editor={editor}
          editorRef={editorRef}
          withExtended={extendedToolbar}
          withImage={Boolean(onImageUpload)}
        />
      )
    })
  ]
}

export function MarkdownEditorComponent({
  ariaLabel,
  extendedToolbar = false,
  inputName,
  markdown,
  onImageUpload,
  onMarkdownChange,
  placeholder = m.markdown_editor_placeholder()
}: MarkdownEditorComponentProps) {
  const [editorModule, setEditorModule] = useState<MdxEditorModule | null>(null)
  const editorRef = useRef<MDXEditorMethods | null>(null)
  const plugins = useMemo(
    () => (editorModule ? CreateMarkdownEditorPlugins(editorModule, editorRef, extendedToolbar, onImageUpload) : []),
    [editorModule, extendedToolbar, onImageUpload]
  )

  useEffect(() => {
    let isMounted = true

    async function loadEditor() {
      try {
        const loadedEditorModule = await import("@mdxeditor/editor")
        if (isMounted) {
          setEditorModule(loadedEditorModule)
        }
      } catch {
        return
      }
    }

    void loadEditor()

    return () => {
      isMounted = false
    }
  }, [])

  function handleMarkdownChange(nextMarkdown: string) {
    onMarkdownChange(nextMarkdown)
  }

  function handlePaste(pasteEvent: ClipboardEvent<HTMLElement>) {
    const clipboardText = pasteEvent.clipboardData.getData("text/plain")
    const embedMarkdown = SocialEmbedPasteMarkdown(clipboardText)
    if (!embedMarkdown) return

    pasteEvent.preventDefault()
    editorRef.current?.insertMarkdown(embedMarkdown)
  }

  const sectionClassName = "bridge-markdown-editor min-h-0 border bg-background"
  const editorClassName = "h-full min-h-[24rem] overflow-auto"
  const contentEditableClassName = "markdown-preview mx-auto max-w-5xl min-h-[20rem] p-4 md:p-8 focus:outline-none"

  if (!editorModule) {
    return (
      <section aria-busy="true" aria-label={ariaLabel} className={sectionClassName}>
        {inputName ? <input type="hidden" name={inputName} value={markdown} /> : null}
        <textarea
          aria-label={m.markdown_editor_loading_aria_label()}
          className={contentEditableClassName}
          placeholder={placeholder}
          readOnly
          value={markdown}
        />
      </section>
    )
  }

  const { MDXEditor } = editorModule

  return (
    <section aria-label={ariaLabel} className={sectionClassName} onPasteCapture={handlePaste}>
      {inputName ? <input type="hidden" name={inputName} value={markdown} /> : null}
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={handleMarkdownChange}
        placeholder={placeholder}
        className={editorClassName}
        contentEditableClassName={contentEditableClassName}
        plugins={plugins}
      />
    </section>
  )
}
