"use client";

import { useAction } from "next-safe-action/hooks";
import { toast } from "sonner";
import { memberSyncAction } from "@/app/actions/assist";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AssistMemberSync({ hasInitialSettings }: { hasInitialSettings: boolean }) {
  const { executeAsync, isExecuting: isSyncingMembers } = useAction(memberSyncAction);

  const handleSyncMembers = async () => {
    const { data, serverError } = await executeAsync();

    if (serverError) {
      toast.error(serverError);
      return;
    }

    if (data?.success) {
      toast.success("Ledensynchronisatie voltooid");
    } else {
      toast.error(data?.error || "Ledensynchronisatie mislukt");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Synchronisatie van leden</CardTitle>
        <CardDescription>
          Trigger een manuele synchronisatie van alle leden vanuit Assist. Dit zal alle leden uit het geselecteerde
          werkjaar importeren en bijwerken in de AZL app.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button onClick={handleSyncMembers} disabled={isSyncingMembers || !hasInitialSettings} variant="secondary">
          {isSyncingMembers ? "Bezig met synchroniseren..." : "Synchroniseer leden"}
        </Button>
        {!hasInitialSettings && (
          <p className="mt-2 text-sm text-destructive">Gelieve eerst een werkjaar in te stellen voor synchronisatie.</p>
        )}
      </CardContent>
    </Card>
  );
}
