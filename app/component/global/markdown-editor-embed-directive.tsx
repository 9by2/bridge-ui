import { SocialEmbedComponent } from "@cue/web/app/component/global/social-embed.component"
import { EmbedDirectiveName, ReadSocialEmbedDirective } from "@cue/web/shared/lib/social-embed"
import type { DirectiveDescriptor } from "@mdxeditor/editor"

/**
 * MDXEditor directive descriptor for `::embed[url]{platform="..."}` \u2014 the read-only editor-side
 * counterpart to `MarkdownPreviewComponent`'s remark-directive renderer, so a pasted social URL
 * shows the same click-to-mount placeholder inside the editor as it does in the published preview.
 */
export const SocialEmbedDirectiveDescriptor: DirectiveDescriptor = {
  name: EmbedDirectiveName,
  attributes: ["platform"],
  hasChildren: false,
  type: "leafDirective",
  testNode(node) {
    return ReadSocialEmbedDirective(node as never) !== null
  },
  Editor({ mdastNode }) {
    const embed = ReadSocialEmbedDirective(mdastNode as never)
    if (!embed) return null

    return <SocialEmbedComponent platform={embed.platform} url={embed.url} />
  }
}
