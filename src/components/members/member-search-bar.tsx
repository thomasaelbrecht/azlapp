"use client";

import { FilterIcon, SearchIcon, XIcon } from "lucide-react";
import { useQueryStates } from "nuqs";
import { memberSearchParams } from "@/app/members/search-params";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Gender } from "@/types/members";

interface MemberSearchBarProps {
  groups: { id: string; name: string }[];
}

export function MemberSearchBar({ groups }: MemberSearchBarProps) {
  const [params, setParams] = useQueryStates(memberSearchParams, { shallow: false });

  const activeFilterCount = [params.gender, params.groupId, params.birthYearFrom, params.birthYearTo].filter(
    v => v !== null && v !== "",
  ).length;

  const clearFilters = () => setParams({ gender: "", groupId: "", birthYearFrom: null, birthYearTo: null, page: 1 });

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Zoeken op naam..."
          value={params.search}
          className="pl-8"
          onChange={e => setParams({ search: e.target.value, page: 1 })}
        />
      </div>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="relative gap-2 shrink-0">
            <FilterIcon className="size-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Filters</p>
            {activeFilterCount > 0 && (
              <PopoverClose asChild>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-muted-foreground" onClick={clearFilters}>
                  <XIcon className="size-3" />
                  Wissen
                </Button>
              </PopoverClose>
            )}
          </div>

          <Separator className="mb-4" />

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Geslacht</Label>
              <Select
                value={params.gender}
                onValueChange={val => setParams({ gender: val === "all" ? "" : val, page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle geslachten" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle geslachten</SelectItem>
                  <SelectItem value={Gender.M}>Man</SelectItem>
                  <SelectItem value={Gender.F}>Vrouw</SelectItem>
                  <SelectItem value={Gender.X}>Overig</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Groep</Label>
              <Select
                value={params.groupId}
                onValueChange={val => setParams({ groupId: val === "all" ? "" : val, page: 1 })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Alle groepen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle groepen</SelectItem>
                  {groups.map(g => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Geboortejaar</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Van"
                  value={params.birthYearFrom ?? ""}
                  className="h-9"
                  onChange={e => setParams({ birthYearFrom: e.target.value ? Number(e.target.value) : null, page: 1 })}
                />
                <span className="text-muted-foreground text-sm shrink-0">-</span>
                <Input
                  type="number"
                  placeholder="Tot"
                  value={params.birthYearTo ?? ""}
                  className="h-9"
                  onChange={e => setParams({ birthYearTo: e.target.value ? Number(e.target.value) : null, page: 1 })}
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
