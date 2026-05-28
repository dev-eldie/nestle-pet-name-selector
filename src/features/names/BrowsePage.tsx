import { useEffect, useMemo } from 'react';
import { useCategoriesQuery, useLettersQuery, useNamesQuery } from './queries';
import { useFilterStore } from '@/features/filters/filterStore';
import { filterNames } from '@/features/filters/filterNames';
import { GenderToggle } from '@/features/filters/GenderToggle';
import { LetterStrip } from '@/features/filters/LetterStrip';
import { FiltersBar } from '@/features/filters/FiltersBar';
import { NamesColumn } from './NamesColumn';
import { NameDetail } from './NameDetail';
import { HeroEmpty } from '@/components/HeroEmpty';
import { BrowsingSideDog } from '@/components/BrowsingSideDog';
import { Skeleton } from '@/components/Skeleton';

export function BrowsePage() {
  const namesQ = useNamesQuery();
  const catsQ = useCategoriesQuery();
  const lettersQ = useLettersQuery();

  const {
    gender,
    setGender,
    categoryIds,
    toggleCategory,
    letter,
    setLetter,
    openGroupKey,
    toggleGroup,
    closeGroup,
    previewCenterId,
    setPreviewCenter,
    confirmedNameId,
    confirmName,
  } = useFilterStore();

  const filtered = useMemo(() => {
    if (!namesQ.data) return [];
    return filterNames({ names: namesQ.data, gender, categoryIds, letter });
  }, [namesQ.data, gender, categoryIds, letter]);

  const confirmedName = useMemo(() => {
    if (!namesQ.data || !confirmedNameId) return null;
    return namesQ.data.find((n) => n.id === confirmedNameId) ?? null;
  }, [namesQ.data, confirmedNameId]);

  useEffect(() => {
    if (filtered.length === 0) return;
    if (!previewCenterId || !filtered.some((n) => n.id === previewCenterId)) {
      setPreviewCenter(filtered[0].id);
    }
  }, [filtered, previewCenterId, setPreviewCenter]);

  const loading = namesQ.isPending || catsQ.isPending || lettersQ.isPending;
  const hasInteracted = gender !== null || categoryIds.length > 0 || letter !== null;

  function renderContent() {
    if (loading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-96 w-full" />
        </div>
      );
    }

    if (!hasInteracted || filtered.length === 0) {
      return (
        <div className="min-h-[600px]">
          <HeroEmpty />
        </div>
      );
    }

    if (confirmedName && catsQ.data && namesQ.data) {
      return (
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-[60px]">
          <NamesColumn
            names={filtered}
            previewId={previewCenterId}
            onPreviewChange={setPreviewCenter}
            onConfirm={confirmName}
            arrowsSide="left"
          />
          <NameDetail name={confirmedName} allNames={namesQ.data} categories={catsQ.data} />
        </div>
      );
    }

    return (
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[60px]">
        <BrowsingSideDog />
        <NamesColumn
          names={filtered}
          previewId={previewCenterId}
          onPreviewChange={setPreviewCenter}
          onConfirm={confirmName}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <GenderToggle value={gender} onChange={setGender} />

      {catsQ.data && (
        <FiltersBar
          categories={catsQ.data}
          selectedIds={categoryIds}
          openGroupKey={openGroupKey}
          onToggleGroup={toggleGroup}
          onCloseGroup={closeGroup}
          onToggleCategory={toggleCategory}
        />
      )}

      <div className="bg-cream px-6 pt-12 pb-6 md:px-[165px]">
        <h1 className="font-slab text-[30px] leading-[36px] text-ink">All pets names</h1>
      </div>

      {lettersQ.data && <LetterStrip letters={lettersQ.data} value={letter} onChange={setLetter} />}

      <div className="flex-1 bg-cream px-6 py-12 md:px-[165px] md:py-20">{renderContent()}</div>
    </div>
  );
}
