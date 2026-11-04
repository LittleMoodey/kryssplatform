import { Challenge, ChallengeStatus } from "../types/challenge";

// MIDLERTIDIGE testdata, slik at kartet har noe å vise før Firebase er koblet til.
// Når Firebase er på plass, erstattes denne filen av en funksjon som henter
// utfordringene fra Firestore. Resten av appen trenger ikke endres, fordi
// den bare bruker getAllChallenges, getChallengeById og getChallengeStatus.

const SAMPLE_CHALLENGES: Challenge[] = [
  {
    id: "royal-palace",
    title: "Visit the Royal Palace",
    description:
      "Walk up to the Royal Palace at the end of Karl Johans gate. Take a photo of the statue in front of the palace.",
    question: "Whose statue stands on the square in front of the palace?",
    options: ["King Karl Johan", "King Haakon VII", "King Olav V", "Queen Maud"],
    correctAnswer: "King Karl Johan",
    location: { latitude: 59.9169, longitude: 10.7276 },
    radiusMeters: 75,
    category: "landmark",
    difficulty: "easy",
    points: 100,
  },
  {
    id: "opera-roof",
    title: "Walk on the Opera roof",
    description:
      "Go to the Oslo Opera House and walk up the sloping roof. Take a photo of the view over the fjord.",
    question: "What colour is the roof of the Opera House?",
    options: ["White", "Black", "Red", "Green"],
    correctAnswer: "White",
    location: { latitude: 59.9075, longitude: 10.7531 },
    radiusMeters: 100,
    category: "photo",
    difficulty: "easy",
    points: 100,
  },
  {
    id: "city-hall",
    title: "Find the City Hall",
    description:
      "The Nobel Peace Prize is awarded in Oslo City Hall. Find the building and take a photo of the front.",
    question: "What are the City Hall towers built of?",
    options: ["Red brick", "White marble", "Glass", "Wood"],
    correctAnswer: "Red brick",
    location: { latitude: 59.9119, longitude: 10.7336 },
    radiusMeters: 75,
    category: "landmark",
    difficulty: "medium",
    points: 150,
  },
  {
    id: "akershus-fortress",
    title: "Explore Akershus Fortress",
    description:
      "Find the information sign at the entrance of Akershus Fortress and read about its history.",
    question: "In which century was the fortress first built?",
    options: ["11th century", "13th century", "16th century", "18th century"],
    correctAnswer: "13th century",
    location: { latitude: 59.907, longitude: 10.736 },
    radiusMeters: 120,
    category: "information",
    difficulty: "medium",
    points: 150,
  },
  {
    id: "vigeland-monolith",
    title: "Find the Monolith",
    description:
      "Walk through the Vigeland Park to the Monolith at the top of the park. Take a photo of it.",
    question: "What is the Monolith carved from?",
    options: ["One block of granite", "Bronze", "Concrete", "Wood"],
    correctAnswer: "One block of granite",
    location: { latitude: 59.9271, longitude: 10.7008 },
    radiusMeters: 100,
    category: "landmark",
    difficulty: "hard",
    points: 200,
  },
];

// Testfremgang for den innloggede brukeren. Utfordringer som ikke står her, er "not_started".
// Med Firebase blir dette users/{uid}/progress/{challengeId} i Firestore.
const SAMPLE_PROGRESS: Record<string, ChallengeStatus> = {
  "royal-palace": "completed",
  "opera-roof": "in_progress",
};

export function getAllChallenges(): Challenge[] {
  return SAMPLE_CHALLENGES;
}

export function getChallengeById(id: string): Challenge | undefined {
  return SAMPLE_CHALLENGES.find((challenge) => challenge.id === id);
}

export function getChallengeStatus(challengeId: string): ChallengeStatus {
  return SAMPLE_PROGRESS[challengeId] ?? "not_started";
}