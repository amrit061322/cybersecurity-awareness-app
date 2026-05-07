const UploadDetector = ({ file, onFileChange }) => {
  return (
    <div className="space-y-3">
      <label className="text-on-surface text-sm">Upload a screenshot (JPG, PNG, WEBP)</label>
      <input
        type="file"
        accept="image/*"
        className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2 w-full text-on-surface"
        onChange={(event) => onFileChange(event.target.files?.[0] || null)}
      />
      {file && (
        <div className="flex items-center justify-between bg-surface-container-low/60 border border-outline-variant/30 rounded-xl px-3 py-2">
          <p className="text-on-surface text-sm">{file.name}</p>
          <button
            type="button"
            className="text-red-400 text-xs"
            onClick={() => onFileChange(null)}
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadDetector;

