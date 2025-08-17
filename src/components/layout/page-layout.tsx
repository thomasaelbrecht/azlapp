"use client";

import { SidebarTrigger, useSidebar } from "../ui/sidebar";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function PageLayout({ title, children }: PageLayoutProps) {
  const { isMobile } = useSidebar();
  return (
    <div className="flex flex-1 flex-col gap-4 px-6 py-4">
      <header className="flex flex-row items-center gap-2">
        {isMobile && <SidebarTrigger />}
        <div className="flex flex-col gap-1">
          <h1>{title}</h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
