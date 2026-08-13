// v0.48 §6 — profile correction screen.
//
// Shown when a student profile carries a `grade` value we cannot
// resolve to a canonical class1..class12. We do NOT launch any
// Class 6 content in this case. We ask the student (or their
// teacher) to fix the profile.

import { Card } from '../../design/primitives/Card';
import { PageHeader } from '../../design/primitives/PageHeader';
import { PrimaryButton } from '../../design/primitives/PrimaryButton';
import { SecondaryButton } from '../../design/primitives/SecondaryButton';

export function ProfileCorrectionScreen({
  studentName,
  storedGrade,
  onOpenStartForm,
  onSwitchStudent,
}: {
  studentName: string;
  storedGrade: string;
  onOpenStartForm: () => void;
  onSwitchStudent: () => void;
}) {
  return (
    <div className="space-y-4">
      <PageHeader
        eyebrow="Profile check"
        title={`We need one detail, ${studentName}`}
      />
      <Card>
        <p className="text-sm text-slate-700">
          Your profile says class{' '}
          <span className="font-mono">"{storedGrade || '(empty)'}"</span>,
          which we do not recognise. To make sure you see the right
          chapters, choose a class from 1 to 12.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          If someone else uses this device, you can also switch to a
          different profile.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <PrimaryButton onClick={onOpenStartForm}>
            Fix my class
          </PrimaryButton>
          <SecondaryButton onClick={onSwitchStudent}>
            Switch profile
          </SecondaryButton>
        </div>
      </Card>
    </div>
  );
}
