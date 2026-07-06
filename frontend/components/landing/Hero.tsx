export function Hero() {
  const ticks = Array.from({ length: 24 });

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid max-w-[90rem] grid-cols-1 items-center gap-16 px-6 py-20 sm:px-10 lg:grid-cols-2 lg:px-16 lg:py-28 xl:px-24">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brass">
            Solve et Coagula
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold leading-[1.1] text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Turn your experience into your next offer.
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            AlcheMatch matches what you&apos;ve done to what&apos;s next —
            and gives companies a clear, structured way to hire.
          </p>
          <form action="/jobs" className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              type="text"
              name="keyword"
              placeholder="Search job titles, skills, or companies"
              className="h-12 flex-1 rounded-md border border-border bg-card px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brass"
            />
            <button
              type="submit"
              className="h-12 shrink-0 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Search jobs
            </button>
          </form>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-lg lg:block">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
            <g className="animate-spin-slow">
              <circle cx="200" cy="200" r="180" fill="none" stroke="var(--brass)" strokeOpacity="0.55" strokeWidth="1" />
              {ticks.map((_, i) => (
                <line
                  key={i}
                  x1="200" y1="24" x2="200" y2="12"
                  stroke="var(--brass)" strokeOpacity="0.6" strokeWidth="2"
                  transform={`rotate(${(i * 360) / ticks.length} 200 200)`}
                />
              ))}
              <circle cx="200" cy="200" r="140" fill="none" stroke="var(--brass)" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="2 6" />
              <rect x="193" y="53" width="14" height="14" fill="none" stroke="var(--brass)" strokeWidth="1.5" transform="rotate(45 200 60)" />
              <circle cx="340" cy="200" r="7" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
              <rect x="193" y="333" width="14" height="14" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
              <polygon points="60,193 60,207 46,200" fill="none" stroke="var(--brass)" strokeWidth="1.5" />
            </g>
            <g>
              <circle cx="180" cy="200" r="48" fill="var(--verdigris)" fillOpacity="0.10" stroke="var(--verdigris)" strokeWidth="1.5" />
              <circle cx="220" cy="200" r="48" fill="var(--cinnabar)" fillOpacity="0.10" stroke="var(--cinnabar)" strokeWidth="1.5" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}