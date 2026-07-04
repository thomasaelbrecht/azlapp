export enum TrainingDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

export const trainingDayLabels: Record<TrainingDay, string> = {
  [TrainingDay.MONDAY]: "Maandag",
  [TrainingDay.TUESDAY]: "Dinsdag",
  [TrainingDay.WEDNESDAY]: "Woensdag",
  [TrainingDay.THURSDAY]: "Donderdag",
  [TrainingDay.FRIDAY]: "Vrijdag",
  [TrainingDay.SATURDAY]: "Zaterdag",
  [TrainingDay.SUNDAY]: "Zondag",
};
