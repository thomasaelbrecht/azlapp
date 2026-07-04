"use client";

import { SearchIcon } from "lucide-react";
import { debounce, parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { cn } from "@/lib/utils";
import { Input } from "./input";

interface SearchBarProps {
  className?: string;
}

const searchParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(0),
};

export function SearchBar({ className }: SearchBarProps) {
  const [params, setParams] = useQueryStates(searchParams, { shallow: false, limitUrlUpdates: debounce(400) });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParams({ search: e.target.value, page: 0 });
  };

  return (
    <div className={cn("relative flex-1", className)}>
      <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input placeholder="Zoeken op naam..." value={params.search} className="pl-8" onChange={handleSearchChange} />
    </div>
  );
}
