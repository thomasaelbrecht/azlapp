import type { MDXComponents } from "mdx/types";
import { PageLayout } from "./components/layout/page-layout";
import { PageTitle } from "./components/layout/page-title";

const components: MDXComponents = {
  wrapper: ({ children }) => <PageLayout>{children}</PageLayout>,
  h1: ({ children }) => <PageTitle>{children}</PageTitle>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
