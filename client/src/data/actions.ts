import type { EventType } from "../types";

export type ActionDefinition = {
  id: string;
  label: string;
  description: string;
  type: EventType;
  accentClass: string;
};

export const ACTIONS: ActionDefinition[] = [
  {
    id: "water",
    label: "Need Water",
    description: "Request drinking water or hydration support.",
    type: "action",
    accentClass: "from-cyan-500 to-sky-600",
  },
  {
    id: "nurse",
    label: "Need Nurse",
    description: "Call a nurse to the room.",
    type: "action",
    accentClass: "from-blue-500 to-indigo-600",
  },
  {
    id: "help",
    label: "Need Help",
    description: "General assistance request.",
    type: "action",
    accentClass: "from-teal-500 to-emerald-600",
  },
  {
    id: "pain",
    label: "Pain",
    description: "Indicate pain or discomfort.",
    type: "action",
    accentClass: "from-amber-500 to-orange-600",
  },
  {
    id: "yes",
    label: "Yes",
    description: "Simple yes response.",
    type: "action",
    accentClass: "from-emerald-500 to-green-600",
  },
  {
    id: "no",
    label: "No",
    description: "Simple no response.",
    type: "action",
    accentClass: "from-slate-500 to-slate-700",
  },
];

export const EMERGENCY_ACTION: ActionDefinition = {
  id: "emergency",
  label: "Emergency Alert",
  description: "Immediate emergency escalation for the care team.",
  type: "emergency",
  accentClass: "from-red-500 to-rose-700",
};
