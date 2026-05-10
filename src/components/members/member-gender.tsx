import type { Gender } from "@/types/members";

const GENDER_LABEL: Record<Gender, string> = {
  M: "Man",
  F: "Vrouw",
  X: "Overig",
};

export function MemberGender({ gender }: { gender: Gender }) {
  return GENDER_LABEL[gender];
}
