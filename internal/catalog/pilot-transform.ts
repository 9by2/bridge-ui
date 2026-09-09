export function transformPilotExample(source: string, id: string) {
  const [file = "", query] = id.split("?")
  const params = new URLSearchParams(query)
  if (!params.has("pilot") || params.has("raw") || !/\/(?:example\/[^/]+\/[^/]+|catalog\/upload)\.tsx$/.test(file))
    return
  return source
    .replaceAll('from "@bridge/ui"', 'from "@catalog-pilot"')
    .replaceAll('from "@catalog-upload"', 'from "@catalog-upload?pilot"')
}
