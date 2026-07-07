export type EducationLevel =
  | "HIGH_SCHOOL"
  | "ASSOCIATE"
  | "BACHELORS"
  | "MASTERS"
  | "DOCTORATE"
  | "OTHER";

export const educationLevelLabels: Record<EducationLevel, string> = {
  HIGH_SCHOOL: "High school",
  ASSOCIATE: "Associate degree",
  BACHELORS: "Bachelor's degree",
  MASTERS: "Master's degree",
  DOCTORATE: "Doctorate",
  OTHER: "Other",
};

export interface CandidateProfileResponse {
  userId: number;
  resumeUrl: string | null;
  educationLevel: EducationLevel | null;
  degreeField: { id: number; name: string } | null;
  yearsExperience: number | null;
  phone: string | null;
  location: string | null;
  complete: boolean;
}