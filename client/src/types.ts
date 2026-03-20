export type EventType = "action" | "emergency";

export type AppEvent = {
  id: string;
  label: string;
  type: EventType;
  createdAt: string;
};

export type CalibrationStep = "idle" | "points" | "complete";

export type GazePoint = {
  x: number;
  y: number;
};
