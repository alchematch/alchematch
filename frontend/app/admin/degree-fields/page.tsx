import { getAllDegreeFields } from "@/lib/adminDegreeFields";
import { CreateDegreeFieldForm } from "@/components/admin/CreateDegreeFieldForm";
import { DegreeFieldToggle } from "@/components/admin/DegreeFieldToggle";

export default async function AdminDegreeFieldsPage() {
  const degreeFields = await getAllDegreeFields();

  return (
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Degree fields</h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Only active fields appear as options for candidates and in job listings.
      </p>

      <div className="mt-8 rounded-lg border border-border bg-card p-6">
        <CreateDegreeFieldForm />
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {degreeFields.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No degree fields yet.</p>
        )}
        {degreeFields.map((df) => (
          <div
            key={df.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3"
          >
            <span className="text-sm text-foreground">{df.name}</span>
            <DegreeFieldToggle id={df.id} active={df.active} />
          </div>
        ))}
      </div>
    </div>
  );
}