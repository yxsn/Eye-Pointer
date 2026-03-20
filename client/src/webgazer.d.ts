export {};

declare global {
  interface Window {
    webgazer?: {
      begin: () => Promise<unknown>;
      pause: () => void;
      setGazeListener: (
        listener: (data: { x: number; y: number } | null, elapsedTime?: number) => void,
      ) => Window["webgazer"];
    };
  }
}
