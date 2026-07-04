import { createLoader, parseAsInteger, parseAsString } from "nuqs/server";

export const groupSearchParams = {
  search: parseAsString.withDefault(""),
  page: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(25),
};

export const loadGroupSearchParams = createLoader(groupSearchParams);
