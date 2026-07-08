import Link from "next/link";
import { JobResponse, employmentTypeLabels } from "@/lib/types/job";
import { getCurrentUser } from "@/lib/auth";
import { ApplyButton } from "@/components/jobs/ApplyButton";
import { hasAppliedToJob } from "@/lib/jobs";
import { isJobSaved } from "@/lib/savedJobs";
import { SaveJobButton } from "@/components/jobs/SaveJobButton";

function formatPay(job: JobResponse) {
  if (!job.payMin && !job.payMax) return null;
  const period =
    job.payPeriod === "HOUR" ? "/hr" : job.payPeriod === "MONTH" ? "/mo" : job.payPeriod === "YEAR" ? "/yr" : "";
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (job.payMin && job.payMax) return `${fmt(job.payMin)}–${fmt(job.payMax)}${period}`;
  if (job.payMin) return `From ${fmt(job.payMin)}${period}`;
  return `Up to ${fmt(job.payMax!)}${period}`;
}

export async function JobDetailPane({ job }: { job: JobResponse | null }) {
  if (!job) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Select a job to see details
      </div>
    );
  }

  const user = await getCurrentUser();
  const alreadyApplied = user?.role === "ROLE_USER" ? await hasAppliedToJob(job.id) : false;
  const alreadySaved = user?.role === "ROLE_USER" ? await isJobSaved(job.id) : false;
  const pay = formatPay(job);

  return (
    <div className="p-8">
      <span className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground">
        {employmentTypeLabels[job.employmentType]}
      </span>

      <h1 className="mt-4 font-heading text-2xl font-semibold text-foreground">
        {job.title}
      </h1>
      <p className="mt-1 text-muted-foreground">
        {job.companyName} · {job.location}
      </p>

      {pay && <p className="mt-3 font-mono text-lg text-verdigris">{pay}</p>}

      <div className="mt-6">
        {!user && (
          <Link
            href="/login"
            className="inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Log in to apply
          </Link>
        )}
        {user && user.role === "ROLE_USER" && (
          <div className="flex items-center gap-3">
            <ApplyButton key={job.id} jobId={job.id} alreadyApplied={alreadyApplied} />
            <SaveJobButton key={`save-${job.id}`} jobId={job.id} alreadySaved={alreadySaved} />
          </div>
        )}
      </div>

      {job.tagline && <p className="mt-4 text-foreground">{job.tagline}</p>}

      <div className="mt-6 whitespace-pre-line text-sm text-foreground">
        {job.description}
      </div>

      {job.minimumRequirements.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Minimum requirements
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            {job.minimumRequirements.map((req, i) => (
              <li key={i}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {job.benefits.length > 0 && (
        <div className="mt-6">
          <h2 className="font-heading text-sm font-semibold text-foreground">
            Benefits
          </h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground">
            {job.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}