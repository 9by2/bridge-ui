// Static server for catalog-dist (same routing as cmd/run-catalog-test.ts).
const root = "catalog-dist"
const server = Bun.serve({
  hostname: "127.0.0.1",
  port: Number(process.env.PORT ?? 6033),
  async fetch(request) {
    const url = new URL(request.url)
    const file = Bun.file(`${root}${url.pathname === "/" ? "/index.html" : url.pathname}`)
    return (await file.exists()) ? new Response(file) : new Response(Bun.file(`${root}/index.html`))
  }
})
console.log(`serving ${server.url}`)
