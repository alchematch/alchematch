import { educationLevelLabels, EducationLevel } from "@/lib/types/candidateProfile";
import { DegreeFieldOption } from "@/lib/degreeFields";

const statuses = ["PENDING", "INTERVIEW", "HIRED", "REJECTED", "WITHDRAWN"];
const educationLevels: EducationLevel[] = ["HIGH_SCHOOL", "ASSOCIATE", "BACHELORS", "MASTERS", "DOCTORATE", "OTHER"];

interface CompanyApplicationsFilterProps {
  degreeFields: DegreeFieldOption[];
  defaultValues: {
    keyword?: string;
    status?: string;
    minYears?: string;
    degreeFieldId?: string;
    educationLevel?: string;
  };
}

export function CompanyApplicationsFilter({ degreeFields, defaultValues }: CompanyApplicationsFilterProps) {
  return (
    <form action="/company/applications" className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          name="keyword"
          defaultValue={defaultValues.keyword}
          placeholder="Search by applicant or job"
          className="h-10 flex-1 rounded-md border border-border bg-card px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
        />
        <select
          name="status"
          defaultValue={defaultValues.status ?? ""}
          className="h-10 w-full rounded-md border border-border bg-card px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass sm:w-44"
        >
          <option value="">Any status</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button
          type="submit"
          className="h-10 shrink-0 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Search
        </button>
      </div>

      <details className="group">
        <summary className="w-fit cursor-pointer text-sm text-brass hover:underline">
          More filters
        </summary>
        <div className="mt-3 flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:flex-wrap">
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Min years experience
            <input
              type="number"
              name="minYears"
              defaultValue={defaultValues.minYears}
              min="0"
              step="0.5"
              className="h-10 w-40 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Degree field
            <select
              name="degreeFieldId"
              defaultValue={defaultValues.degreeFieldId ?? ""}
              className="h-10 w-48 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            >
              <option value="">Any</option>
              {degreeFields.map((df) => (
                <option key={df.id} value={df.id}>{df.name}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-muted-foreground">
            Education level
            <select
              name="educationLevel"
              defaultValue={defaultValues.educationLevel ?? ""}
              className="h-10 w-48 rounded-md border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            >
              <option value="">Any</option>
              {educationLevels.map((level) => (
                <option key={level} value={level}>{educationLevelLabels[level]}</option>
              ))}
            </select>
          </label>
        </div>
      </details>
    </form>
  );
}