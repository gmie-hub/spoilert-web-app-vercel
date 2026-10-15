const FileField = ({
  label,
  accept,
  file,
  onChange,
  hint,
}: {
  label: string;
  accept?: string;
  file: File | null;
  onChange: (file: File | null) => void;
  hint?: string;
}) => (
  <div className="flex flex-col gap-1">
    <span className="text-sm font-medium text-gray-700">{label}</span>
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-dashed border-gray-300 bg-[#FBFBFB] px-4 py-3 text-sm">
      <span className={`truncate ${file ? "text-[#212529]" : "text-gray-400"}`}>
        {file ? file.name : "Choose a file"}
      </span>
      <span className="shrink-0 font-medium text-[var(--color-blue)]">Browse</span>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
    </label>
    {hint && <p className="text-xs text-gray-500">{hint}</p>}
  </div>
);

export default FileField;
