'use client';

import { useTransition, useState } from 'react';
import { Loader2 } from 'lucide-react';
import SaveModal from './SaveModal';

type AdminFormProps = {
  action: (fd: FormData) => Promise<void>;
  children: React.ReactNode;
  className?: string;
  submitLabel?: string;
  successMessage?: string;
};

export default function AdminForm({
  action,
  children,
  className,
  submitLabel = 'Save Changes',
  successMessage = 'Your changes have been saved.',
}: AdminFormProps) {
  const [isPending, startTransition] = useTransition();
  const [modal, setModal] = useState<{ success: boolean; message: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        await action(fd);
        setModal({ success: true, message: successMessage });
      } catch (err) {
        setModal({
          success: false,
          message:
            err instanceof Error
              ? err.message
              : 'Something went wrong. Please try again.',
        });
      }
    });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={className}>
        {children}
        <button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {isPending ? 'Saving…' : submitLabel}
        </button>
      </form>
      {modal && (
        <SaveModal
          success={modal.success}
          message={modal.message}
          onClose={() => setModal(null)}
        />
      )}
    </>
  );
}
