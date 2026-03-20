import type { CalibrationStep } from "../types";

type CalibrationScreenProps = {
  currentStep: CalibrationStep;
  onStartCalibration: () => void;
  onCompleteCalibration: () => void;
  onContinue: () => void;
};

const POINTS = [
  "Top left",
  "Top center",
  "Top right",
  "Center left",
  "Center",
  "Center right",
  "Bottom left",
  "Bottom center",
  "Bottom right",
];

export function CalibrationScreen({
  currentStep,
  onStartCalibration,
  onCompleteCalibration,
  onContinue,
}: CalibrationScreenProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#d7f0ff_0%,#f7fbff_45%,#edf5ff_100%)] px-4 py-8 text-slate-900 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-700">
            EyePointer MVP
          </p>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-tight lg:text-6xl">
            Eye-driven hospital requests, built for quick bedside communication
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            This prototype supports gaze-style interaction for hospital patients with limited arm mobility. For the current demo build, mouse movement simulates gaze so the 3-second dwell interaction is reliable.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard title="Calibration" body="Start calibration to enter the guided setup flow before using the patient dashboard." />
            <InfoCard title="3-second dwell" body="The request activates only if focus stays on one button for the full dwell duration." />
            <InfoCard title="Caretaker feed" body="Requests and emergency alerts are logged in the live event panel." />
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              type="button"
              onClick={onStartCalibration}
              className="rounded-full bg-cyan-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-cyan-600/30 transition hover:bg-cyan-500"
            >
              Start Calibration
            </button>
            <button
              type="button"
              onClick={onContinue}
              className="rounded-full border border-slate-300 bg-white px-8 py-4 text-lg font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
            >
              Skip to Demo
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/70 bg-slate-950 p-8 text-white shadow-[0_24px_70px_rgba(15,23,42,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-cyan-300">
            Calibration Flow
          </p>
          <h2 className="mt-3 text-3xl font-semibold">
            {currentStep === "idle" && "Ready to begin"}
            {currentStep === "points" && "Look at each highlighted point"}
            {currentStep === "complete" && "Calibration complete"}
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            {currentStep === "idle" && "Use a comfortable viewing position and keep the pointer in motion to simulate gaze during the demo."}
            {currentStep === "points" && "Move across the screen and pause over each area. This stage introduces the focus and dwell interaction before entering the dashboard."}
            {currentStep === "complete" && "The demo is ready. Continue into the patient interface and hold focus on any button for 3 seconds."}
          </p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {POINTS.map((point) => (
              <div
                key={point}
                className={`flex aspect-square items-center justify-center rounded-3xl border text-center text-sm font-medium transition ${
                  currentStep === "points"
                    ? "border-cyan-400 bg-cyan-400/15 text-cyan-100"
                    : currentStep === "complete"
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-100"
                      : "border-slate-700 bg-slate-900 text-slate-500"
                }`}
              >
                {point}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            {currentStep === "points" ? (
              <button
                type="button"
                onClick={onCompleteCalibration}
                className="rounded-full bg-emerald-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-emerald-400"
              >
                Finish Calibration
              </button>
            ) : null}
            {currentStep === "complete" ? (
              <button
                type="button"
                onClick={onContinue}
                className="rounded-full bg-cyan-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
              >
                Continue to Patient Interface
              </button>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
}

type InfoCardProps = {
  title: string;
  body: string;
};

function InfoCard({ title, body }: InfoCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-cyan-100 bg-cyan-50/70 p-5">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </article>
  );
}
