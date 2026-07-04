"use client";

import { useState } from "react";
import { toast } from "sonner";
import { deleteGroupAction } from "@/app/actions/groups";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteGroupDialogProps {
  group: { id: string; name: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGroupDialog({ group, open, onOpenChange }: DeleteGroupDialogProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!group) return;

    setDeleting(true);
    const result = await deleteGroupAction(group.id);
    setDeleting(false);

    if (result.success) {
      toast.success("Groep succesvol verwijderd");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Er is iets misgegaan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Groep verwijderen</DialogTitle>
          <DialogDescription>
            Ben je zeker dat je de groep "{group?.name}" wil verwijderen? Deze actie kan niet ongedaan gemaakt worden.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Annuleer
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" disabled={deleting} onClick={handleDelete}>
            {deleting ? "Bezig met verwijderen..." : "Verwijderen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
