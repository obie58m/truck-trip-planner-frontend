type TextFieldProps = {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  autoComplete?: string
  error?: string | null
}

export function TextField(props: TextFieldProps) {
  const invalid = Boolean(props.error)
  return (
    <div>
      <label htmlFor={props.id} className="text-xs font-medium text-slate-600">
        {props.label}
      </label>
      <input
        id={props.id}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
        placeholder={props.placeholder}
        inputMode={props.inputMode}
        autoComplete={props.autoComplete}
        aria-invalid={invalid}
        aria-describedby={invalid ? `${props.id}-err` : undefined}
        className={`mt-1 w-full rounded-lg border px-3 py-2 text-sm outline-none ring-indigo-500 transition-colors focus:ring-2 motion-safe:transition-shadow ${
          invalid ? 'border-rose-300 bg-rose-50/50' : 'border-slate-200'
        }`}
      />
      {props.error ? (
        <p id={`${props.id}-err`} className="mt-1 text-xs text-rose-700" role="alert">
          {props.error}
        </p>
      ) : null}
    </div>
  )
}
