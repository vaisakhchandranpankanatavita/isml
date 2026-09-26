import type {
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
  SelectHTMLAttributes,
} from 'react';

interface FieldWrapProps {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  required?: boolean;
}

export function Field({ label, hint, error, required, children }: FieldWrapProps) {
  return (
    <label className="block text-sm">
      <span className="mb-1 flex items-center justify-between">
        <span className="font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-school-red">*</span>}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-school-red">{error}</span>}
    </label>
  );
}

const inputCls =
  'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500';

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
};
export function TextInput({ label, hint, error, required, className, ...rest }: TextInputProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <input {...rest} required={required} className={`${inputCls} ${className ?? ''}`} />
    </Field>
  );
}

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  hint?: string;
  error?: string;
};
export function TextArea({ label, hint, error, required, className, ...rest }: TextAreaProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <textarea
        {...rest}
        required={required}
        className={`${inputCls} min-h-[120px] ${className ?? ''}`}
      />
    </Field>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  hint?: string;
  error?: string;
};
export function Select({
  label,
  hint,
  error,
  required,
  className,
  children,
  ...rest
}: SelectProps) {
  return (
    <Field label={label} hint={hint} error={error} required={required}>
      <select {...rest} required={required} className={`${inputCls} ${className ?? ''}`}>
        {children}
      </select>
    </Field>
  );
}
