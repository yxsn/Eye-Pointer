type StatusPanelProps = {
  isTracking: boolean;
  focusedLabel: string;
  lastSelectedAction: string;
  statusMessage: string;
  emergencyActive: boolean;
};

export function StatusPanel({
  isTracking,
  focusedLabel,
  lastSelectedAction,
  statusMessage,
  emergencyActive,
}: StatusPanelProps) {
  return (
    <aside className={`rounded-[1.7rem] border p-5 ${emergencyActive ? "border-red-200 bg-red-50" : "border-cyan-100 bg-cyan-50/70"}`}>
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
        Tracking Status
      </p>
      <div className="mt-4 space-y-3">
        <StatusItem
          label="Eye tracking"
          value={isTracking ? "Active" : "Inactive"}
          tone={isTracking ? "text-emerald-700" : "text-amber-700"}
        />
        <StatusItem label="Focused button" value={focusedLabel} />
        <StatusItem label="Last selected" value={lastSelectedAction} />
        <StatusItem label="System note" value={statusMessage} />
      </div>
    </aside>
  );
}

type StatusItemProps = {
  label: string;
  value: string;
  tone?: string;
};

function StatusItem({ label, value, tone = "text-slate-900" }: StatusItemProps) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 px-4 py-3 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className={`mt-2 text-lg font-semibold ${tone}`}>{value}</p>
    </div>
  );
}
