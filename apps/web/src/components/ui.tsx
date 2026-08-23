import { useId } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  offLabel?: string;
  format?: (v: number) => string;
  onChange: (v: number) => void;
}

export function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  offLabel,
  format,
  onChange,
}: SliderProps) {
  const id = useId();
  const display = value === min && offLabel ? offLabel : format ? format(value) : String(value);
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-medium text-neutral-600">
          {label}
        </label>
        <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-700 ring-1 ring-neutral-200">
          {display}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

interface SegmentedProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

export function Segmented<T extends string>({ options, value, onChange }: SegmentedProps<T>) {
  return (
    <div className="flex rounded-lg bg-neutral-100 p-0.5 ring-1 ring-neutral-200">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
            value === opt.value
              ? "bg-indigo-600 text-white shadow-sm"
              : "text-neutral-500 hover:text-neutral-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between text-xs font-medium text-neutral-600">
      {label}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-3.5 accent-indigo-600"
      />
    </label>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[11px] font-semibold tracking-wider text-neutral-400 uppercase">
      {children}
    </h3>
  );
}
