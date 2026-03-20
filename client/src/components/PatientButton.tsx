import type { ActionDefinition } from "../data/actions";

type PatientButtonProps = {
  action: ActionDefinition;
  isFocused: boolean;
  progress: number;
  onActivate: () => void;
  refCallback: (element: HTMLButtonElement | null) => void;
};

export function PatientButton({
  action,
  isFocused,
  progress,
  onActivate,
  refCallback,
}: PatientButtonProps) {
  return (
    <button
      ref={refCallback}
      type="button"
      onClick={onActivate}
      className={`group relative min-h-44 overflow-hidden rounded-[1.8rem] border bg-white p-6 text-left transition ${
        action.type === "emergency"
          ? "border-red-200 shadow-[0_24px_55px_rgba(239,68,68,0.18)]"
          : "border-slate-200 shadow-[0_18px_40px_rgba(15,23,42,0.08)]"
      } ${isFocused ? "scale-[1.01] border-cyan-400 ring-4 ring-cyan-300/60" : "hover:border-cyan-200"}`}
    >
      <div className="absolute inset-x-0 top-0 h-2 bg-slate-100">
        <div
          className={`h-full rounded-r-full bg-gradient-to-r ${action.accentClass} transition-[width] duration-100`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div
        className={`absolute inset-0 bg-gradient-to-br ${action.accentClass} opacity-[0.08] transition-opacity ${
          isFocused ? "opacity-[0.18]" : ""
        }`}
      />

      <div className="relative flex h-full flex-col justify-between gap-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {action.type === "emergency" ? "Urgent" : "Patient Request"}
          </p>
          <h3
            className={`mt-3 text-3xl font-semibold ${
              action.type === "emergency" ? "text-red-700" : "text-slate-900"
            }`}
          >
            {action.label}
          </h3>
          <p className="mt-3 max-w-xs text-base leading-7 text-slate-600">
            {action.description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm font-medium text-slate-700">
            {isFocused ? "Tracking focus..." : "Move pointer here to focus"}
          </span>
          <span className="text-sm font-semibold text-slate-500">
            {Math.round(progress * 3 * 10) / 10}s / 3.0s
          </span>
        </div>
      </div>
    </button>
  );
}
