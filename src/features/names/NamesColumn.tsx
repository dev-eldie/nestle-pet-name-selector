import { forwardRef, useEffect, useRef } from 'react';
import { FixedSizeList, type ListChildComponentProps } from 'react-window';
import type { PetName } from '@/types/domain';

interface Props {
  names: PetName[];
  previewId: string | null;
  onPreviewChange: (id: string) => void;
  onConfirm: (id: string) => void;
  arrowsSide?: 'left' | 'right';
}

interface ItemData {
  names: PetName[];
  previewIndex: number;
  previewId: string | null;
  onItemClick: (id: string) => void;
}

const ITEM_HEIGHT = 92;
const VISIBLE_HEIGHT = 552;
const VERTICAL_PADDING = VISIBLE_HEIGHT / 2 - ITEM_HEIGHT / 2;
const MASK_GRADIENT =
  'linear-gradient(to bottom, transparent 0%, black 18%, black 82%, transparent 100%)';

const OuterElement = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function OuterElement({ style, ...rest }, ref) {
    return (
      <div
        ref={ref}
        role="listbox"
        aria-label="Pet names"
        {...rest}
        style={{
          ...style,
          scrollbarWidth: 'none',
          scrollSnapType: 'y mandatory',
          maskImage: MASK_GRADIENT,
          WebkitMaskImage: MASK_GRADIENT,
        }}
      />
    );
  },
);

const InnerElement = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function InnerElement({ style, ...rest }, ref) {
    const baseHeight = parseFloat(String((style as React.CSSProperties)?.height ?? '0'));
    return (
      <div
        ref={ref}
        {...rest}
        style={{
          ...style,
          height: `${baseHeight + VERTICAL_PADDING * 2}px`,
        }}
      />
    );
  },
);

function Row({ index, style, data }: ListChildComponentProps<ItemData>) {
  const { names, previewIndex, previewId, onItemClick } = data;
  const n = names[index];
  const distance = previewIndex < 0 ? index : Math.abs(index - previewIndex);
  const isCenter = n.id === previewId;
  const opacity = isCenter ? 1 : Math.max(0.18, 1 - distance * 0.32);
  const scale = isCenter ? 1 : Math.max(0.7, 1 - distance * 0.1);
  const top = parseFloat(String(style.top ?? '0')) + VERTICAL_PADDING;
  return (
    <div
      style={{
        ...style,
        top,
        scrollSnapAlign: 'center',
        scrollSnapStop: 'always',
      }}
      className="flex w-full items-center justify-center"
    >
      <button
        type="button"
        role="option"
        aria-selected={isCenter}
        onClick={() => onItemClick(n.id)}
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
    </div>
  );
}

export function NamesColumn({
  names,
  previewId,
  onPreviewChange,
  onConfirm,
  arrowsSide = 'right',
}: Props) {
  const listRef = useRef<FixedSizeList>(null);
  const settleTimer = useRef<number | undefined>(undefined);
  const programmaticScroll = useRef(false);

  const previewIndex = previewId ? names.findIndex((n) => n.id === previewId) : -1;

  useEffect(() => {
    if (!listRef.current || previewIndex < 0) return;
    programmaticScroll.current = true;
    listRef.current.scrollTo(previewIndex * ITEM_HEIGHT);
    const timer = window.setTimeout(() => {
      programmaticScroll.current = false;
    }, 400);
    return () => window.clearTimeout(timer);
  }, [previewIndex]);

  useEffect(() => {
    return () => {
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, []);

  function handleScroll({
    scrollOffset,
    scrollUpdateWasRequested,
  }: {
    scrollOffset: number;
    scrollUpdateWasRequested: boolean;
  }) {
    if (scrollUpdateWasRequested || programmaticScroll.current) return;
    if (settleTimer.current) window.clearTimeout(settleTimer.current);
    settleTimer.current = window.setTimeout(() => {
      const nearestIndex = Math.max(
        0,
        Math.min(names.length - 1, Math.round(scrollOffset / ITEM_HEIGHT)),
      );
      const nearestId = names[nearestIndex]?.id;
      if (nearestId && nearestId !== previewId) {
        onPreviewChange(nearestId);
      }
    }, 90);
  }

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
      <div
        className="flex w-full items-center justify-center text-center text-ink-mid"
        style={{ height: VISIBLE_HEIGHT }}
      >
        <p className="font-slab text-[20px]">No names match your filters.</p>
      </div>
    );
  }

  const arrowsBlock = (
    <div
      className="flex flex-col items-center justify-between py-3"
      style={{ height: VISIBLE_HEIGHT }}
    >
      <button
        type="button"
        onClick={() => advance('prev')}
        aria-label="Previous name"
        disabled={previewIndex <= 0}
        className="rounded-full p-1 transition-opacity hover:bg-red-brand/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <img
          src="/img/arrow-up.png"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-contain md:h-12 md:w-12"
        />
      </button>
      <button
        type="button"
        onClick={() => advance('next')}
        aria-label="Next name"
        disabled={previewIndex >= names.length - 1}
        className="rounded-full p-1 transition-opacity hover:bg-red-brand/10 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <img
          src="/img/arrow-down.png"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 object-contain md:h-12 md:w-12"
        />
      </button>
    </div>
  );

  return (
    <div className="flex w-full items-stretch justify-center gap-1.5">
      {arrowsSide === 'left' && arrowsBlock}
      <div className="w-full max-w-[520px]">
        <FixedSizeList
          ref={listRef}
          height={VISIBLE_HEIGHT}
          width="100%"
          itemCount={names.length}
          itemSize={ITEM_HEIGHT}
          itemData={{ names, previewIndex, previewId, onItemClick: handleItemClick }}
          outerElementType={OuterElement}
          innerElementType={InnerElement}
          onScroll={handleScroll}
          overscanCount={4}
        >
          {Row}
        </FixedSizeList>
      </div>
      {arrowsSide === 'right' && arrowsBlock}
    </div>
  );
}
