"use client";

import { ChevronRight } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";
import Link from "next/link";
import { ReactNode } from "react";
import { navMainItems } from "./nav-main-items";
import { usePathname } from "next/navigation";
import { navBibleItems } from "./nav-bible-items";

export interface SidebarItem {
  title: string;
  url?: string;
  icon?: ReactNode;
  isActive?: boolean;
  items?: SidebarItem[];
}

function NavMenuItem({ item }: { item: SidebarItem }) {
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip={item.title}>
          {item.url ? (
            <Link href={item.url}>
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ) : (
            <>
              {item.icon}
              <span>{item.title}</span>
            </>
          )}
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible asChild defaultOpen={item.isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.url || subItem.title}>
                <SidebarMenuSubButton asChild>
                  {subItem.url ? (
                    <Link href={subItem.url}>
                      {subItem.icon}
                      <span>{subItem.title}</span>
                    </Link>
                  ) : (
                    <>
                      {subItem.icon}
                      <span>{subItem.title}</span>
                    </>
                  )}
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain() {
  const pathname = usePathname();

  const isBiblePath = pathname.startsWith("/bible");
  const items = isBiblePath ? navBibleItems : navMainItems;

  return (
    <SidebarMenu>
      {isBiblePath && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild tooltip="Back">
            <Link href="/">
              <ChevronRight className="rotate-180" />
              <span>Terug</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}

      {items.map((item) => (
        <NavMenuItem key={item.url || item.title} item={item} />
      ))}
    </SidebarMenu>
  );
}
