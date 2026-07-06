export function AuthMark() {
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
      <circle cx="200" cy="200" r="180" fill="none" stroke="var(--brass)" strokeOpacity="0.55" strokeWidth="2" />
      <circle cx="200" cy="200" r="140" fill="none" stroke="var(--brass)" strokeOpacity="0.35" strokeWidth="2" strokeDasharray="4 12" />
      <circle cx="180" cy="200" r="52" fill="var(--verdigris)" fillOpacity="0.85" stroke="var(--paper)" strokeWidth="3" />
      <circle cx="220" cy="200" r="52" fill="var(--cinnabar)" fillOpacity="0.85" stroke="var(--paper)" strokeWidth="3" />
    </svg>
  );
}