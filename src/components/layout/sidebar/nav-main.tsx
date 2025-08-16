"use client";

import { ChevronRight, HomeIcon, MailIcon, PiggyBankIcon, ShieldIcon, Users2Icon, WavesLadderIcon, type LucideIcon } from "lucide-react";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from "@/components/ui/sidebar";

interface SidebarItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: { title: string; url: string }[];
}

const navMainItems: SidebarItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: "Groepen",
    url: "/groups",
    icon: WavesLadderIcon,
  },
  {
    title: "Prestaties",
    url: "/jobs",
    icon: PiggyBankIcon,
  },
  {
    title: "Gebruikers",
    url: "/users",
    icon: Users2Icon,
  },
  {
    title: "Mail",
    url: "/mail",
    icon: MailIcon,
    items: [
      {
        title: "Mail verzenden",
        url: "/mail/send",
      },
      {
        title: "Verzonden mails",
        url: "/mail/sent",
      },
      {
        title: "Templates",
        url: "/mail/templates",
      },
    ],
  },
  {
    title: "Admin",
    icon: ShieldIcon,
    url: "#",
    items: [
      {
        title: "Leden",
        url: "/admin/members",
      },
      {
        title: "Diploma's",
        url: "/admin/diplomas",
      },
      {
        title: "Meldingen aanwezigheden",
        url: "/admin/attendance-notifications",
      },
      {
        title: "Testmoment",
        url: "/admin/testmoment",
      },
      {
        title: "Betalingen",
        url: "/paymaster/payments",
      },
      {
        title: "Instellingen",
        url: "/admin/settings",
      },
    ],
  },
];

function NavMenuItem({ item }: { item: SidebarItem }) {
  if (!item.items || item.items.length === 0) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <a href={item.url}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <Collapsible key={item.title} asChild defaultOpen={item.isActive} className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton asChild>
                  <a href={subItem.url}>
                    <span>{subItem.title}</span>
                  </a>
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
  return (
    <SidebarMenu>
      {navMainItems.map((item) => (
        <NavMenuItem key={item.url} item={item} />
      ))}
    </SidebarMenu>
  );
}
