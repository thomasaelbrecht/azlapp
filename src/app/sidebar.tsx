import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarMenuButton, SidebarMenuItem, SidebarMenu, SidebarFooter, SidebarMenuSub, SidebarMenuSubItem } from "@/components/ui/sidebar";
import { BellIcon, ChevronDownIcon, ChevronUp, EuroIcon, GraduationCapIcon, Grid2X2Icon, HomeIcon, MailIcon, MailPlusIcon, MailsIcon, NotebookPenIcon, NotepadTextDashedIcon, PiggyBankIcon, ShieldIcon, SlidersHorizontalIcon, User2Icon, Users2Icon, WavesLadderIcon, } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent>
        <SidebarMenu className="mt-4">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <HomeIcon />
                <span>Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <WavesLadderIcon />
                <span>Groepen</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <PiggyBankIcon />
                <span>Prestaties</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="#">
                <Users2Icon />
                <span>Gebruikers</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarMenu>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <MailIcon />
                  Mail
                  <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>

            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <MailPlusIcon />
                      <span>Mail verzenden</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <MailsIcon />
                      <span>Verzonden mails</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <NotepadTextDashedIcon />
                      <span>Templates</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>

        <SidebarMenu>
          <Collapsible defaultOpen className="group/collapsible">
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton>
                  <ShieldIcon />
                  Admin
                  <ChevronDownIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
            </SidebarMenuItem>

            <CollapsibleContent>
              <SidebarMenuSub>
                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Users2Icon />
                      <span>Leden</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <GraduationCapIcon />
                      <span>Diploma&apos;s</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <BellIcon />
                      <span>Meldingen aanwezigheden</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <Grid2X2Icon />
                      <span>Overzicht aanwezigheden</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <NotebookPenIcon />
                      <span>Testmoment</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <EuroIcon />
                      <span>Betalingen</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>

                <SidebarMenuSubItem>
                  <SidebarMenuButton asChild>
                    <Link href="#">
                      <SlidersHorizontalIcon />
                      <span>Instellingen</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuSubItem>
              </SidebarMenuSub>
            </CollapsibleContent>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2Icon /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Profiel</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Help</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Uitloggen</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}