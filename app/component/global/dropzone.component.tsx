import { Body } from "@bridge/ui/app/component/global/typography.component"
import { buttonVariants } from "@bridge/ui/app/component/shadcn/button"
import { Dialog, DialogContent, DialogTitle } from "@bridge/ui/app/component/shadcn/dialog"
import { m } from "@cue/web/shared/i18n/runtime/messages"
import { getLocale } from "@cue/web/shared/i18n/runtime/runtime.js"
import { cn } from "cnfast"
import { FileIcon, FileTextIcon, PaperclipIcon, TrashIcon, UploadIcon } from "lucide-react"
import type { HTMLAttributes, InputHTMLAttributes, MouseEvent, ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { Accept, DropEvent, DropzoneOptions, FileRejection } from "react-dropzone"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

// react-doctor-disable-next-line only-export-components -- Public API must stay in this scoped component file.
export const DropzoneChangeEvent = {
  APPEND: "append",
  REPLACE: "replace",
  REMOVE: "remove",
  CLEAR: "clear"
} as const
export type DropzoneChangeEvent = ValueOf<typeof DropzoneChangeEvent>

// react-doctor-disable-next-line only-export-components -- Public API must stay in this scoped component file.
export const DropzonePreviewMode = {
  LIST: "list",
  THUMBNAIL: "thumbnail"
} as const
export type DropzonePreviewMode = ValueOf<typeof DropzonePreviewMode>

// react-doctor-disable-next-line only-export-components -- Public API must stay in this scoped component file.
export const DropzoneVariant = {
  DEFAULT: "default",
  INPUT: "input"
} as const
export type DropzoneVariant = ValueOf<typeof DropzoneVariant>

const DropzoneInputImageAccept = {
  "image/*": []
} satisfies Accept
const EmptyFiles: readonly File[] = []

export type DropzoneValidationIssue = {
  code: string
  message: string
  file?: File
}

export type DropzoneValidationFn = (files: readonly File[]) => readonly DropzoneValidationIssue[]

export type DropzoneValidationOptions = {
  accept?: Accept
  maxFiles?: number
  minFiles?: number
  maxSize?: number
  minSize?: number
}

export type DropzoneChange =
  | {
      kind: typeof DropzoneChangeEvent.APPEND
      nextFiles: File[]
      previousFiles: readonly File[]
      addedFiles: readonly File[]
    }
  | {
      kind: typeof DropzoneChangeEvent.REPLACE
      nextFiles: File[]
      previousFiles: readonly File[]
      addedFiles: readonly File[]
    }
  | {
      kind: typeof DropzoneChangeEvent.REMOVE
      nextFiles: File[]
      removedFile: File
      index: number
    }
  | {
      kind: typeof DropzoneChangeEvent.CLEAR
      nextFiles: File[]
      previousFiles: readonly File[]
    }

export type DropzoneStateComponentProps = {
  files: readonly File[]
  isDragActive: boolean
  disabled?: boolean | undefined
  errors: readonly DropzoneValidationIssue[]
  preview: boolean
  previewMode: DropzonePreviewMode
  multiple: boolean
  onFileRemove?: ((index: number) => void) | undefined
  inputLabel: string
  viewImageLabel: string
  changeImageLabel: string
  className?: string | undefined
}

export type DropzoneStateComponent = (props: DropzoneStateComponentProps) => ReactNode

const renderBytes = (bytes: number) => {
  const units = ["B", "KB", "MB", "GB", "TB", "PB"]
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex++
  }

  return `${size.toFixed(2)}${units[unitIndex]}`
}

const normalizeExtension = (extension: string) => {
  const normalizedExtension = extension.trim().toLowerCase()
  if (!normalizedExtension) return normalizedExtension
  return normalizedExtension.startsWith(".") ? normalizedExtension : `.${normalizedExtension}`
}

const getFileExtension = (file: File) => {
  const extensionStartIndex = file.name.lastIndexOf(".")
  if (extensionStartIndex < 0) return ""
  return file.name.slice(extensionStartIndex).toLowerCase()
}

const matchesMimeType = (fileType: string, mimeType: string) => {
  if (!mimeType) return false
  if (mimeType.endsWith("/*")) {
    return fileType.startsWith(`${mimeType.slice(0, -1)}`)
  }
  return fileType === mimeType
}

const listFormatterCache = new Map<string, Intl.ListFormat>()

const formatList = (values: readonly string[]) => {
  const locale = getLocale()
  let formatter = listFormatterCache.get(locale)
  if (!formatter) {
    formatter = new Intl.ListFormat(locale)
    listFormatterCache.set(locale, formatter)
  }
  return formatter.format([...values])
}

const imagePreviewExtensions = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"])

const isImagePreviewFile = (file: File) => {
  if (file.type.startsWith("image/")) return true
  return imagePreviewExtensions.has(getFileExtension(file))
}

const getFileSignature = (file: File) => `${file.name}\u0000${file.size}\u0000${file.type}\u0000${file.lastModified}`

const dedupeFiles = (files: readonly File[]) => {
  const seen = new Set<string>()

  return files.filter((file) => {
    const signature = getFileSignature(file)
    if (seen.has(signature)) return false
    seen.add(signature)
    return true
  })
}

// react-doctor-disable-next-line only-export-components -- Public API must stay in this scoped component file.
export const composeDropzoneValidation = (...validators: readonly DropzoneValidationFn[]): DropzoneValidationFn => {
  return (files) => validators.flatMap((validator) => [...validator(files)])
}

// react-doctor-disable-next-line only-export-components -- Public API must stay in this scoped component file.
export const DropzoneValidation = {
  DEFAULT: (options: DropzoneValidationOptions): DropzoneValidationFn => {
    const validators: DropzoneValidationFn[] = []

    if (options.accept) validators.push(DropzoneValidation.ACCEPT(options.accept))
    if (options.minFiles) validators.push(DropzoneValidation.MIN_FILES(options.minFiles))
    if (options.maxFiles) validators.push(DropzoneValidation.MAX_FILES(options.maxFiles))
    if (options.minSize) validators.push(DropzoneValidation.MIN_SIZE(options.minSize))
    if (options.maxSize) validators.push(DropzoneValidation.MAX_SIZE(options.maxSize))

    return composeDropzoneValidation(...validators)
  },
  ACCEPT: (accept: Accept): DropzoneValidationFn => {
    return (files) => {
      const entries = Object.entries(accept)
      if (entries.length === 0) return []

      return files.flatMap((file) => {
        const fileExtension = getFileExtension(file)
        const isAccepted = entries.some(([mimeType, extensions]) => {
          const hasMatchingMimeType = matchesMimeType(file.type, mimeType)
          const normalizedExtensions = extensions.flatMap((extension) => {
            const normalized = normalizeExtension(extension)
            return normalized ? [normalized] : []
          })
          if (normalizedExtensions.length === 0) return hasMatchingMimeType
          return hasMatchingMimeType && normalizedExtensions.includes(fileExtension)
        })

        if (isAccepted) return []

        return [
          {
            code: "file-invalid-type",
            message: m.dropzone_file_invalid_type({ fileName: file.name, types: formatList(Object.keys(accept)) }),
            file
          }
        ]
      })
    }
  },
  EXTENSIONS: (extensions: readonly string[]): DropzoneValidationFn => {
    const normalizedExtensions = new Set(
      extensions.flatMap((extension) => {
        const normalized = normalizeExtension(extension)
        return normalized ? [normalized] : []
      })
    )

    return (files) => {
      if (normalizedExtensions.size === 0) return []

      return files.flatMap((file) => {
        if (normalizedExtensions.has(getFileExtension(file))) return []

        return [
          {
            code: "file-invalid-extension",
            message: m.dropzone_file_invalid_extension({
              fileName: file.name,
              extensions: formatList([...normalizedExtensions])
            }),
            file
          }
        ]
      })
    }
  },
  MIME_TYPES: (mimeTypes: readonly string[]): DropzoneValidationFn => {
    return (files) => {
      if (mimeTypes.length === 0) return []

      return files.flatMap((file) => {
        if (mimeTypes.some((mimeType) => matchesMimeType(file.type, mimeType))) return []

        return [
          {
            code: "file-invalid-type",
            message: m.dropzone_file_invalid_type({ fileName: file.name, types: formatList(mimeTypes) }),
            file
          }
        ]
      })
    }
  },
  MAX_FILES: (maxFiles: number): DropzoneValidationFn => {
    return (files) => {
      if (files.length <= maxFiles) return []
      return [{ code: "too-many-files", message: m.dropzone_too_many_files({ maxFiles }) }]
    }
  },
  MIN_FILES: (minFiles: number): DropzoneValidationFn => {
    return (files) => {
      if (files.length >= minFiles) return []
      return [{ code: "too-few-files", message: m.dropzone_too_few_files({ minFiles }) }]
    }
  },
  MAX_SIZE: (maxSize: number): DropzoneValidationFn => {
    return (files) => {
      return files.flatMap((file) => {
        if (file.size <= maxSize) return []

        return [
          {
            code: "file-too-large",
            message: m.dropzone_file_too_large({ fileName: file.name, maxSize: renderBytes(maxSize) }),
            file
          }
        ]
      })
    }
  },
  MIN_SIZE: (minSize: number): DropzoneValidationFn => {
    return (files) => {
      return files.flatMap((file) => {
        if (file.size >= minSize) return []

        return [
          {
            code: "file-too-small",
            message: m.dropzone_file_too_small({ fileName: file.name, minSize: renderBytes(minSize) }),
            file
          }
        ]
      })
    }
  }
} as const

const DropzoneContext = createContext<DropzoneContextType | undefined>(undefined)

type DropzoneContextType = DropzoneStateComponentProps & {
  accept?: DropzoneOptions["accept"] | undefined
  maxSize?: DropzoneOptions["maxSize"] | undefined
  minSize?: DropzoneOptions["minSize"] | undefined
  maxFiles?: DropzoneOptions["maxFiles"] | undefined
  onFileRemove?: ((index: number) => void) | undefined
}

export type DropzoneProps = Omit<DropzoneOptions, "onDrop" | "onDropRejected" | "validator"> & {
  files?: readonly File[]
  src?: readonly File[]
  className?: string
  "data-testid"?: string
  rootProps?: Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "accept" | "disabled" | "multiple" | "type">
  variant?: DropzoneVariant
  inputLabel?: string
  viewImageLabel?: string
  changeImageLabel?: string
  validation?: DropzoneValidationFn | readonly DropzoneValidationFn[]
  preview?: boolean
  previewMode?: DropzonePreviewMode
  toastOnError?: boolean
  onFilesChange?: (files: File[], change: DropzoneChange) => void
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => void
  onDropRejected?: (fileRejections: FileRejection[]) => void
  onValidationError?: (errors: readonly DropzoneValidationIssue[], event: DropEvent) => void
  EmptyState?: DropzoneStateComponent
  ContentDisplay?: DropzoneStateComponent
  children?: ReactNode
}

const normalizeValidation = (validation: DropzoneProps["validation"]): DropzoneValidationFn | undefined => {
  if (!validation) return undefined
  if (typeof validation === "function") return validation
  return composeDropzoneValidation(...validation)
}

export const Dropzone = ({
  accept,
  maxFiles,
  maxSize,
  minSize,
  multiple = false,
  onDrop,
  onDropRejected,
  onFilesChange,
  onValidationError,
  onError,
  disabled,
  files,
  src,
  className,
  children,
  rootProps,
  inputProps,
  variant = DropzoneVariant.DEFAULT,
  inputLabel = m.dropzone_upload_image(),
  viewImageLabel = m.dropzone_view_image(),
  changeImageLabel = m.dropzone_change_image(),
  validation,
  preview = true,
  previewMode = DropzonePreviewMode.LIST,
  toastOnError = true,
  EmptyState,
  ContentDisplay,
  "data-testid": dataTestId,
  ...props
}: DropzoneProps) => {
  const isInputVariant = variant === DropzoneVariant.INPUT
  const currentFiles = useMemo(
    () => (isInputVariant ? [...(files ?? src ?? EmptyFiles)].slice(0, 1) : (files ?? src ?? EmptyFiles)),
    [files, isInputVariant, src]
  )
  const resolvedMultiple = isInputVariant ? false : multiple
  const resolvedAccept = isInputVariant ? (accept ?? DropzoneInputImageAccept) : accept
  const resolvedMaxFiles = isInputVariant ? 1 : maxFiles
  const EmptyStateComponent = EmptyState ?? (isInputVariant ? DropzoneInputEmptyState : DropzoneDefaultEmptyState)
  const ContentDisplayComponent =
    ContentDisplay ?? (isInputVariant ? DropzoneInputContentDisplay : DropzoneDefaultContentDisplay)
  const [errors, setErrors] = useState<readonly DropzoneValidationIssue[]>([])
  const [inputResetKey, setInputResetKey] = useState(0)
  const validateFiles = useMemo(() => normalizeValidation(validation), [validation])

  function notifyError(message: string | undefined) {
    if (!message) return
    if (toastOnError) toast.error(message)
    onError?.(new Error(message))
  }

  function getFileRejectionMessage(fileRejection: FileRejection) {
    const fileName = fileRejection.file.name
    const firstError = fileRejection.errors[0]

    switch (firstError?.code) {
      case "file-invalid-type":
        return m.dropzone_file_invalid_type({
          fileName,
          types: resolvedAccept ? formatList(Object.keys(resolvedAccept)) : m.dropzone_unknown_type()
        })
      case "file-too-large":
        return maxSize
          ? m.dropzone_file_too_large({ fileName, maxSize: renderBytes(maxSize) })
          : m.dropzone_file_rejected({ fileName })
      case "file-too-small":
        return minSize
          ? m.dropzone_file_too_small({ fileName, minSize: renderBytes(minSize) })
          : m.dropzone_file_rejected({ fileName })
      case "too-many-files":
        return resolvedMaxFiles
          ? m.dropzone_too_many_files({ maxFiles: resolvedMaxFiles })
          : m.dropzone_file_rejected({ fileName })
      case "too-few-files":
        return m.dropzone_file_rejected({ fileName })
      default:
        return m.dropzone_file_rejected({ fileName })
    }
  }

  const emitFilesChange = useCallback(
    (nextFiles: File[], change: DropzoneChange) => {
      setErrors([])
      onFilesChange?.(nextFiles, change)
    },
    [onFilesChange]
  )

  function handleDrop(acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) {
    setInputResetKey((key) => key + 1)
    if (event instanceof Event && event.target instanceof HTMLInputElement) event.target.value = ""

    if (fileRejections.length > 0) {
      const firstRejection = fileRejections[0]
      notifyError(firstRejection ? getFileRejectionMessage(firstRejection) : undefined)
      onDropRejected?.(fileRejections)
      return
    }

    const uniqueAcceptedFiles = dedupeFiles(acceptedFiles)
    const validationIssues = validateFiles?.(uniqueAcceptedFiles) ?? []

    if (validationIssues.length > 0) {
      setErrors(validationIssues)
      onValidationError?.(validationIssues, event)
      notifyError(validationIssues[0]?.message)
      return
    }

    const currentFileSignatures = new Set(currentFiles.map(getFileSignature))
    const addedFiles = uniqueAcceptedFiles.filter((file) => !currentFileSignatures.has(getFileSignature(file)))
    const nextFiles = resolvedMultiple ? dedupeFiles([...currentFiles, ...addedFiles]) : uniqueAcceptedFiles.slice(0, 1)
    const changedFiles = resolvedMultiple ? addedFiles : nextFiles
    const change = resolvedMultiple
      ? {
          kind: DropzoneChangeEvent.APPEND,
          nextFiles,
          previousFiles: currentFiles,
          addedFiles: changedFiles
        }
      : {
          kind: DropzoneChangeEvent.REPLACE,
          nextFiles,
          previousFiles: currentFiles,
          addedFiles: changedFiles
        }

    emitFilesChange(nextFiles, change)
    onDrop?.(addedFiles, fileRejections, event)
  }

  const handleRemoveFile = useCallback(
    (index: number) => {
      const removedFile = currentFiles[index]
      if (!removedFile) return

      const nextFiles = currentFiles.filter((_, currentIndex) => currentIndex !== index)
      emitFilesChange(nextFiles, {
        kind: DropzoneChangeEvent.REMOVE,
        nextFiles,
        removedFile,
        index
      })
    },
    [currentFiles, emitFilesChange]
  )

  const dropzoneOptions: DropzoneOptions = {
    ...props,
    multiple: resolvedMultiple,
    onDrop: handleDrop
  }

  if (resolvedAccept !== undefined) dropzoneOptions.accept = resolvedAccept
  if (resolvedMaxFiles !== undefined) dropzoneOptions.maxFiles = resolvedMaxFiles
  if (maxSize !== undefined) dropzoneOptions.maxSize = maxSize
  if (minSize !== undefined) dropzoneOptions.minSize = minSize
  if (onError !== undefined) dropzoneOptions.onError = onError
  if (disabled !== undefined) dropzoneOptions.disabled = disabled

  const { getRootProps, getInputProps, isDragActive } = useDropzone(dropzoneOptions)

  const stateComponentProps: DropzoneStateComponentProps = {
    files: currentFiles,
    isDragActive,
    disabled,
    errors,
    preview,
    previewMode,
    multiple: resolvedMultiple,
    onFileRemove: onFilesChange ? handleRemoveFile : undefined,
    inputLabel,
    viewImageLabel,
    changeImageLabel
  }
  const contextValue = useMemo<DropzoneContextType>(
    () => ({
      files: currentFiles,
      isDragActive,
      disabled,
      errors,
      preview,
      previewMode,
      multiple: resolvedMultiple,
      inputLabel,
      viewImageLabel,
      changeImageLabel,
      accept: resolvedAccept,
      maxSize,
      minSize,
      maxFiles: resolvedMaxFiles,
      onFileRemove: onFilesChange ? handleRemoveFile : undefined
    }),
    [
      currentFiles,
      isDragActive,
      disabled,
      errors,
      preview,
      previewMode,
      resolvedMultiple,
      onFilesChange,
      inputLabel,
      viewImageLabel,
      changeImageLabel,
      resolvedAccept,
      maxSize,
      minSize,
      resolvedMaxFiles,
      handleRemoveFile
    ]
  )

  return (
    <DropzoneContext.Provider value={contextValue}>
      <div
        {...getRootProps({
          ...rootProps,
          "data-testid": dataTestId,
          role: rootProps?.role ?? "button",
          tabIndex: disabled ? -1 : (rootProps?.tabIndex ?? 0)
        })}
        className={cn(
          isInputVariant
            ? "relative flex h-auto w-full items-center overflow-hidden border border-transparent bg-neutral-950 text-left text-neutral-100 shadow-xs transition-colors hover:bg-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            : "relative flex h-auto w-full flex-col items-center justify-center overflow-hidden rounded-none border border-input bg-background p-8 text-center shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
          isInputVariant && (currentFiles.length > 0 ? "rounded-3xl p-4" : "min-h-16 rounded-3xl px-4 py-3"),
          isDragActive && "outline-none ring-1 ring-ring",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        aria-disabled={disabled}>
        <input key={inputResetKey} {...getInputProps(inputProps)} disabled={disabled} />
        {children ??
          (currentFiles.length > 0 ? (
            <ContentDisplayComponent {...stateComponentProps} />
          ) : (
            <EmptyStateComponent {...stateComponentProps} />
          ))}
      </div>
    </DropzoneContext.Provider>
  )
}

const useDropzoneContext = () => {
  const context = useContext(DropzoneContext)

  if (!context) {
    throw new Error("useDropzoneContext must be used within a Dropzone")
  }

  return context
}

const useDropzoneImagePreview = (file: File | undefined, preview: boolean) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Intentional effect: object URLs are an external resource that must be
  // revoked on cleanup, so this cannot be derived during render.
  useEffect(() => {
    if (!file || !preview || !isImagePreviewFile(file)) {
      setImagePreview(null)
      return
    }

    const nextImagePreview = URL.createObjectURL(file)
    setImagePreview(nextImagePreview)

    return () => {
      URL.revokeObjectURL(nextImagePreview)
    }
  }, [file, preview])

  return imagePreview
}

const DropzonePreviewThumbnail = ({ file, preview }: { file: File; preview: boolean }) => {
  const imagePreview = useDropzoneImagePreview(file, preview)

  if (imagePreview) {
    return <img src={imagePreview} alt={file.name} className="size-full object-cover" />
  }

  return <FileIcon size={16} />
}

export const DropzoneInputEmptyState = ({ inputLabel, className }: DropzoneStateComponentProps) => {
  return (
    <div className={cn("flex w-full items-center gap-4", className)}>
      <FileTextIcon className="size-4 shrink-0 text-neutral-50" aria-hidden="true" />
      <Body className="min-w-0 flex-1 truncate font-medium text-neutral-400">{inputLabel}</Body>
      <PaperclipIcon className="size-4 shrink-0 text-neutral-50" aria-hidden="true" />
    </div>
  )
}

export const DropzoneInputContentDisplay = ({
  files,
  preview,
  viewImageLabel,
  changeImageLabel,
  onFileRemove,
  className
}: DropzoneStateComponentProps) => {
  const file = files[0]
  const imagePreview = useDropzoneImagePreview(file, preview)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  function handleViewImage(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (!imagePreview) return
    setIsPreviewOpen(true)
  }

  function handleChangeImage(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    onFileRemove?.(0)
  }

  if (!file) return null

  return (
    <div className={cn("grid w-full grid-cols-[minmax(0,1fr)_minmax(8rem,1fr)] items-center gap-4", className)}>
      <div className="flex aspect-4/5 min-h-0 items-center justify-center overflow-hidden rounded-md bg-neutral-200 text-neutral-500">
        {imagePreview ? (
          <img src={imagePreview} alt={file.name} className="size-full object-cover" />
        ) : (
          <FileIcon className="size-8" aria-hidden="true" />
        )}
      </div>
      <div className="grid min-w-0 gap-4">
        <Body className="truncate font-medium text-neutral-400">{file.name}</Body>
        <button
          type="button"
          className={buttonVariants({ variant: "default", className: "w-full" })}
          disabled={!imagePreview}
          onClick={handleViewImage}>
          {viewImageLabel}
        </button>
        <button
          type="button"
          className={buttonVariants({ variant: "destructive", className: "w-full" })}
          disabled={!onFileRemove}
          onClick={handleChangeImage}>
          {changeImageLabel}
        </button>
      </div>
      {imagePreview ? (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-[calc(100%-2rem)] bg-transparent p-0 ring-0 sm:max-w-2xl">
            <DialogTitle className="sr-only">{file.name}</DialogTitle>
            <img src={imagePreview} alt={file.name} className="max-h-[80vh] w-full rounded-xl object-contain" />
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  )
}

export const DropzoneDefaultContentDisplay = ({
  files,
  preview,
  previewMode,
  multiple,
  onFileRemove,
  className
}: DropzoneStateComponentProps) => {
  if (files.length === 0) {
    return null
  }

  if (multiple && previewMode === DropzonePreviewMode.THUMBNAIL) {
    return (
      <div className={cn("flex w-full flex-col gap-2", className)}>
        <div className="grid w-full grid-cols-2 gap-2 lg:grid-cols-3">
          {files.map((file, index) => (
            <div key={getFileSignature(file)} className="space-y-2 rounded-none border bg-background p-2">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-none bg-muted text-muted-foreground">
                <DropzonePreviewThumbnail file={file} preview={preview} />
                {onFileRemove ? (
                  <button
                    type="button"
                    aria-label={m.dropzone_remove_file({ fileName: file.name })}
                    onClick={(event) => {
                      event.preventDefault()
                      event.stopPropagation()
                      onFileRemove(index)
                    }}
                    className="absolute right-1 top-1 inline-flex size-7 items-center justify-center rounded-none bg-background/80 text-muted-foreground transition-colors hover:bg-background hover:text-destructive-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <TrashIcon size={14} />
                  </button>
                ) : null}
              </div>
              <p className="truncate text-center text-xs font-medium">{file.name}</p>
            </div>
          ))}
        </div>
        <p className="w-full text-wrap text-muted-foreground text-xs">{m.dropzone_drag_drop_replace()}</p>
      </div>
    )
  }

  if (multiple) {
    return (
      <div className={cn("flex w-full flex-col gap-2", className)}>
        <div className="w-full space-y-2">
          {files.map((file, index) => (
            <div key={getFileSignature(file)} className="flex items-center gap-3 rounded-none border bg-background p-2">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-none bg-muted text-muted-foreground">
                <DropzonePreviewThumbnail file={file} preview={preview} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm">{file.name}</p>
                <p className="truncate text-muted-foreground text-xs">{file.type || m.dropzone_unknown_type()}</p>
              </div>
              {onFileRemove ? (
                <button
                  type="button"
                  aria-label={m.dropzone_remove_file({ fileName: file.name })}
                  onClick={(event) => {
                    event.preventDefault()
                    event.stopPropagation()
                    onFileRemove(index)
                  }}
                  className="inline-flex size-8 shrink-0 items-center justify-center rounded-none text-muted-foreground transition-colors hover:bg-muted hover:text-destructive-text focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                  <TrashIcon size={16} />
                </button>
              ) : null}
            </div>
          ))}
        </div>
        <p className="w-full text-wrap text-muted-foreground text-xs">{m.dropzone_drag_drop_replace()}</p>
      </div>
    )
  }

  const fileNames = files.map((file) => file.name)
  const label =
    files.length > 3
      ? `${fileNames.slice(0, 3).join(", ")} ${m.dropzone_and_more({ count: files.length - 3 })}`
      : formatList(fileNames)

  return (
    <div className={cn("flex w-full flex-col items-center justify-center", className)}>
      <div className="flex size-20 items-center justify-center overflow-hidden rounded-none bg-muted text-muted-foreground">
        {files[0] ? <DropzonePreviewThumbnail file={files[0]} preview={preview} /> : <FileIcon size={16} />}
      </div>
      <p className="my-2 w-full truncate font-medium text-sm">{label}</p>
      <p className="w-full text-wrap text-muted-foreground text-xs">{m.dropzone_drag_drop_replace()}</p>
    </div>
  )
}

export type DropzoneContentProps = {
  children?: ReactNode
  className?: string
}

export const DropzoneContent = ({ children, className }: DropzoneContentProps) => {
  const context = useDropzoneContext()

  if (context.files.length === 0) {
    return null
  }

  if (children) {
    return children
  }

  return <DropzoneDefaultContentDisplay {...context} className={className} />
}

export const DropzoneDefaultEmptyState = ({ className }: DropzoneStateComponentProps) => {
  const { accept, maxSize, minSize, maxFiles, multiple } = useDropzoneContext()
  const captions: string[] = []

  if (accept) {
    captions.push(m.dropzone_accepts_types({ types: formatList(Object.keys(accept)) }))
  }

  if (minSize && maxSize) {
    captions.push(m.dropzone_size_between({ minSize: renderBytes(minSize), maxSize: renderBytes(maxSize) }))
  } else if (minSize) {
    captions.push(m.dropzone_size_at_least({ minSize: renderBytes(minSize) }))
  } else if (maxSize) {
    captions.push(m.dropzone_size_less_than({ maxSize: renderBytes(maxSize) }))
  }

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="flex size-8 items-center justify-center rounded-none bg-muted text-muted-foreground">
        <UploadIcon size={16} />
      </div>
      <p className="my-2 w-full truncate text-wrap font-medium text-sm">
        {maxFiles === 1 || !multiple ? m.dropzone_upload_file() : m.dropzone_upload_files()}
      </p>
      <p className="w-full truncate text-wrap text-muted-foreground text-xs">{m.dropzone_drag_drop_upload()}</p>
      {captions.map((caption) => (
        <p key={caption} className="text-wrap text-muted-foreground text-xs">
          {caption}
        </p>
      ))}
    </div>
  )
}

export type DropzoneEmptyStateProps = {
  children?: ReactNode
  className?: string
}

export const DropzoneEmptyState = ({ children, className }: DropzoneEmptyStateProps) => {
  const context = useDropzoneContext()

  if (context.files.length > 0) {
    return null
  }

  if (children) {
    return children
  }

  return <DropzoneDefaultEmptyState {...context} className={className} />
}
