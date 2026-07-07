import { getCandidateProfile } from "@/lib/candidateProfile";
import { getActiveDegreeFields } from "@/lib/degreeFields";
import { ProfileCompletionChecklist } from "@/components/profile/ProfileCompletionChecklist";
import { CandidateProfileForm } from "@/components/profile/CandidateProfileForm";
import { ResumeForm } from "@/components/profile/ResumeForm";

export default async function CandidateProfilePage() {
  const [profile, degreeFields] = await Promise.all([
    getCandidateProfile(),
    getActiveDegreeFields(),
  ]);

  if (!profile) {
    return <p className="text-sm text-muted-foreground">Unable to load your profile.</p>;
  }

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Candidate profile</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        This information is used to check your eligibility when you apply to jobs.
      </p>

      <div className="mt-8 flex flex-col gap-6">
        <ProfileCompletionChecklist profile={profile} />

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Resume</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste a link to your resume. Direct file upload is coming soon.
          </p>
          <div className="mt-4 max-w-md">
            <ResumeForm currentResumeUrl={profile.resumeUrl} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="font-heading text-lg font-semibold text-foreground">Details</h2>
          <div className="mt-4 max-w-md">
            <CandidateProfileForm
              degreeFields={degreeFields}
              defaultValues={{
                educationLevel: profile.educationLevel ?? undefined,
                degreeFieldId: profile.degreeField?.id,
                yearsExperience: profile.yearsExperience ?? undefined,
                phone: profile.phone ?? undefined,
                location: profile.location ?? undefined,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}