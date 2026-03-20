# EyePointer

EyePointer is a hackathon MVP for hospital patients with limited or no arm mobility. It uses WebGazer.js in the browser so a patient can look at large buttons, hold gaze for 3 seconds, and trigger requests without touching the screen.

## What is included

- React + TypeScript + Tailwind frontend in [`client`](/Users/yasinnk/Documents/Hackathon/Eye-Pointer/client)
- Minimal Express backend in [`server`](/Users/yasinnk/Documents/Hackathon/Eye-Pointer/server)
- Calibration screen, patient dashboard, emergency state, and caretaker event feed
- WebGazer gaze dot and 3-second dwell-to-click behavior
- In-memory event logging with `POST /api/action`, `POST /api/emergency`, and `GET /api/events`

## Project structure

- [`client`](/Users/yasinnk/Documents/Hackathon/Eye-Pointer/client): Vite frontend
- [`server`](/Users/yasinnk/Documents/Hackathon/Eye-Pointer/server): Express API with in-memory storage
- [`assets`](/Users/yasinnk/Documents/Hackathon/Eye-Pointer/assets): optional screenshots/placeholders

## Setup

1. Install frontend dependencies:

```bash
cd client
npm install
```

2. Install backend dependencies:

```bash
cd ../server
npm install
```

3. Start the Express server in one terminal:

```bash
cd server
npm run dev
```

4. Start the Vite frontend in a second terminal:

```bash
cd client
npm run dev
```

5. Open the local Vite URL, allow webcam access, run the calibration step, and look at a button for 3 full seconds to trigger it.

## Demo flow

1. Start on the calibration screen and explain webcam-based eye tracking.
2. Enter the dashboard and allow WebGazer to access the webcam.
3. Watch the gaze dot move with the patient’s eyes.
4. Hold gaze on a button until the dwell bar fills over 3 seconds.
5. Confirm the action appears in the status panel and caretaker event list.
6. Trigger `Emergency Alert` to switch the UI into the emergency state.

## Notes

- WebGazer.js is loaded from the official project site: `https://webgazer.cs.brown.edu/webgazer.js`
- Event storage is in memory only. Restarting the server clears the caretaker log.
- For local development, the Vite dev server proxies `/api` requests to `http://localhost:4000`.
