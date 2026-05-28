import type { GenderFilter } from '@/types/domain';

const OPTIONS: { value: GenderFilter; label: string }[] = [
  { value: 'M', label: 'Male' },
  { value: 'F', label: 'Female' },
  { value: 'BOTH', label: 'Both' },
];

interface Props {
  value: GenderFilter | null;
  onChange: (next: GenderFilter) => void;
}

export function GenderToggle({ value, onChange }: Props) {
  return (
    <section
      aria-labelledby="gender-heading"
      className="bg-cream px-6 py-10 md:px-[165px]"
    >
      <h2
        id="gender-heading"
        className="text-center font-slab text-[25px] leading-[35px] text-ink"
      >
        Choose your pet´s gender
      </h2>
      <div role="radiogroup" aria-label="Pet gender" className="mt-6 flex justify-center gap-4">
        {OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={[
                'rounded-[4px] border border-red-brand px-4 py-[10px] font-slab text-[16px] leading-6 transition-colors',
                active
                  ? 'bg-red-brand text-white'
                  : 'bg-transparent text-red-brand hover:bg-red-brand/5',
              ].join(' ')}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
