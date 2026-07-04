import type { ColumnDef } from "@tanstack/react-table";
import { CheckIcon, PencilIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupListItem } from "@/services/groups";
import { trainingDayLabels } from "@/types/groups";

const euroFormatter = new Intl.NumberFormat("nl-BE", { style: "currency", currency: "EUR" });

function formatTime(time: string): string {
  return time.slice(0, 5);
}

interface GroupColumnOptions {
  onEdit: (group: GroupListItem) => void;
  onDelete: (group: GroupListItem) => void;
}

export function useGroupColumns({ onEdit, onDelete }: GroupColumnOptions): ColumnDef<GroupListItem>[] {
  return [
    {
      accessorKey: "name",
      header: "Naam",
      cell: ({ row }) => <span className="font-medium">{row.original.name}</span>,
    },
    {
      accessorKey: "memberCount",
      header: "Leden",
      cell: ({ row }) => <span>{row.original.memberCount}</span>,
    },
    {
      accessorKey: "trainings",
      header: "Trainingen",
      cell: ({ row }) =>
        row.original.trainings.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.trainings.map(training => (
              <span
                key={training.id}
                className="inline-flex items-center rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs font-medium"
              >
                {trainingDayLabels[training.day]} {formatTime(training.start)} - {formatTime(training.end)}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: "extraPerLesson",
      header: "Extra per les",
      cell: ({ row }) => {
        const amount = Number(row.original.extraPerLesson ?? 0);
        return amount > 0 ? (
          <span>{euroFormatter.format(amount)}</span>
        ) : (
          <span className="text-muted-foreground">-</span>
        );
      },
    },
    {
      accessorKey: "detailedHours",
      header: "Gedetailleerde uren",
      cell: ({ row }) =>
        row.original.detailedHours ? (
          <CheckIcon className="size-4 text-primary" />
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Groep bewerken" onClick={() => onEdit(row.original)}>
            <PencilIcon className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Groep verwijderen"
            className="text-destructive hover:text-destructive"
            onClick={() => onDelete(row.original)}
          >
            <Trash2Icon className="size-4" />
          </Button>
        </div>
      ),
    },
  ];
}
