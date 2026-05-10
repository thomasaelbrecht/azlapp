"use client";

import { DataTable } from "@/components/ui/data-table";
import type { MemberListItem } from "@/services/members";
import { useMemberColumns } from "./columns";

interface MemberTableProps {
  members: MemberListItem[];
  rowCount: number;
}

export function MemberTable({ members, rowCount }: MemberTableProps) {
  const columns = useMemberColumns();
  return <DataTable columns={columns} data={members} rowCount={rowCount} />;
}
