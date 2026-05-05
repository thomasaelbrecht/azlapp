import { useMemo } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { MemberTeam } from "@/types/api/assist";

interface AssistTeamSelectionProps {
  onTeamSelectionChange: (team: MemberTeam, checked: boolean) => void;
  selectedTeamIds?: number[];
  teams: MemberTeam[];
}

const flattenTeams = (teams: MemberTeam[]): MemberTeam[] => {
  return teams.flatMap(team => [team, ...flattenTeams(team.children)]);
};

export function AssistTeamSelection({ teams, selectedTeamIds = [], onTeamSelectionChange }: AssistTeamSelectionProps) {
  const allTeams = useMemo(() => flattenTeams(teams), [teams]);

  return allTeams.map(team => {
    const displayName = team.name.includes("/") ? team.name.split("/").pop()?.trim() || team.name : team.name;
    const indent = team.name.split("/").length - 1;

    return (
      <div key={team.id} className="flex items-center space-x-2" style={{ marginLeft: `${indent * 20}px` }}>
        <Checkbox
          id={`team-${team.id}`}
          checked={selectedTeamIds.includes(team.id)}
          onCheckedChange={checked => onTeamSelectionChange(team, checked === true)}
        />
        <label
          htmlFor={`team-${team.id}`}
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
        >
          {displayName}
        </label>
      </div>
    );
  });
}
