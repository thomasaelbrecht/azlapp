"use client";

import { SidebarTrigger, useSidebar } from "../ui/sidebar";

interface PageTitleProps {
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageTitle({ children, actions }: PageTitleProps) {
  const { isMobile } = useSidebar();

  return (
    <header className="flex flex-row items-center gap-2 mb-4">
      {isMobile && <SidebarTrigger />}
      <div className="flex justify-between items-center gap-1 w-full">
        <h1 className="mt-0 mb-4">{children}</h1>
        {actions}
      </div>
    </header>
  );
}
