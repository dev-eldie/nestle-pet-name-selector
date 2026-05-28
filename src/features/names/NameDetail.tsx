import { motion } from 'framer-motion';
import { sanitizeHtml } from '@/lib/sanitize';
import type { Category, PetName } from '@/types/domain';
import { findRelatedNames } from '@/features/filters/filterNames';

interface Props {
  name: PetName;
  allNames: PetName[];
  categories: Category[];
}

function GenderIcon({ gender }: { gender: PetName['gender'] }) {
  const isMale = gender.includes('M');
  const isFemale = gender.includes('F');
  if (isMale && isFemale) {
    return (
      <svg aria-hidden="true" viewBox="0 0 59 59" className="h-[59px] w-[59px]" fill="none">
        <circle cx="22" cy="29" r="13" stroke="#3A3533" strokeWidth="3" />
        <path d="M44 7l11 0M55 7l0 11M55 7L37 25" stroke="#3A3533" strokeWidth="3" strokeLinecap="round" />
        <path d="M22 42v12M16 50h12" stroke="#3A3533" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  if (isFemale) {
    return (
      <svg aria-hidden="true" viewBox="0 0 59 59" className="h-[59px] w-[59px]" fill="none">
        <circle cx="29.5" cy="22" r="14" stroke="#3A3533" strokeWidth="3" />
        <path d="M29.5 36v14M22 44h15" stroke="#3A3533" strokeWidth="3" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg aria-hidden="true" viewBox="0 0 59 59" className="h-[59px] w-[59px]" fill="none">
      <circle cx="22" cy="37" r="14" stroke="#3A3533" strokeWidth="3" />
      <path d="M37 22l16-16M40 6h13v13" stroke="#3A3533" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ShareIcons() {
  return (
    <div className="flex items-start gap-[6px]" aria-label="Share">
      {['link', 'twitter', 'messenger'].map((kind) => (
        <button
          key={kind}
          type="button"
          aria-label={`Share via ${kind}`}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-white hover:bg-ink"
        >
          <svg viewBox="0 0 16 16" className="h-3 w-3" fill="currentColor">
            {kind === 'link' && (
              <path d="M6 10l4-4m-3 7a3 3 0 11-4-4l2-2m3-3l2-2a3 3 0 114 4l-2 2" stroke="currentColor" strokeWidth="1.5" fill="none" />
            )}
            {kind === 'twitter' && (
              <path d="M14 4.5c-.5.2-1 .4-1.6.4.6-.3 1-.9 1.2-1.5-.5.3-1.2.6-1.8.7a2.8 2.8 0 00-4.9 2.6A8 8 0 011.5 3.7a3 3 0 00.9 3.9c-.5 0-.9-.1-1.3-.3 0 1.4 1 2.6 2.3 2.9-.4.1-.8.1-1.2 0 .3 1 1.3 1.8 2.5 1.8A5.7 5.7 0 010 13.2 8 8 0 0014.4 6V5.6c.5-.4 1-.9 1.3-1.5z" />
            )}
            {kind === 'messenger' && (
              <path d="M8 1C4 1 1 3.9 1 7.5c0 2 1 3.8 2.6 5V15l2.5-1.4c.6.2 1.2.3 1.9.3 4 0 7-2.9 7-6.4S12 1 8 1z" />
            )}
          </svg>
        </button>
      ))}
    </div>
  );
}

export function NameDetail({ name, allNames, categories }: Props) {
  const catMap = new Map(categories.map((c) => [c.id, c.name]));
  const categoryNames = name.categories.map((id) => catMap.get(id)).filter(Boolean) as string[];
  const related = findRelatedNames(name, allNames, 3);

  return (
    <motion.article
      key={name.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex h-full flex-col justify-center gap-8 px-6 py-8"
    >
      <header className="flex flex-col gap-6">
        <div className="flex items-center gap-8">
          <GenderIcon gender={name.gender} />
          <h2 className="font-sans text-[30px] leading-tight text-ink">
            {categoryNames[0] ?? name.title}
          </h2>
        </div>
        <div aria-hidden="true" className="h-px w-full bg-ink-light" />
      </header>

      <section className="flex flex-col gap-8">
        <h3 className="sr-only">About {name.title}</h3>
        <div
          className="font-sans text-[20px] font-light leading-[36px] text-ink md:text-[22px] md:leading-[44px] [&_p]:mb-3"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(name.definition) }}
        />
        <div aria-hidden="true" className="h-px w-full bg-ink-light" />
      </section>

      <footer className="flex items-end justify-between gap-4">
        <div className="flex flex-col text-[18px] md:text-[20px]">
          <span className="font-sans text-ink">Related name</span>
          <span className="font-sans font-light text-ink-mid">
            {related.length > 0 ? related.map((r) => r.title).join(' - ') : '-'}
          </span>
        </div>
        <ShareIcons />
      </footer>
    </motion.article>
  );
}
