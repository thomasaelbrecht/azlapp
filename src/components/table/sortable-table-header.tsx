import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { Button } from "@/components/ui/button";

interface SortableHeaderProps {
  column: string;
  label: string;
}

const sortableHeaderSearchParams = {
  sort: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(0),
};

export function SortableHeader({ column, label }: SortableHeaderProps) {
  const [{ sort: currentSort }, setParams] = useQueryStates(sortableHeaderSearchParams, { shallow: false });

  const [currentSortColumn, sortDirection] = currentSort.split(":");
  const isActive = currentSortColumn === column;
  const isAsc = isActive && sortDirection?.toUpperCase() === "ASC";
  const isDesc = isActive && sortDirection?.toUpperCase() === "DESC";

  const handleSort = () => {
    if (!isActive) return;

    const newDir = isAsc ? "DESC" : "ASC";
    setParams({ sort: `${currentSortColumn}:${newDir}`, page: 0 });
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
