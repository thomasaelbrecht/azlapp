"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { updateAssistSettingsAction } from "@/app/actions/assist";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { MemberTeam, WorkingYear } from "@/types/api/assist";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "../ui/field";
import { AssistTeamSelection } from "./assist-team-selection";

const assistSettingsSchema = z.object({
  currentWorkingYearId: z.number().int().positive("Please select a working year"),
  syncedTeamIds: z.array(z.number().int().positive()).optional(),
});

type AssistSettingsFormData = z.infer<typeof assistSettingsSchema>;

interface AssistSettingsFormProps {
  initialSettings: {
    currentWorkingYearId: number;
    syncedTeamIds?: number[];
  } | null;
  workingYears: WorkingYear[];
  memberTeams: MemberTeam[];
}

export function AssistSettingsForm({ initialSettings, workingYears, memberTeams }: AssistSettingsFormProps) {
  const form = useForm<AssistSettingsFormData>({
    resolver: zodResolver(assistSettingsSchema),
    reValidateMode: "onChange",
    defaultValues: {
      currentWorkingYearId: initialSettings?.currentWorkingYearId,
      syncedTeamIds: initialSettings?.syncedTeamIds || [],
    },
  });

  const onSubmit = async (data: AssistSettingsFormData) => {
    const result = await updateAssistSettingsAction(data);

    if (result.success) {
      toast.success("Instellingen succesvol bijgewerkt");
    } else {
      toast.error(result.error || "Fout bij het bijwerken van instellingen");
    }
  };

  const handleTeamSelectionChange = async (team: MemberTeam, checked: boolean) => {
    const prevSelected = form.getValues("syncedTeamIds") || [];
    // Also include all child teams when a parent team is selected, and remove all child teams when a parent team is deselected
    const teamIds = [team.id, ...team.children.map(child => child.id)];

    form.setValue(
      "syncedTeamIds",
      checked ? [...prevSelected, ...teamIds] : prevSelected.filter(id => teamIds.includes(id) === false),
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Instellingen</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="currentWorkingYearId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="currentWorkingYearId">Huidig werkjaar</FieldLabel>
                <FieldDescription>
                  Selecteer het werkjaar dat gebruikt moet worden voor het synchroniseren van leden.
                </FieldDescription>

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
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </Field>
            )}
          />

          <Controller
            name="syncedTeamIds"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="syncedTeamIds">Gesynchroniseerde teams</FieldLabel>
                <FieldDescription>
                  Selecteer welke teams gesynchroniseerd moeten worden. Alleen geselecteerde teams worden geïmporteerd
                  naar de database.
                </FieldDescription>
                <AssistTeamSelection
                  teams={memberTeams}
                  selectedTeamIds={field.value}
                  onTeamSelectionChange={handleTeamSelectionChange}
                />
                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
              </Field>
            )}
          />

          <Button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Bezig met opslaan..." : "Opslaan"}
          </Button>
        </form>

        {/* <Button onClick={handleSyncTeams} disabled={syncingTeams || selectedTeams.length === 0} variant="secondary">
          {syncingTeams ? "Bezig met synchroniseren..." : "Synchroniseer teams"}
        </Button>
        {selectedTeams.length === 0 && (
          <p className="mt-2 text-sm text-muted-foreground">Selecteer minstens één team om te synchroniseren.</p>
        )} */}
      </CardContent>
    </Card>
  );
}
