"use client";

type DeleteMenuButtonProps = {
  action: (formData: FormData) => Promise<void>;
  hiddenFieldName: string;
  hiddenFieldValue: string;
  confirmMessage: string;
};

export default function DeleteMenuButton({
  action,
  hiddenFieldName,
  hiddenFieldValue,
  confirmMessage,
}: DeleteMenuButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name={hiddenFieldName} value={hiddenFieldValue} />
      <button
        type="submit"
        className="rounded-[8px] border border-flame/30 bg-flame/[0.08] px-3 py-1.5 text-[12.5px] font-semibold text-flame transition-colors hover:bg-flame/[0.15]"
      >
        Delete
      </button>
    </form>
  );
}
