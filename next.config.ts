import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/, // Also include .md files, not just .mdx
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: ["rehype-mermaid"],
  },
});

export default withMDX(nextConfig);
