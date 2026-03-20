import cors from "cors";
import express from "express";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const events = [];

app.get("/api/events", (_request, response) => {
  response.json(sortEvents(events));
});

app.post("/api/action", (request, response) => {
  const { action } = request.body ?? {};

  if (typeof action !== "string" || action.trim() === "") {
    response.status(400).json({ error: "Action is required" });
    return;
  }

  const event = createEvent("action", action.trim());
  events.unshift(event);
  response.status(201).json(event);
});

app.post("/api/emergency", (request, response) => {
  const { message } = request.body ?? {};

  if (typeof message !== "string" || message.trim() === "") {
    response.status(400).json({ error: "Emergency message is required" });
    return;
  }

  const event = createEvent("emergency", message.trim());
  events.unshift(event);
  response.status(201).json(event);
});

app.listen(PORT, () => {
  console.log(`EyePointer server listening on http://localhost:${PORT}`);
});

function createEvent(type, label) {
  return {
    id: crypto.randomUUID(),
    type,
    label,
    createdAt: new Date().toISOString(),
  };
}

function sortEvents(input) {
  return [...input].sort((left, right) => {
    if (left.type !== right.type) {
      return left.type === "emergency" ? -1 : 1;
    }

    return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
  });
}
