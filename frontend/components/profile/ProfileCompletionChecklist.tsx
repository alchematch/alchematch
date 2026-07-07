import { CheckCircle2, Circle } from "lucide-react";
import { CandidateProfileResponse } from "@/lib/types/candidateProfile";

const requiredItems = [
  { key: "resumeUrl", label: "Resume" },
  { key: "educationLevel", label: "Education level" },
  { key: "degreeField", label: "Degree field" },
  { key: "yearsExperience", label: "Years of experience" },
] as const;

export function ProfileCompletionChecklist({ profile }: { profile: CandidateProfileResponse }) {
  return (
    <div className="rounded-lg border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">
          Profile completeness
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            profile.complete ? "bg-verdigris/10 text-verdigris" : "bg-cinnabar/10 text-cinnabar"
          }`}
        >
          {profile.complete ? "Complete" : "Incomplete"}
        </span>
      </div>
      {!profile.complete && (
        <p className="mt-2 text-sm text-muted-foreground">
          These fields are required before you can apply to jobs.
        </p>
      )}
      <ul className="mt-4 flex flex-col gap-2">
        {requiredItems.map((item) => {
          const filled = profile[item.key] != null;
          return (
            <li key={item.key} className="flex items-center gap-2 text-sm">
              {filled ? (
                <CheckCircle2 className="h-4 w-4 text-verdigris" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={filled ? "text-foreground" : "text-muted-foreground"}>
                {item.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}