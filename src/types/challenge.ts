import { Coordinates } from "../utils/location";

// Brukerens fremgang på én utfordring.
// "not_started" lagres ikke: finnes det ingen fremgang, har brukeren ikke startet.
export type ChallengeStatus = "not_started" | "in_progress" | "completed";

export type ChallengeCategory = "landmark" | "photo" | "information";

export type ChallengeDifficulty = "easy" | "medium" | "hard";

// En utfordring. Den er felles for alle brukere.
// Feltene tilsvarer kravene i oppgaven: tittel, beskrivelse, spørsmål,
// målposisjon (latitude/longitude) og gyldig radius.
export interface Challenge {
  id: string;
  title: string;
  description: string;
  question: string;
  options: string[]; // svaralternativer som vises til brukeren
  correctAnswer: string; // ett av alternativene i options
  location: Coordinates; // målposisjonen brukeren må gå til
  radiusMeters: number; // hvor nærme brukeren må være for å godkjennes
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  points: number;
}