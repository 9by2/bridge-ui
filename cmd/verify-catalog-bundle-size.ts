import assert from "node:assert/strict"
import { readdir, readFile, stat } from "node:fs/promises"
import path from "node:path"

const CatalogBundleConfig = {
  ASSET_DIRECTORY: path.resolve("catalog-dist/assets"),
  INDEX_FILE: path.resolve("catalog-dist/index.html"),
  MAXIMUM_ENTRY_BYTE: 500 * 1024,
  MAXIMUM_LAZY_ASSET_BYTE: 900 * 1024
} as const

const indexSource = await readFile(CatalogBundleConfig.INDEX_FILE, "utf8")
const entryAsset = indexSource.match(/<script[^>]+src="\/assets\/([^"/]+\.js)"/u)?.[1]
assert.ok(entryAsset, "Catalog index must reference an entry JavaScript asset")

const entrySize = (await stat(path.join(CatalogBundleConfig.ASSET_DIRECTORY, entryAsset))).size
assert.ok(
  entrySize <= CatalogBundleConfig.MAXIMUM_ENTRY_BYTE,
  `Catalog entry ${entryAsset} exceeds 500 kB (${entrySize} B)`
)

const oversizedLazyAsset = []
for (const name of await readdir(CatalogBundleConfig.ASSET_DIRECTORY)) {
  if (!name.endsWith(".js") || name === entryAsset) continue
  const size = (await stat(path.join(CatalogBundleConfig.ASSET_DIRECTORY, name))).size
  if (size > CatalogBundleConfig.MAXIMUM_LAZY_ASSET_BYTE) oversizedLazyAsset.push({ name, size })
}
assert.deepEqual(oversizedLazyAsset, [], "Catalog lazy JavaScript assets exceed 900 kB")
