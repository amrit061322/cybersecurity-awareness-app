import { useId } from 'react';

const ImageUploader = ({ file, onChange }) => {
  const inputId = useId();

  return (
    <div className="flex items-center gap-3">
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] || null)}
      />
      <label
        htmlFor={inputId}
        className="w-10 h-10 rounded-full border border-outline-variant/30 text-on-surface-variant flex items-center justify-center hover:text-primary-container hover:border-primary-container/40 transition-colors cursor-pointer"
        aria-label="Attach image"
      >
        <span className="material-symbols-outlined text-base">attach_file</span>
      </label>
      <span className="text-xs text-on-surface-variant">
        {file ? file.name : 'Attach image'}
      </span>
    </div>
  );
};

export default ImageUploader;
