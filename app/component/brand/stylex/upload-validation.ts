type ValueOf<T> = T[keyof T]

export const UploadIssueCode = {
  fileInvalidType: "file-invalid-type",
  fileTooLarge: "file-too-large",
  fileTooSmall: "file-too-small",
  tooManyFiles: "too-many-files",
  tooFewFiles: "too-few-files",
  totalSizeExceeded: "total-size-exceeded",
  custom: "custom"
} as const
export type UploadIssueCode = ValueOf<typeof UploadIssueCode>

/**
 * A validation or limit issue. An issue with `file` rejects that file; an issue without `file`
 * is advisory (e.g. `too-few-files`) and never blocks accepted files (DEC-010).
 */
export type UploadIssue = { code: UploadIssueCode | (string & {}); message: string; file?: File }

/** Minimal attachment shape a validator needs; `UploadAttachment` satisfies it. */
export type UploadValidationItem = { name: string; type: string; size: number }
export type UploadValidationContext = {
  /** Attachments kept after this selection (empty when a single-file selection replaces). */
  value: readonly UploadValidationItem[]
}
export type UploadValidator = (file: readonly File[], context: UploadValidationContext) => readonly UploadIssue[]

/** react-dropzone compatible accept map: `{ "image/*": [".png"], "application/pdf": [] }`. */
export type UploadAccept = Readonly<Record<string, readonly string[]>>

type LimitMessage = (limit: number, file?: File) => string
export type UploadValidationMessage = Partial<{
  [UploadIssueCode.fileInvalidType]: (file: File) => string
  [UploadIssueCode.fileTooLarge]: LimitMessage
  [UploadIssueCode.fileTooSmall]: LimitMessage
  [UploadIssueCode.tooManyFiles]: LimitMessage
  [UploadIssueCode.tooFewFiles]: LimitMessage
}>

const defaultMessage = {
  [UploadIssueCode.fileInvalidType]: (file: File) => `${file.name} has an unsupported file type`,
  [UploadIssueCode.fileTooLarge]: (limit: number, file?: File) => `${file?.name} is larger than ${limit} bytes`,
  [UploadIssueCode.fileTooSmall]: (limit: number, file?: File) => `${file?.name} is smaller than ${limit} bytes`,
  [UploadIssueCode.tooManyFiles]: (limit: number) => `Select up to ${limit} files`,
  [UploadIssueCode.tooFewFiles]: (limit: number) => `Select at least ${limit} files`
} as const

const extensionOf = (name: string) => {
  const index = name.lastIndexOf(".")
  return index < 0 ? "" : name.slice(index).toLowerCase()
}
const normalizeExtension = (value: string) => (value.startsWith(".") ? value : `.${value}`).toLowerCase()

function matchAccept(file: File, acceptMap: UploadAccept) {
  const type = file.type.toLowerCase()
  const fileExtension = extensionOf(file.name)
  return Object.entries(acceptMap).some(([mime, extensionList]) => {
    const pattern = mime.toLowerCase()
    const mimeMatch = pattern.endsWith("/*") ? type.startsWith(pattern.slice(0, -1)) : type === pattern
    return mimeMatch || extensionList.some((item) => normalizeExtension(item) === fileExtension)
  })
}

function accept(value: UploadAccept, option: { message?: (file: File) => string } = {}): UploadValidator {
  const message = option.message ?? defaultMessage[UploadIssueCode.fileInvalidType]
  return (file) =>
    file
      .filter((item) => !matchAccept(item, value))
      .map((item) => ({ code: UploadIssueCode.fileInvalidType, message: message(item), file: item }))
}

function extension(value: readonly string[], option: { message?: (file: File) => string } = {}): UploadValidator {
  const allowed = new Set(value.map(normalizeExtension))
  const message = option.message ?? defaultMessage[UploadIssueCode.fileInvalidType]
  return (file) =>
    file
      .filter((item) => !allowed.has(extensionOf(item.name)))
      .map((item) => ({ code: UploadIssueCode.fileInvalidType, message: message(item), file: item }))
}

export type UploadValidationOption = {
  accept?: UploadAccept
  /** Maximum attachment count after the selection (existing + incoming). */
  maxFiles?: number
  /** Minimum attachment count after the selection; advisory (DEC-010). */
  minFiles?: number
  maxSize?: number
  minSize?: number
  message?: UploadValidationMessage
}

function base(option: UploadValidationOption = {}): UploadValidator {
  const message = { ...defaultMessage, ...option.message }
  return (file, context) => {
    const issue: UploadIssue[] = []
    if (option.accept)
      issue.push(...accept(option.accept, { message: message[UploadIssueCode.fileInvalidType] })(file, context))
    for (const item of file) {
      if (option.maxSize !== undefined && item.size > option.maxSize)
        issue.push({
          code: UploadIssueCode.fileTooLarge,
          message: message[UploadIssueCode.fileTooLarge](option.maxSize, item),
          file: item
        })
      if (option.minSize !== undefined && item.size < option.minSize)
        issue.push({
          code: UploadIssueCode.fileTooSmall,
          message: message[UploadIssueCode.fileTooSmall](option.minSize, item),
          file: item
        })
    }
    const room = option.maxFiles === undefined ? Infinity : Math.max(0, option.maxFiles - context.value.length)
    for (const item of file.slice(room))
      issue.push({
        code: UploadIssueCode.tooManyFiles,
        message: message[UploadIssueCode.tooManyFiles](option.maxFiles ?? 0, item),
        file: item
      })
    const total = context.value.length + Math.min(file.length, room)
    if (option.minFiles !== undefined && total < option.minFiles)
      issue.push({ code: UploadIssueCode.tooFewFiles, message: message[UploadIssueCode.tooFewFiles](option.minFiles) })
    return issue
  }
}

/** Declarative validator builders. Compose them with `composeUploadValidation`. */
export const uploadValidation = { default: base, accept, extension } as const

/** Run every validator and concatenate their issues in order. */
export function composeUploadValidation(...validator: readonly UploadValidator[]): UploadValidator {
  return (file, context) => validator.flatMap((item) => item(file, context))
}
