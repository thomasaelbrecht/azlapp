import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const memberSearchParams = {
  search: parseAsString.withDefault(""),
  gender: parseAsString.withDefault(""),
  groupId: parseAsString.withDefault(""),
  birthYearFrom: parseAsInteger,
  birthYearTo: parseAsInteger,
  sort: parseAsString.withDefault("lastName:ASC"),
  page: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(25),
};

export const loadSearchParams = createLoader(memberSearchParams);
