import { useEffect, useRef } from 'react';
import { CATEGORY_GROUPS, resolveGroupCategoryIds } from '@/features/categories/categoryGroups';
import type { Category } from '@/types/domain';

interface Props {
  categories: Category[];
  selectedIds: string[];
  openGroupKey: string | null;
  onToggleGroup: (key: string) => void;
  onCloseGroup: () => void;
  onToggleCategory: (id: string) => void;
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      width="14"
      height="8"
      viewBox="0 0 14 8"
      className={['transition-transform duration-200', open ? 'rotate-180' : ''].join(' ')}
    >
      <path d="M1 1l6 6 6-6" stroke="#E81C24" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

function Checkbox({ checked }: { checked: boolean }) {
  return (
    <span
      className={[
        'inline-flex h-[14px] w-[14px] items-center justify-center rounded-[2px] border',
        checked ? 'border-red-brand bg-red-brand' : 'border-red-brand bg-white',
      ].join(' ')}
      aria-hidden="true"
    >
      {checked && (
        <svg viewBox="0 0 12 12" className="h-[10px] w-[10px]">
          <path d="M2 6l3 3 5-6" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
  );
}

export function FiltersBar({
  categories,
  selectedIds,
  openGroupKey,
  onToggleGroup,
  onCloseGroup,
  onToggleCategory,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const target = e.target as Node | null;
      if (!target || !ref.current) return;
      if (ref.current.contains(target)) return;
      onCloseGroup();
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onCloseGroup();
    }
    document.addEventListener('mousedown', handler, true);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', handler, true);
      document.removeEventListener('keydown', onEsc);
    };
  }, [onCloseGroup]);

  const openGroup = CATEGORY_GROUPS.find((g) => g.key === openGroupKey) ?? null;
  const openGroupCategories = openGroup ? resolveGroupCategoryIds(openGroup, categories) : [];

  return (
    <div ref={ref} className="bg-white shadow-bar">
      <div className="flex items-center overflow-x-auto border-y border-ink-light px-6 md:px-[165px]">
        <div className="shrink-0 pr-5 py-2">
          <span className="font-slab font-medium text-[16px] leading-6 text-ink">Filters:</span>
        </div>
        <div className="h-[66px] w-px shrink-0 bg-ink-light" aria-hidden="true" />
        <div className="flex shrink-0">
          {CATEGORY_GROUPS.map((g) => {
            const open = openGroupKey === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => onToggleGroup(g.key)}
                aria-expanded={open}
                aria-controls={`group-panel-${g.key}`}
                className={[
                  'flex items-center gap-2 whitespace-nowrap px-5 py-[21px] font-sans font-light text-[16px] leading-6 text-ink transition-colors',
                  open ? 'border-x border-t border-red-brand bg-white' : 'border-x border-t border-transparent',
                ].join(' ')}
              >
                <span>{g.label}</span>
                <Chevron open={open} />
              </button>
            );
          })}
        </div>
        <div className="h-[66px] w-px shrink-0 bg-ink-light" aria-hidden="true" />
      </div>

      {openGroup && (
        <div
          id={`group-panel-${openGroup.key}`}
          role="region"
          aria-label={`${openGroup.label} categories`}
          className="bg-white px-6 py-8 md:px-[165px]"
        >
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-4">
            {openGroupCategories.map((cat) => {
              const checked = selectedIds.includes(cat.id);
              return (
                <label
                  key={cat.id}
                  className="flex cursor-pointer items-center gap-[5px] font-sans font-light text-[16px] leading-6 text-ink"
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => onToggleCategory(cat.id)}
                  />
                  <Checkbox checked={checked} />
                  <span>{cat.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
