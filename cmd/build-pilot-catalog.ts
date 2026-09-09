import path from "node:path"

import { createPackageStylexPlugin } from "../internal/package-stylex"

const output = path.resolve(".eval/0908-stylex-foundation/catalog")
const result = await Bun.build({
  entrypoints: ["internal/pilot/comparison-client.tsx", "internal/pilot/token.stylex.ts"],
  outdir: output,
  target: "browser",
  format: "esm",
  jsx: { development: false },
  define: { "process.env.NODE_ENV": JSON.stringify("production") },
  plugins: [
    createPackageStylexPlugin({
      dev: false,
      runtimeInjection: false,
      useCSSLayers: true,
      bunDevCssOutput: path.join(output, "candidate.css")
    })
  ]
})
if (!result.success) throw new Error(String(result.logs))
await Bun.write(
  path.join(output, "candidate.css"),
  (await Bun.file(path.join(output, "candidate.css")).text()) + (await Bun.file("internal/pilot/adapter.css").text())
)
await Bun.write(path.join(output, "baseline.css"), Bun.file("dist/style.css"))
const client = (await Bun.file(path.join(output, "comparison-client.js")).text()).replaceAll("</script", "<\\/script")
await Bun.write(
  path.join(output, "frame.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Pilot frame</title><script>
const query = new URLSearchParams(location.search);
document.documentElement.className = query.get('theme') === 'dark' ? 'dark' : '';
const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = query.get('candidate') === 'true' ? 'candidate.css' : 'baseline.css'; document.head.append(link);
</script><style>body { margin: 0; background: white; color: oklch(0.145 0 0); font-family: 'Geist Variable', aktiv-grotesk, Sarabun, sans-serif; line-height: 1.5 } .dark body { background: oklch(0.1776 0 0); color: oklch(0.683 0 0) }</style><body><div id="root"></div><script type="module">${client}</script></body></html>`
)
await Bun.write(
  path.join(output, "index.html"),
  `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Private pilot A/B</title><style>body{margin:24px;font:16px system-ui;background:#f4f4f4}header{display:flex;gap:16px;align-items:center;flex-wrap:wrap}section{display:flex;gap:16px;overflow:auto}iframe{width:390px;height:850px;background:white;border:1px solid #bbb;flex-shrink:0}label{display:flex;gap:8px}h1{font-size:20px}</style><header><h1>Private pilot A/B</h1><label>Theme <select id="theme"><option>light</option><option>dark</option></select></label><label>Width <select id="width"><option>390</option><option>1280</option></select></label></header><p>Generated baseline left; isolated StyleX candidate right. Dark error copy intentionally differs for accessibility (DEC-010). Not approved for export promotion.</p><section><div><h2>Baseline</h2><iframe title="Generated baseline"></iframe></div><div><h2>Candidate</h2><iframe title="StyleX candidate"></iframe></div></section><script>
const theme = document.getElementById('theme'), width = document.getElementById('width');
function update(){document.querySelectorAll('iframe').forEach((frame,index)=>{frame.style.width=width.value+'px';frame.src='frame.html?theme='+theme.value+'&candidate='+(index===1)})}theme.onchange=update;width.onchange=update;update();
</script></html>`
)
console.log(`Built private A/B catalog: ${output}`)
