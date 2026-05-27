import { useId, type InputHTMLAttributes } from "react";

export function Input({
  className = "",
  label,
  error,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="mb-5">
      {label && (
        <label htmlFor={inputId} className="block text-[0.85rem] font-semibold text-fg-secondary mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        className={`w-full px-4 py-2.5 bg-bg-primary border border-border rounded-radius-md text-fg text-[0.95rem] outline-none transition-colors duration-150 placeholder:text-fg-muted focus:border-green focus:shadow-[0_0_0_3px_oklch(60%_0.18_145/0.15)] ${error ? "!border-red" : ""} ${className}`}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-[0.8rem] text-red mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
