import { PageTitle } from "./page-title";

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  return (
    <div className="flex flex-1 flex-col px-6 py-4">
      {title && <PageTitle>{title}</PageTitle>}
      <main>{children}</main>
    </div>
  );
}
