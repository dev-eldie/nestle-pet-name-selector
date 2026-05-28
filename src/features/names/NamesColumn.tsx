import { useEffect, useRef } from 'react';
import type { PetName } from '@/types/domain';

interface Props {
  names: PetName[];
  previewId: string | null;
  onPreviewChange: (id: string) => void;
  onConfirm: (id: string) => void;
  arrowsSide?: 'left' | 'right';
}

const ITEM_HEIGHT = 92;
const VISIBLE_HEIGHT = 552;
const VERTICAL_PADDING = VISIBLE_HEIGHT / 2 - ITEM_HEIGHT / 2;

export function NamesColumn({ names, previewId, onPreviewChange, onConfirm, arrowsSide = 'right' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<string, HTMLLIElement | null>>(new Map());
  const settleTimer = useRef<number | undefined>(undefined);
  const programmaticScroll = useRef(false);

  const previewIndex = previewId ? names.findIndex((n) => n.id === previewId) : -1;

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !previewId) return;
    const el = itemRefs.current.get(previewId);
    if (!el) return;
    const target = el.offsetTop + el.clientHeight / 2 - container.clientHeight / 2;
    if (Math.abs(container.scrollTop - target) < 2) return;
    programmaticScroll.current = true;
    container.scrollTo({ top: target, behavior: 'smooth' });
    window.setTimeout(() => {
      programmaticScroll.current = false;
    }, 400);
  }, [previewId, names]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function onScroll() {
      if (programmaticScroll.current) return;
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
      settleTimer.current = window.setTimeout(() => {
        if (!container) return;
        const center = container.scrollTop + container.clientHeight / 2;
        let nearestId: string | null = null;
        let minDist = Infinity;
        itemRefs.current.forEach((el, id) => {
          if (!el) return;
          const itemCenter = el.offsetTop + el.clientHeight / 2;
          const d = Math.abs(itemCenter - center);
          if (d < minDist) {
            minDist = d;
            nearestId = id;
          }
        });
        if (nearestId && nearestId !== previewId) {
          onPreviewChange(nearestId);
        }
      }, 90);
    }
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [previewId, onPreviewChange, names]);

  function advance(direction: 'prev' | 'next') {
    if (names.length === 0) return;
    const idx = previewIndex < 0 ? 0 : previewIndex;
    const nextIdx =
      direction === 'next'
        ? Math.min(idx + 1, names.length - 1)
        : Math.max(idx - 1, 0);
    onPreviewChange(names[nextIdx].id);
  }

  function handleItemClick(id: string) {
    if (id === previewId) {
      onConfirm(id);
    } else {
      onPreviewChange(id);
    }
  }

  if (names.length === 0) {
    return (
      <div className="flex w-full items-center justify-center text-center text-ink-mid" style={{ height: VISIBLE_HEIGHT }}>
        <p className="font-slab text-[20px]">No names match your filters.</p>
      </div>
    );
  }

  const arrowsBlock = (
    <div className="flex flex-col items-center justify-between py-3" style={{ height: VISIBLE_HEIGHT }}>
      <button
        type="button"
        onClick={() => advance('prev')}
        aria-label="Previous name"
        disabled={previewIndex <= 0}
        className="rounded-full p-1 transition-opacity hover:bg-red-brand/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <img src="/img/arrow-up.png" alt="" aria-hidden="true" className="h-10 w-10 object-contain md:h-12 md:w-12" />
      </button>
      <button
        type="button"
        onClick={() => advance('next')}
        aria-label="Next name"
        disabled={previewIndex >= names.length - 1}
        className="rounded-full p-1 transition-opacity hover:bg-red-brand/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <img src="/img/arrow-down.png" alt="" aria-hidden="true" className="h-10 w-10 object-contain md:h-12 md:w-12" />
      </button>
    </div>
  );

  return (
    <div className="flex w-full items-stretch justify-center gap-1.5">
      {arrowsSide === 'left' && arrowsBlock}
      <div
        ref={containerRef}
        role="listbox"
        aria-label="Pet names"
        className="relative w-full max-w-[520px] overflow-y-auto overflow-x-hidden"
        style={{
          height: VISIBLE_HEIGHT,
          scrollbarWidth: 'none',
          scrollSnapType: 'y mandatory',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)',
        }}
      >
        <ul
          className="flex flex-col items-stretch"
          style={{ paddingTop: VERTICAL_PADDING, paddingBottom: VERTICAL_PADDING }}
        >
          {names.map((n, i) => {
            const distance = previewIndex < 0 ? i : Math.abs(i - previewIndex);
            const isCenter = n.id === previewId;
            const opacity = isCenter ? 1 : Math.max(0.18, 1 - distance * 0.32);
            const scale = isCenter ? 1 : Math.max(0.7, 1 - distance * 0.1);
            return (
              <li
                key={n.id}
                ref={(el) => {
                  itemRefs.current.set(n.id, el);
                }}
                className="flex w-full items-center justify-center"
                style={{ height: ITEM_HEIGHT, scrollSnapAlign: 'center', scrollSnapStop: 'always' }}
              >
                <button
                  type="button"
                  role="option"
                  aria-selected={isCenter}
                  onClick={() => handleItemClick(n.id)}
                  className={[
                    'block w-full whitespace-nowrap text-center font-slab leading-none transition-[opacity,transform,color,font-size] duration-300 ease-out',
                    isCenter
                      ? 'font-normal text-red-brand'
                      : 'font-light text-ink hover:opacity-90',
                  ].join(' ')}
                  style={{
                    fontSize: isCenter ? 80 : 60,
                    opacity,
                    transform: `scale(${scale})`,
                    transformOrigin: 'center',
                  }}
                >
                  {n.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {arrowsSide === 'right' && arrowsBlock}
    </div>
  );
}
