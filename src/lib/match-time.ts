// Formatea kickoff_utc (instante UTC que guarda el backend) en la hora LOCAL
// DE LA SEDE, para que el calendario coincida con el oficial de FIFA (que
// publica horas locales de cada estadio).
//
// El backend solo guarda el instante UTC; acá mapeamos cada ciudad sede a su
// zona horaria IANA (que maneja el horario de verano automáticamente) y
// formateamos con Intl. Verificado contra la data oficial (openfootball):
// p.ej. la inauguración México–Sudáfrica es 13:00 en Ciudad de México
// (= 19:00 UTC), no "19:00".

const CITY_TZ: Record<string, string> = {
  "Mexico City": "America/Mexico_City",
  Zapopan: "America/Mexico_City", // Guadalajara
  Guadalupe: "America/Monterrey", // Monterrey
  Toronto: "America/Toronto",
  Vancouver: "America/Vancouver",
  Atlanta: "America/New_York",
  Foxborough: "America/New_York", // Boston
  Arlington: "America/Chicago", // Dallas
  Houston: "America/Chicago",
  "Kansas City": "America/Chicago",
  "Los Angeles": "America/Los_Angeles",
  Miami: "America/New_York",
  "New Jersey": "America/New_York", // NY/NJ (East Rutherford)
  Philadelphia: "America/New_York",
  "Santa Clara": "America/Los_Angeles", // SF Bay Area
  Seattle: "America/Los_Angeles",
};

const FALLBACK_TZ = "America/Mexico_City";

export function venueTimeZone(city?: string | null): string {
  return (city && CITY_TZ[city]) || FALLBACK_TZ;
}

/** Devuelve { date: "YYYY-MM-DD", time: "HH:mm" } en la hora local de la sede. */
export function venueLocal(kickoffUtc: string, city?: string | null): { date: string; time: string } {
  if (!kickoffUtc) return { date: "", time: "" };
  const d = new Date(kickoffUtc);
  if (Number.isNaN(d.getTime())) return { date: "", time: "" };
  const tz = venueTimeZone(city);
  // en-CA => "YYYY-MM-DD"; en-GB 24h => "HH:mm" (independiente del idioma de UI).
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { date, time };
}
