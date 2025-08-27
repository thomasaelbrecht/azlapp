import { HomeIcon, WavesLadderIcon, PiggyBankIcon, Users2Icon, MailIcon, ShieldIcon, BookOpenIcon } from "lucide-react";
import { SidebarItem } from "./nav-main";

export const navMainItems: SidebarItem[] = [
  {
    title: "Home",
    url: "/home",
    icon: <HomeIcon className="size-4 shrink-0" />,
    isActive: true,
  },
  {
    title: "Groepen",
    url: "/groups",
    icon: <WavesLadderIcon className="size-4 shrink-0" />,
  },
  {
    title: "Prestaties",
    url: "/jobs",
    icon: <PiggyBankIcon className="size-4 shrink-0" />,
  },
  {
    title: "Gebruikers",
    url: "/users",
    icon: <Users2Icon className="size-4 shrink-0" />,
  },
  { title: "Bible", url: "/bible", icon: <BookOpenIcon className="size-4 shrink-0" /> },
  {
    title: "Mail",
    url: "/mail",
    icon: <MailIcon className="size-4 shrink-0" />,
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
    icon: <ShieldIcon className="size-4 shrink-0" />,
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
