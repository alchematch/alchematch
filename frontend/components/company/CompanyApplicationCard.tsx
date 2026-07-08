import { CompanyJobApplicationRowResponse } from "@/lib/types/company";
import { ApplicationStatusControl } from "@/components/company/ApplicationStatusControl";

export function CompanyApplicationCard({ app }: { app: CompanyJobApplicationRowResponse }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-heading text-base font-semibold text-foreground">
            {app.applicantUsername}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {app.jobTitle} · {app.applicantEmail}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Applied {new Date(app.appliedAt).toLocaleDateString()}
          </p>
        </div>
        <ApplicationStatusControl applicationId={app.applicationId} status={app.status} />
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
        {app.educationLevel && (
          <div>
            <dt className="text-muted-foreground">Education</dt>
            <dd className="text-foreground">{app.educationLevel}</dd>
          </div>
        )}
        {app.degreeFieldName && (
          <div>
            <dt className="text-muted-foreground">Degree field</dt>
            <dd className="text-foreground">{app.degreeFieldName}</dd>
          </div>
        )}
        {app.yearsExperience != null && (
          <div>
            <dt className="text-muted-foreground">Experience</dt>
            <dd className="text-foreground">{app.yearsExperience} yrs</dd>
          </div>
        )}
        {app.location && (
          <div>
            <dt className="text-muted-foreground">Location</dt>
            <dd className="text-foreground">{app.location}</dd>
          </div>
        )}
      </dl>

      {app.resumeUrl && (
        <a
          href={app.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-brass hover:underline"
        >
          View resume
        </a>
      )}
    </div>
  );
}