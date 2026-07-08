import { getCompanyJobApplicants } from "@/lib/companies";
import { ApplicantsFilter } from "@/components/company/ApplicantsFilter";
import { ApplicationStatusControl } from "@/components/company/ApplicationStatusControl";
import { Pagination } from "@/components/ui/pagination";

interface ApplicantsPageProps {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<{ keyword?: string; status?: string; page?: string }>;
}

export default async function JobApplicantsPage({ params, searchParams }: ApplicantsPageProps) {
  const { jobId } = await params;
  const sp = await searchParams;
  const data = await getCompanyJobApplicants(Number(jobId), sp);
  const basePath = `/company/jobs/${jobId}/applicants`;

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Applicants</h1>

      <div className="mt-6">
        <ApplicantsFilter basePath={basePath} defaultValues={{ keyword: sp.keyword, status: sp.status }} />
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {data.totalElements} {data.totalElements === 1 ? "applicant" : "applicants"}
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {data.content.map((app) => (
          <div key={app.applicationId} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">
                  {app.applicantUsername}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{app.applicantEmail}</p>
              </div>
              <ApplicationStatusControl applicationId={app.applicationId} status={app.status} />
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
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
        ))}
        {data.content.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No applicants match your search.</p>
        )}
      </div>

      <div className="mt-6">
        <Pagination basePath={basePath} searchParams={sp} pageNumber={data.pageNumber} totalPages={data.totalPages} />
      </div>
    </div>
  );
}