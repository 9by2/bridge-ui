const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" })

export const segmentGrapheme = (value: string): Intl.SegmentData[] => Array.from(segmenter.segment(value))
