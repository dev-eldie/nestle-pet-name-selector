export function HeroEmpty() {
  return (
    <div className="relative flex w-full items-end justify-center overflow-hidden" style={{ minHeight: 'clamp(560px, 80vh, 820px)' }}>
      <p
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 select-none text-center font-slab font-bold leading-[0.95] tracking-tight text-red-brand"
        style={{
          fontSize: 'clamp(90px, 19vw, 260px)',
          textShadow: '0 2px 12px rgba(58,53,51,0.1), 0 0 2px rgba(58,53,51,0.2)',
        }}
      >
        I NEED
        <br />A NAME
      </p>
      <img
        src="/img/dog-hero.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none relative z-10 object-contain"
        style={{ height: 'clamp(440px, 70vh, 720px)', width: 'auto' }}
      />
      <p className="sr-only">Select a name from the list to see its details.</p>
    </div>
  );
}
