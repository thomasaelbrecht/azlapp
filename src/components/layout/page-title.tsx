"use client";

import type { ReactNode } from "react";
import { SidebarCollapseButton, SidebarTrigger } from "../ui/sidebar";

interface PageTitleProps {
  children: ReactNode;
  actions?: ReactNode;
}

export function PageTitle({ children, actions }: PageTitleProps) {
  return (
    <header className="flex flex-row items-center gap-2 mb-4">
      <SidebarTrigger className="md:hidden" />
      <div className="hidden md:block">
        <SidebarCollapseButton />
      </div>
      <div className="flex justify-between items-center gap-1 w-full">
        <h1>{children}</h1>
        {actions}
      </div>
    </header>
  );
}
