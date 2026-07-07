import { FlaskIcon } from "@/components/icons/FlaskIcon";

const principles = [
  {
    color: "text-brass",
    border: "border-brass",
    title: "Every application has a full history, not just a status",
    body: "Most job boards leave you shouting into a void — you apply, then wait. On AlcheMatch, every status change is recorded, so you always know where you stand. That kind of tracking is usually only for recruiters. Here, it's yours too.",
  },
  {
    color: "text-verdigris",
    border: "border-verdigris",
    title: "Eligibility is enforced, not just suggested",
    body: "When a role requires a specific field of study, that requirement is checked the moment you apply — not left for a recruiter to notice weeks later.",
  },
  {
    color: "text-cinnabar",
    border: "border-cinnabar",
    title: "Companies are reviewed before they can hire",
    body: "Every company on AlcheMatch is manually verified before they can post a single job. It's not an open free-for-all.",
  },
  {
    color: "text-brass",
    border: "border-brass",
    title: "Nothing quietly disappears",
    body: "Status changes are logged with who made them and when. The process stays accountable on both sides, not just visible when convenient.",
  },
];

export default function FormulaPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col justify-center px-6 py-10 sm:px-10 lg:px-16 xl:px-24">
      <div className="max-w-2xl">
        <FlaskIcon className="h-8 w-8 text-brass" />
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.2em] text-brass">
          Solve et Coagula
        </p>
        <h1 className="mt-2 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
          The formula behind AlcheMatch.
        </h1>
        <p className="mt-3 text-base text-muted-foreground">
          Most job boards are just a list. AlcheMatch is built around a
          structured process — one that treats hiring as something worth
          getting right, not just posting and hoping.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-6 lg:grid-cols-2">
        {principles.map((p) => (
          <div key={p.title} className={`border-l-2 ${p.border} pl-5`}>
            <h2 className={`font-heading text-base font-semibold ${p.color}`}>
              {p.title}
            </h2>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">{p.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}