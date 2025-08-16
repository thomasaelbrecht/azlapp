import { SlidersHorizontalIcon } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <SlidersHorizontalIcon className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Instellingen</h1>
      </div>
      <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 p-4">
        <p className="text-muted-foreground">This is a placeholder page for the Settings section.</p>
      </div>
    </div>
  );
}
