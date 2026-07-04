"use client";

import { useState } from "react";
import { useGroupColumns } from "@/app/groups/columns";
import { DeleteGroupDialog } from "@/components/groups/delete-group-dialog";
import { GroupFormDialog } from "@/components/groups/group-form-dialog";
import { DataTable } from "@/components/ui/data-table";
import type { GroupListItem } from "@/services/groups";

interface GroupTableProps {
  groups: GroupListItem[];
  assistTeams: { id: number; name: string }[];
  rowCount: number;
}

export function GroupTable({ groups, assistTeams, rowCount }: GroupTableProps) {
  const [editingGroup, setEditingGroup] = useState<GroupListItem | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<GroupListItem | null>(null);

  const columns = useGroupColumns({ onEdit: setEditingGroup, onDelete: setDeletingGroup });

  return (
    <>
      <DataTable columns={columns} data={groups} rowCount={rowCount} />
      <GroupFormDialog
        group={editingGroup}
        assistTeams={assistTeams}
        open={editingGroup !== null}
        onOpenChange={open => !open && setEditingGroup(null)}
      />
      <DeleteGroupDialog
        group={deletingGroup}
        open={deletingGroup !== null}
        onOpenChange={open => !open && setDeletingGroup(null)}
      />
    </>
  );
}
