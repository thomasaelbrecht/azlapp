"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { triggerMemberSync, updateAssistSettings } from "@/app/actions/assist";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { WorkingYear } from "@/types/api/assist";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";

const assistSettingsSchema = z.object({
  currentWorkingYearId: z.number().int().positive("Please select a working year"),
});

type AssistSettingsFormData = z.infer<typeof assistSettingsSchema>;

interface AssistSettingsFormProps {
  initialSettings: {
    currentWorkingYearId: number;
  } | null;
  workingYears: WorkingYear[];
}

export function AssistSettingsForm({ initialSettings, workingYears }: AssistSettingsFormProps) {
  const [syncingMembers, setSyncingMembers] = useState(false);

  const form = useForm<AssistSettingsFormData>({
    resolver: zodResolver(assistSettingsSchema),
    reValidateMode: "onChange",
    defaultValues: {
      currentWorkingYearId: initialSettings?.currentWorkingYearId,
    },
  });

  const onSubmit = async (data: AssistSettingsFormData) => {
    const result = await updateAssistSettings(data.currentWorkingYearId);

    if (result.success) {
      toast.success("Settings updated successfully");
    } else {
      toast.error(result.error || "Failed to update settings");
    }
  };

  const handleSyncMembers = async () => {
    setSyncingMembers(true);

    try {
      const result = await triggerMemberSync();
      if (result.success) {
        toast.success(result.message || "Member sync triggered successfully");
      } else {
        toast.error("Failed to trigger member sync");
      }
    } catch (err) {
      toast.error("Failed to trigger member sync");
      console.error("Sync error:", err);
    } finally {
      setSyncingMembers(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Settings Form */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="text-xl font-semibold mb-4">Instellingen</h2>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="currentWorkingYearId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="currentWorkingYearId">Huidig werkjaar</FieldLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={value => {
                    field.onChange(parseInt(value, 10));
                  }}
                >
                  <SelectTrigger id="currentWorkingYearId">
                    <SelectValue placeholder="Selecteer een werkjaar" />
                  </SelectTrigger>
                  <SelectContent aria-invalid={fieldState.invalid}>
                    {workingYears.map(year => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldDescription>
                  Selecteer het werkjaar dat gebruikt moet worden voor het synchroniseren van leden.
                </FieldDescription>
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </Field>
            )}
          />

          <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Bezig met opslaan..." : "Opslaan"}
          </Button>
        </form>
      </div>

      {/* Sync Members Section */}
      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Synchronisatie van leden</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Trigger een manuele synchronisatie van alle leden vanuit Assist. Dit zal alle leden uit het geselecteerde
          werkjaar importeren en bijwerken in de AZL app.
        </p>
        <Button onClick={handleSyncMembers} disabled={syncingMembers || !initialSettings} variant="secondary">
          {syncingMembers ? "Bezig met synchroniseren..." : "Synchroniseer leden"}
        </Button>
        {!initialSettings && (
          <p className="mt-2 text-sm text-destructive">Gelieve eerst een werkjaar in te stellen voor synchronisatie.</p>
        )}
      </div>
    </div>
  );
}
