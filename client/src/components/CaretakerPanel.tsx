import type { AppEvent } from "../types";

type CaretakerPanelProps = {
  events: AppEvent[];
};

export function CaretakerPanel({ events }: CaretakerPanelProps) {
  return (
    <aside className="rounded-[2rem] border border-slate-200 bg-slate-950 p-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.22)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-300">
            Caretaker Panel
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Live patient requests</h2>
        </div>
        <div className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-200">
          {events.length} event{events.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {events.length === 0 ? (
          <div className="rounded-[1.5rem] border border-slate-800 bg-slate-900/80 p-5 text-sm leading-6 text-slate-300">
            No events yet. Hold focus on a patient button for 3 seconds to log a request.
          </div>
        ) : (
          events.map((event) => (
            <article
              key={event.id}
              className={`rounded-[1.5rem] border p-4 ${
                event.type === "emergency"
                  ? "border-red-400/50 bg-red-500/10"
                  : "border-slate-800 bg-slate-900/80"
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                    event.type === "emergency"
                      ? "bg-red-500/20 text-red-200"
                      : "bg-cyan-500/10 text-cyan-200"
                  }`}
                >
                  {event.type}
                </span>
                <time className="text-sm text-slate-400">{formatEventTime(event.createdAt)}</time>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{event.label}</p>
            </article>
          ))
        )}
      </div>
    </aside>
  );
}

function formatEventTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
