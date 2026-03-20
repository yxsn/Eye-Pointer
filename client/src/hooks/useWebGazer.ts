import { useEffect, useState } from "react";
import type { GazePoint } from "../types";

const WEBGAZER_SCRIPT_ID = "webgazer-script";
const WEBGAZER_SOURCE = "https://webgazer.cs.brown.edu/webgazer.js";

type UseWebGazerOptions = {
  enabled: boolean;
};

type UseWebGazerResult = {
  gaze: GazePoint | null;
  isTracking: boolean;
  statusMessage: string;
};

export function useWebGazer({ enabled }: UseWebGazerOptions): UseWebGazerResult {
  const [gaze, setGaze] = useState<GazePoint | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [statusMessage, setStatusMessage] = useState("Waiting to start eye tracking");

  useEffect(() => {
    if (!enabled) {
      setGaze(null);
      setIsTracking(false);
      setStatusMessage("Calibration mode");
      return;
    }

    let cancelled = false;

    const setup = async () => {
      try {
        if (!window.isSecureContext) {
          throw new Error("Camera access requires localhost or HTTPS");
        }

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("This browser does not support webcam access");
        }

        setStatusMessage("Loading WebGazer");
        await loadWebGazerScript();

        if (cancelled || !window.webgazer) {
          return;
        }

        const webgazer = window.webgazer;
        setStatusMessage("Requesting webcam permission");

        // Keep the integration minimal to avoid version-specific API mismatches.
        webgazer.setGazeListener((data) => {
          if (!data || cancelled) {
            return;
          }

          setGaze({ x: data.x, y: data.y });
        });

        await webgazer.begin();

        if (cancelled) {
          return;
        }

        setIsTracking(true);
        setStatusMessage("Eye tracking active");
      } catch (error) {
        if (cancelled) {
          return;
        }

        setGaze(null);
        setIsTracking(false);
        setStatusMessage(getWebGazerErrorMessage(error));
      }
    };

    void setup();

    return () => {
      cancelled = true;

      if (window.webgazer) {
        window.webgazer.pause();
      }
    };
  }, [enabled]);

  return { gaze, isTracking, statusMessage };
}

async function loadWebGazerScript() {
  if (window.webgazer) {
    return;
  }

  const existingScript = document.getElementById(WEBGAZER_SCRIPT_ID) as HTMLScriptElement | null;

  if (existingScript?.dataset.ready === "true") {
    return;
  }

  await new Promise<void>((resolve, reject) => {
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Failed to load WebGazer.js")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = WEBGAZER_SCRIPT_ID;
    script.src = WEBGAZER_SOURCE;
    script.async = true;
    script.onload = () => {
      script.dataset.ready = "true";
      resolve();
    };
    script.onerror = () => reject(new Error("Failed to load WebGazer.js"));
    document.head.appendChild(script);
  });
}

function getWebGazerErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") {
      return "Camera permission was denied";
    }

    if (error.name === "NotFoundError") {
      return "No camera was found on this device";
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to initialize eye tracking";
}
