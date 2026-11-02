export type OfflineBoardingEvent = {
  clientEventId: string;
  pasajeroId: number;
  pasajeroNombre: string;
  estado: "ABORDADO" | "AUSENTE";
  latitud?: number;
  longitud?: number;
  registradoEn: string;
};

const storageKey = "transexpress-offline-boarding-events";

export function readQueue(): OfflineBoardingEvent[] {
  return JSON.parse(localStorage.getItem(storageKey) ?? "[]") as OfflineBoardingEvent[];
}

export function enqueue(event: OfflineBoardingEvent) {
  const queue = [...readQueue(), event];
  localStorage.setItem(storageKey, JSON.stringify(queue));
  return queue;
}

export async function syncQueue() {
  const events = readQueue();
  if (events.length === 0 || !navigator.onLine) return events;

  const response = await fetch("/api/checkin/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ events }),
  });
  if (!response.ok) throw new Error("No fue posible sincronizar las marcaciones.");

  const { syncedIds } = await response.json() as { syncedIds: string[] };
  const pending = events.filter((event) => !syncedIds.includes(event.clientEventId));
  localStorage.setItem(storageKey, JSON.stringify(pending));
  return pending;
}
