"use client";

import { SidebarTrigger, useSidebar } from "../ui/sidebar";

interface PageTitleProps {
  children: React.ReactNode;
}

export function PageTitle({ children }: PageTitleProps) {
  const { isMobile } = useSidebar();

  return (
    <header className="flex flex-row items-center gap-2">
      {isMobile && <SidebarTrigger />}
      <div className="flex flex-col gap-1">
        <h1>{children}</h1>
      </div>
    </header>
  );
}
