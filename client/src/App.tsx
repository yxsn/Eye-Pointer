import { useEffect, useMemo, useRef, useState } from "react";
import { CalibrationScreen } from "./components/CalibrationScreen";
import { CaretakerPanel } from "./components/CaretakerPanel";
import { EmergencyBanner } from "./components/EmergencyBanner";
import { PatientButton } from "./components/PatientButton";
import { StatusPanel } from "./components/StatusPanel";
import { ACTIONS, EMERGENCY_ACTION } from "./data/actions";
import { fetchEvents, postAction, postEmergency } from "./services/api";
import { useWebGazer } from "./hooks/useWebGazer";
import type { AppEvent, CalibrationStep, EventType } from "./types";

const DWELL_DURATION_MS = 3000;

function App() {
  const [screen, setScreen] = useState<"intro" | "calibration" | "dashboard">("intro");
  const [calibrationStep, setCalibrationStep] = useState<CalibrationStep>("idle");
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [lastSelectedAction, setLastSelectedAction] = useState("None yet");
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [focusedActionId, setFocusedActionId] = useState<string | null>(null);
  const [dwellProgress, setDwellProgress] = useState(0);
  const [lockedActionId, setLockedActionId] = useState<string | null>(null);
  const [mousePoint, setMousePoint] = useState({ x: 80, y: 80 });
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const dwellStartRef = useRef<number | null>(null);

  const { gaze, isTracking, statusMessage } = useWebGazer({
    enabled: screen !== "intro",
  });

  const focusLabel = useMemo(() => {
    const action = [...ACTIONS, EMERGENCY_ACTION].find((entry) => entry.id === focusedActionId);
    return action?.label ?? "None";
  }, [focusedActionId]);

  useEffect(() => {
    let active = true;

    const loadEvents = async () => {
      try {
        const nextEvents = await fetchEvents();
        if (active) {
          setEvents(nextEvents);
        }
      } catch {
        if (active) {
          setEvents((current) => current);
        }
      }
    };

    void loadEvents();

    const intervalId = window.setInterval(() => {
      void loadEvents();
    }, 4000);

    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const updateMousePoint = (event: PointerEvent) => {
      setMousePoint({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", updateMousePoint);

    return () => {
      window.removeEventListener("pointermove", updateMousePoint);
    };
  }, []);

  useEffect(() => {
    if (!gaze || screen !== "dashboard") {
      setFocusedActionId(null);
      setDwellProgress(0);
      dwellStartRef.current = null;
      return;
    }

    const nextFocusedAction = [...ACTIONS, EMERGENCY_ACTION].find((action) => {
      const element = buttonRefs.current[action.id];
      if (!element) {
        return false;
      }

      const bounds = element.getBoundingClientRect();
      return gaze.x >= bounds.left && gaze.x <= bounds.right && gaze.y >= bounds.top && gaze.y <= bounds.bottom;
    });

    const nextId = nextFocusedAction?.id ?? null;

    if (lockedActionId && nextId !== lockedActionId) {
      setLockedActionId(null);
    }

    if (nextId !== focusedActionId) {
      setFocusedActionId(nextId);
      setDwellProgress(0);
      dwellStartRef.current = nextId && nextId !== lockedActionId ? performance.now() : null;
    }
  }, [focusedActionId, gaze, lockedActionId, screen]);

  useEffect(() => {
    if (!focusedActionId || focusedActionId === lockedActionId || screen !== "dashboard") {
      setDwellProgress(0);
      return;
    }

    let frameId = 0;

    // The dwell timer advances only while the same target stays focused.
    const tick = () => {
      const startedAt = dwellStartRef.current;
      if (!startedAt) {
        setDwellProgress(0);
        return;
      }

      const elapsed = performance.now() - startedAt;
      const progress = Math.min(elapsed / DWELL_DURATION_MS, 1);
      setDwellProgress(progress);

      if (progress >= 1) {
        void handleActionTrigger(focusedActionId);
        setLockedActionId(focusedActionId);
        dwellStartRef.current = null;
        setDwellProgress(0);
        return;
      }

      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [focusedActionId, lockedActionId, screen]);

  const appendFallbackEvent = (label: string, type: EventType) => {
    const event: AppEvent = {
      id: `local-${crypto.randomUUID()}`,
      label,
      type,
      createdAt: new Date().toISOString(),
    };

    setEvents((current) => sortEvents([event, ...current]));
  };

  const handleActionTrigger = async (actionId: string) => {
    const action = [...ACTIONS, EMERGENCY_ACTION].find((entry) => entry.id === actionId);
    if (!action) {
      return;
    }

    setLastSelectedAction(action.label);

    if (action.type === "emergency") {
      setEmergencyActive(true);

      try {
        await postEmergency(action.label);
        const latest = await fetchEvents();
        setEvents(latest);
      } catch {
        appendFallbackEvent(action.label, "emergency");
      }

      return;
    }

    setEmergencyActive(false);

    try {
      await postAction(action.label);
      const latest = await fetchEvents();
      setEvents(latest);
    } catch {
      appendFallbackEvent(action.label, "action");
    }
  };

  const registerButton = (id: string) => (element: HTMLButtonElement | null) => {
    buttonRefs.current[id] = element;
  };

  const goToCalibration = () => {
    setScreen("calibration");
    setCalibrationStep("points");
  };

  const finishCalibration = () => {
    setCalibrationStep("complete");
  };

  const continueToDashboard = () => {
    setScreen("dashboard");
  };

  if (screen !== "dashboard") {
    return (
      <CalibrationScreen
        currentStep={calibrationStep}
        onStartCalibration={goToCalibration}
        onCompleteCalibration={finishCalibration}
        onContinue={continueToDashboard}
      />
    );
  }

  return (
    <div className="relative min-h-screen cursor-none overflow-hidden bg-[radial-gradient(circle_at_top,#dff5ff_0%,#f7fbff_44%,#ecf3ff_100%)] text-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.58),rgba(190,228,255,0.16))]" />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${mousePoint.x}px`, top: `${mousePoint.y}px` }}
      >
        <div className="relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-slate-900 bg-white/90 shadow-[0_0_16px_rgba(15,23,42,0.18)]">
          <div className="h-2.5 w-2.5 rounded-full bg-slate-900" />
          <span className="absolute left-9 top-1/2 -translate-y-1/2 rounded-full bg-slate-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Mouse
          </span>
        </div>
      </div>
      {gaze ? (
        <div
          aria-hidden="true"
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${gaze.x}px`, top: `${gaze.y}px` }}
        >
          <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-900 bg-cyan-400/80 shadow-[0_0_18px_rgba(34,211,238,0.7)]">
            <div className="h-3 w-3 rounded-full bg-cyan-950" />
            <div className="absolute inset-0 animate-ping rounded-full border border-cyan-500/40" />
            <span className="absolute left-10 top-1/2 -translate-y-1/2 rounded-full bg-cyan-900 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-50">
              Eyes
            </span>
          </div>
        </div>
      ) : null}

      <main className="relative mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 lg:px-6">
        <header className="grid gap-4 rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur lg:grid-cols-[2.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-700">
              EyePointer
            </p>
            <h1 className="mt-2 font-serif text-4xl font-semibold text-slate-900 lg:text-5xl">
              Eye-gaze hospital requests for patients with limited mobility
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-600">
              Hold your gaze on any command for 3 seconds to activate it. A progress bar fills while EyePointer tracks the same target continuously.
            </p>
            <p className="mt-3 max-w-3xl text-sm font-medium uppercase tracking-[0.18em] text-cyan-700">
              WebGazer uses the webcam to estimate gaze. Hold focus for the full 3 seconds to activate a request.
            </p>
          </div>
          <StatusPanel
            isTracking={isTracking}
            focusedLabel={focusLabel}
            lastSelectedAction={lastSelectedAction}
            statusMessage={statusMessage}
            emergencyActive={emergencyActive}
          />
        </header>

        <EmergencyBanner active={emergencyActive} />

        <section className="grid flex-1 gap-6 xl:grid-cols-[minmax(0,2fr)_420px]">
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Patient Controls
                </p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  Focus a button, hold for 3 seconds, then activate the request
                </h2>
              </div>
              <div classNa