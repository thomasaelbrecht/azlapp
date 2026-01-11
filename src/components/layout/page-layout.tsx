import { PageTitle } from "./page-title";

interface PageLayoutProps {
  title?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageLayout({ title, children, actions }: PageLayoutProps) {
  return (
    <div className="flex flex-1 flex-col px-6 py-4">
      {title && <PageTitle actions={actions}>{title}</PageTitle>}
      <main>{children}</main>
    </div>
  );
}
