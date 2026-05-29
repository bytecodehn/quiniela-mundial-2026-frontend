// Mundial 2026 — datos de muestra para el landing público.
// El sorteo oficial aún no se realiza; los grupos son una simulación coherente
// (un equipo por pote FIFA) con las 48 selecciones esperadas.
// Se usa flagcdn.com (CDN público gratuito) para banderas.

export type WCGroupName =
  | "A" | "B" | "C" | "D" | "E" | "F"
  | "G" | "H" | "I" | "J" | "K" | "L";

export interface WCTeam {
  code: string;     // ISO 3166-1 alpha-2 minúscula (o gb-eng/gb-wls)
  name: string;
  confed: "UEFA" | "CONMEBOL" | "CONCACAF" | "CAF" | "AFC" | "OFC" | "PLAYOFF";
}

export interface WCGroup {
  name: WCGroupName;
  teams: WCTeam[];
}

export const WC_GROUPS: WCGroup[] = [
  {
    name: "A",
    teams: [
      { code: "us", name: "Estados Unidos", confed: "CONCACAF" },
      { code: "it", name: "Italia", confed: "UEFA" },
      { code: "ir", name: "Irán", confed: "AFC" },
      { code: "uz", name: "Uzbekistán", confed: "AFC" },
    ],
  },
  {
    name: "B",
    teams: [
      { code: "mx", name: "México", confed: "CONCACAF" },
      { code: "hr", name: "Croacia", confed: "UEFA" },
      { code: "au", name: "Australia", confed: "AFC" },
      { code: "jo", name: "Jordania", confed: "AFC" },
    ],
  },
  {
    name: "C",
    teams: [
      { code: "ca", name: "Canadá", confed: "CONCACAF" },
      { code: "uy", name: "Uruguay", confed: "CONMEBOL" },
      { code: "sa", name: "Arabia Saudita", confed: "AFC" },
      { code: "qa", name: "Qatar", confed: "AFC" },
    ],
  },
  {
    name: "D",
    teams: [
      { code: "ar", name: "Argentina", confed: "CONMEBOL" },
      { code: "co", name: "Colombia", confed: "CONMEBOL" },
      { code: "ec", name: "Ecuador", confed: "CONMEBOL" },
      { code: "nz", name: "Nueva Zelanda", confed: "OFC" },
    ],
  },
  {
    name: "E",
    teams: [
      { code: "br", name: "Brasil", confed: "CONMEBOL" },
      { code: "jp", name: "Japón", confed: "AFC" },
      { code: "py", name: "Paraguay", confed: "CONMEBOL" },
      { code: "dz", name: "Argelia", confed: "CAF" },
    ],
  },
  {
    name: "F",
    teams: [
      { code: "fr", name: "Francia", confed: "UEFA" },
      { code: "kr", name: "Corea del Sur", confed: "AFC" },
      { code: "eg", name: "Egipto", confed: "CAF" },
      { code: "za", name: "Sudáfrica", confed: "CAF" },
    ],
  },
  {
    name: "G",
    teams: [
      { code: "gb-eng", name: "Inglaterra", confed: "UEFA" },
      { code: "ma", name: "Marruecos", confed: "CAF" },
      { code: "tn", name: "Túnez", confed: "CAF" },
      { code: "cv", name: "Cabo Verde", confed: "CAF" },
    ],
  },
  {
    name: "H",
    teams: [
      { code: "es", name: "España", confed: "UEFA" },
      { code: "sn", name: "Senegal", confed: "CAF" },
      { code: "gh", name: "Ghana", confed: "CAF" },
      { code: "pa", name: "Panamá", confed: "CONCACAF" },
    ],
  },
  {
    name: "I",
    teams: [
      { code: "de", name: "Alemania", confed: "UEFA" },
      { code: "dk", name: "Dinamarca", confed: "UEFA" },
      { code: "ci", name: "Costa de Marfil", confed: "CAF" },
      { code: "cr", name: "Costa Rica", confed: "CONCACAF" },
    ],
  },
  {
    name: "J",
    teams: [
      { code: "pt", name: "Portugal", confed: "UEFA" },
      { code: "ch", name: "Suiza", confed: "UEFA" },
      { code: "no", name: "Noruega", confed: "UEFA" },
      { code: "hn", name: "Honduras", confed: "CONCACAF" },
    ],
  },
  {
    name: "K",
    teams: [
      { code: "nl", name: "Países Bajos", confed: "UEFA" },
      { code: "at", name: "Austria", confed: "UEFA" },
      { code: "rs", name: "Serbia", confed: "UEFA" },
      { code: "jm", name: "Jamaica", confed: "CONCACAF" },
    ],
  },
  {
    name: "L",
    teams: [
      { code: "be", name: "Bélgica", confed: "UEFA" },
      { code: "pl", name: "Polonia", confed: "UEFA" },
      { code: "gb-wls", name: "Gales", confed: "UEFA" },
      { code: "un", name: "Repechaje TBD", confed: "PLAYOFF" },
    ],
  },
];

export function flagUrl(code: string, size: 40 | 80 | 160 = 80): string {
  // 'un' (United Nations) lo usamos como placeholder para repechaje TBD.
  return `https://flagcdn.com/w${size}/${code}.png`;
}

// Calendario de muestra — primer matchday de la fase de grupos.
export interface WCSampleMatch {
  group: WCGroupName;
  home: WCTeam;
  away: WCTeam;
  dateLabel: string;  // "Jue 11 Jun"
  timeLabel: string;  // "18:00"
  stadium: string;
  city: string;
}

const team = (groupName: WCGroupName, code: string): WCTeam => {
  const g = WC_GROUPS.find((x) => x.name === groupName)!;
  return g.teams.find((t) => t.code === code)!;
};

export const WC_SAMPLE_MATCHES: WCSampleMatch[] = [
  {
    group: "A",
    home: team("A", "us"),
    away: team("A", "uz"),
    dateLabel: "Jue 11 Jun",
    timeLabel: "20:00",
    stadium: "SoFi Stadium",
    city: "Los Ángeles",
  },
  {
    group: "B",
    home: team("B", "mx"),
    away: team("B", "jo"),
    dateLabel: "Vie 12 Jun",
    timeLabel: "19:00",
    stadium: "Estadio Azteca",
    city: "Ciudad de México",
  },
  {
    group: "C",
    home: team("C", "ca"),
    away: team("C", "qa"),
    dateLabel: "Vie 12 Jun",
    timeLabel: "21:00",
    stadium: "BMO Field",
    city: "Toronto",
  },
  {
    group: "D",
    home: team("D", "ar"),
    away: team("D", "nz"),
    dateLabel: "Sáb 13 Jun",
    timeLabel: "18:00",
    stadium: "MetLife Stadium",
    city: "Nueva York/NJ",
  },
  {
    group: "E",
    home: team("E", "br"),
    away: team("E", "dz"),
    dateLabel: "Sáb 13 Jun",
    timeLabel: "21:00",
    stadium: "Mercedes-Benz Stadium",
    city: "Atlanta",
  },
  {
    group: "F",
    home: team("F", "fr"),
    away: team("F", "za"),
    dateLabel: "Dom 14 Jun",
    timeLabel: "16:00",
    stadium: "AT&T Stadium",
    city: "Dallas",
  },
];

export const WC_HOST_COUNTRIES = [
  { code: "ca", name: "Canadá" },
  { code: "us", name: "Estados Unidos" },
  { code: "mx", name: "México" },
];
