type EmergencyBannerProps = {
  active: boolean;
};

export function EmergencyBanner({ active }: EmergencyBannerProps) {
  if (!active) {
    return (
      <section className="rounded-[1.8rem] border border-emerald-200 bg-emerald-50/85 px-5 py-4 text-emerald-900 shadow-[0_16px_40px_rgba(16,185,129,0.12)]">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">
          System State
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Normal monitoring</h2>
        <p className="mt-1 text-base text-emerald-900/80">
          Requests can be submitted normally. Emergency escalation is currently inactive.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[1.8rem] border border-red-300 bg-[linear-gradient(135deg,#fee2e2,#fecaca)] px-5 py-4 text-red-950 shadow-[0_16px_50px_rgba(239,68,68,0.22)]">
      <p className="text-sm font-semibold uppercase tracking-[0.26em] text-red-700">
        Emergency State
      </p>
      <h2 className="mt-2 text-2xl font-semibold">Emergency alert sent to caretaker panel</h2>
      <p className="mt-1 text-base text-red-900/80">
        Prioritize immediate staff response.
      </p>
    </section>
  );
}
