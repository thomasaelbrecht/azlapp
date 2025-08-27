import type { MDXComponents } from "mdx/types";
import { PageLayout } from "./components/layout/page-layout";
import { PageTitle } from "./components/layout/page-title";

const components: MDXComponents = {
  wrapper: ({ children }) => <PageLayout>{children}</PageLayout>,
  h1: ({ children }) => <PageTitle>{children}</PageTitle>,
  h2: ({ children }) => <h2 className="underline">{children}</h2>,
  ul: ({ children }) => <ul className="list-disc list-inside ml-8 mb-4 [&_ul]:mb-0 [&_ul]:list-[circle]">{children}</ul>,
  ol: ({ children }) => <ol className="list-decimal list-inside ml-8 mb-4 [&_ul]:mb-0">{children}</ol>,
  p: ({ children }) => <p className="mb-4 last:mb-0">{children}</p>,
  table: ({ children }) => <table className="border-collapse border border-gray-300 mb-4">{children}</table>,
  thead: ({ children }) => <thead className="bg-gray-100">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="border-b border-gray-200">{children}</tr>,
  th: ({ children }) => <th className="border border-gray-300 px-4 py-2 text-left font-semibold">{children}</th>,
  td: ({ children }) => <td className="border border-gray-300 px-4 py-2">{children}</td>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
