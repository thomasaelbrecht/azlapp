"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { GroupFormDialog } from "@/components/groups/group-form-dialog";
import { Button } from "@/components/ui/button";

interface CreateGroupButtonProps {
  assistTeams: { id: number; name: string }[];
}

export function CreateGroupButton({ assistTeams }: CreateGroupButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusIcon className="size-4" />
        Nieuwe groep
      </Button>
      <GroupFormDialog assistTeams={assistTeams} open={open} onOpenChange={setOpen} />
    </>
  );
}
