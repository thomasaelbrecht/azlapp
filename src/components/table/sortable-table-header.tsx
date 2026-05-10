import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { memberSearchParams } from "@/app/members/search-params";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  column: string;
  label: string;
}

export function SortableHeader({ column, label }: SortableHeaderProps) {
  const [{ sort: currentSort }, setParams] = useQueryStates(memberSearchParams, { shallow: false });

  const [currentSortColumn, sortDirection] = currentSort.split(":");
  const isActive = currentSortColumn === column;
  const isAsc = isActive && sortDirection?.toUpperCase() === "ASC";
  const isDesc = isActive && sortDirection?.toUpperCase() === "DESC";

  const handleSort = () => {
    if (!isActive) return;

    const newDir = isAsc ? "DESC" : "ASC";
    setParams({ sort: `${currentSortColumn}:${newDir}`, page: 1 });
  };

  return (
    <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 font-medium text-foreground" onClick={handleSort}>
      {label}
      {isAsc && <ArrowUpIcon className="size-3.5" />}
      {isDesc && <ArrowDownIcon className="size-3.5" />}
      {!isActive && <ChevronsUpDownIcon className="size-3.5 opacity-50" />}
    </Button>
  );
}
