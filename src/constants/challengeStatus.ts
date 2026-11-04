import { ChallengeCategory, ChallengeDifficulty, ChallengeStatus } from "../types/challenge";

// Farger og tekster samlet ett sted, så kartet, kortene og detaljskjermen
// alltid viser samme farge for samme status. Endrer du en farge her, endres den overalt.

export const STATUS_LABELS: Record<ChallengeStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

// main = markørfarge på kartet, light = bakgrunn på merkelapper
export const STATUS_COLORS: Record<ChallengeStatus, { main: string; light: string }> = {
  not_started: { main: "#2f5d50", light: "#e3ece9" },
  in_progress: { main: "#e8a33d", light: "#fcf0dc" },
  completed: { main: "#2e8b3d", light: "#e1f2e4" },
};

// Fargen på brukerens egen posisjon (samme blåfarge som iOS bruker)
export const USER_LOCATION_COLOR = "#2f7bf6";

export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  landmark: "Landmark",
  photo: "Photo",
  information: "Information",
};

export const DIFFICULTY_LABELS: Record<ChallengeDifficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};