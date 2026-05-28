interface Props {
  letters: string[];
  value: string | null;
  onChange: (letter: string | null) => void;
}

export function LetterStrip({ letters, value, onChange }: Props) {
  return (
    <div className="bg-cream px-6 py-6 md:px-[165px]">
      <div
        role="group"
        aria-label="Filter by starting letter"
        className="mx-auto flex flex-wrap items-center justify-center gap-[3px] rounded-[100px] bg-white p-4 shadow-pill"
      >
        {letters.map((l) => {
          const active = value === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => onChange(active ? null : l)}
              aria-pressed={active}
              aria-label={`Filter by ${l}`}
              className={[
                'flex h-[37px] w-[37px] items-center justify-center font-slab text-[25px] leading-[35px] transition-colors',
                active
                  ? 'rounded-full bg-red-brand text-white'
                  : 'text-ink hover:text-red-brand',
              ].join(' ')}
            >
              {l}
            </button>
          );
        })}
      </div>
    </div>
  );
}
