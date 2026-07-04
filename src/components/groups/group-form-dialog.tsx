"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { createGroupAction, updateGroupAction } from "@/app/actions/groups";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const NO_ASSIST_TEAM = "none";

const groupFormSchema = z.object({
  name: z.string().min(1, "Een groepsnaam is verplicht"),
  extraPerLesson: z.number("Het bedrag moet een getal zijn").min(0, "Het bedrag mag niet negatief zijn"),
  detailedHours: z.boolean(),
  assistTeamId: z.number().nullable(),
});

type GroupFormData = z.infer<typeof groupFormSchema>;

export interface GroupFormValues {
  id: string;
  name: string;
  extraPerLesson: string | null;
  detailedHours: boolean | null;
  assistTeamId: number | null;
}

interface GroupFormDialogProps {
  group?: GroupFormValues | null;
  assistTeams: { id: number; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toFormData(group?: GroupFormValues | null): GroupFormData {
  return {
    name: group?.name ?? "",
    extraPerLesson: group?.extraPerLesson ? Number(group.extraPerLesson) : 0,
    detailedHours: group?.detailedHours ?? false,
    assistTeamId: group?.assistTeamId ?? null,
  };
}

export function GroupFormDialog({ group, assistTeams, open, onOpenChange }: GroupFormDialogProps) {
  const isEditing = Boolean(group);

  const form = useForm<GroupFormData>({
    resolver: zodResolver(groupFormSchema),
    reValidateMode: "onChange",
    defaultValues: toFormData(group),
  });

  useEffect(() => {
    if (open) {
      form.reset(toFormData(group));
    }
  }, [open, group, form]);

  const onSubmit = async (data: GroupFormData) => {
    const result = group ? await updateGroupAction({ id: group.id, ...data }) : await createGroupAction(data);

    if (result.success) {
      toast.success(isEditing ? "Groep succesvol bijgewerkt" : "Groep succesvol aangemaakt");
      onOpenChange(false);
    } else {
      toast.error(result.error || "Er is iets misgegaan");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Groep bewerken" : "Nieuwe groep"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Pas de gegevens van de groep aan." : "Vul de gegevens van de nieuwe groep in."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Controller
            name="name"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="name">Groepsnaam</FieldLabel>
                <Input id="name" placeholder="Groepsnaam" aria-invalid={fieldState.invalid} {...field} />
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            name="extraPerLesson"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="extraPerLesson">Extra bedrag per les</FieldLabel>
                <FieldDescription>Extra vergoeding voor een trainer per les, in euro.</FieldDescription>
                <Input
                  id="extraPerLesson"
                  type="number"
                  min={0}
                  step={0.01}
                  aria-invalid={fieldState.invalid}
                  value={Number.isNaN(field.value) ? "" : field.value}
                  onChange={e => field.onChange(e.target.valueAsNumber)}
                  onBlur={field.onBlur}
                />
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            name="assistTeamId"
            control={form.control}
            render={({ field, fieldState }) => {
              // Keep the current team visible even when it is missing from the Assist team list
              const isUnknownTeam = field.value !== null && !assistTeams.some(team => team.id === field.value);

              return (
                <Field>
                  <FieldLabel htmlFor="assistTeamId">Assist team</FieldLabel>
                  <FieldDescription>
                    Het Assist team dat aan deze groep gekoppeld is, gebruikt bij het synchroniseren van leden.
                  </FieldDescription>
                  <Select
                    value={field.value === null ? NO_ASSIST_TEAM : field.value.toString()}
                    onValueChange={value => field.onChange(value === NO_ASSIST_TEAM ? null : Number(value))}
                  >
                    <SelectTrigger id="assistTeamId" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Selecteer een Assist team" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={NO_ASSIST_TEAM}>Geen Assist team</SelectItem>
                      {isUnknownTeam && (
                        <SelectItem value={String(field.value)}>Onbekend team ({field.value})</SelectItem>
                      )}
                      {assistTeams.map(team => (
                        <SelectItem key={team.id} value={team.id.toString()}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                </Field>
              );
            }}
          />

          <Controller
            name="detailedHours"
            control={form.control}
            render={({ field }) => (
              <Field orientation="horizontal">
                <Checkbox id="detailedHours" checked={field.value} onCheckedChange={field.onChange} />
                <FieldLabel htmlFor="detailedHours">Gedetailleerde uren per zwemmer</FieldLabel>
              </Field>
            )}
          />

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Annuleer
              </Button>
            </DialogClose>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Bezig met opslaan..." : "Opslaan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
