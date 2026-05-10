import type { ColumnDef } from "@tanstack/react-table";
import { FormattedDateTime } from "@/components/formatted-date";
import { MemberGender } from "@/components/members/member-gender";
import { SortableHeader } from "@/components/table/sortable-table-header";
import type { MemberListItem } from "@/services/members";

export function useMemberColumns(): ColumnDef<MemberListItem>[] {
  return [
    {
      accessorKey: "lastName",
      header: () => <SortableHeader column="lastName" label="Naam" />,
      cell: ({ row }) => <span className="font-medium">{row.original.lastName}</span>,
    },
    {
      accessorKey: "firstName",
      header: () => <SortableHeader column="firstName" label="Voornaam" />,
      cell: ({ row }) => <span>{row.original.firstName}</span>,
    },
    {
      accessorKey: "birthDate",
      header: () => <SortableHeader column="birthDate" label="Geboortedatum" />,
      cell: ({ row }) => <FormattedDateTime className="text-muted-foreground" date={row.original.birthDate} />,
    },
    {
      accessorKey: "gender",
      header: "Geslacht",
      cell: ({ row }) => <MemberGender gender={row.original.gender} />,
    },
    {
      accessorKey: "emails",
      header: "E-mail",
      cell: ({ row }) => {
        const email = row.original.emails[0];
        return email ? (
          <a href={`mailto:${email}`} className="text-primary hover:underline">
            {email}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "phones",
      header: "Telefoon",
      cell: ({ row }) => {
        const phone = row.original.phones[0];
        return phone ? (
          <a href={`tel:${phone}`} className="hover:underline">
            {phone}
          </a>
        ) : (
          <span className="text-muted-foreground">—</span>
        );
      },
    },
    {
      accessorKey: "groups",
      header: "Groepen",
      cell: ({ row }) =>
        row.original.groups.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.groups.map(g => (
              <span
                key={g.id}
                className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium"
              >
                {g.name}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
  ];
}
