// Deriva el emoji de bandera a partir del código FIFA de 3 letras.
//
// El backend tiene `flag_emoji` nullable y hoy viene vacío para todas las
// selecciones, así que los mappers usan esto como fallback:
//   flag: team.flag_emoji || flagForFifaCode(team.fifa_code)
//
// La mayoría de los códigos FIFA se mapean a ISO 3166-1 alpha-2 y de ahí al
// emoji (par de "regional indicator symbols"). Las naciones del Reino Unido
// (Inglaterra/Escocia/Gales/Irlanda del Norte) usan banderas de subdivisión.

const FIFA_TO_ISO2: Record<string, string> = {
  ALG: "DZ", ARG: "AR", AUS: "AU", AUT: "AT", BEL: "BE", BIH: "BA", BRA: "BR",
  CAN: "CA", CIV: "CI", COD: "CD", COL: "CO", CPV: "CV", CRO: "HR", CUW: "CW",
  CZE: "CZ", ECU: "EC", EGY: "EG", ESP: "ES", FRA: "FR", GER: "DE", GHA: "GH",
  HAI: "HT", IRN: "IR", IRQ: "IQ", JOR: "JO", JPN: "JP", KOR: "KR", KSA: "SA",
  MAR: "MA", MEX: "MX", NED: "NL", NOR: "NO", NZL: "NZ", PAN: "PA", PAR: "PY",
  POR: "PT", QAT: "QA", RSA: "ZA", SEN: "SN", SUI: "CH", SWE: "SE", TUN: "TN",
  TUR: "TR", URU: "UY", USA: "US", UZB: "UZ",
  // Extras comunes por robustez (por si cambia el fixture).
  ITA: "IT", SRB: "RS", POL: "PL", DEN: "DK", UKR: "UA", GRE: "GR", RUS: "RU",
  NGA: "NG", CMR: "CM", PER: "PE", VEN: "VE", BOL: "BO", CRC: "CR", HON: "HN",
  SVK: "SK", SVN: "SI", ROU: "RO", HUN: "HU", FIN: "FI", ISL: "IS", IRL: "IE",
  MLI: "ML", BFA: "BF", ZAM: "ZM", ALB: "AL", GEO: "GE", ARM: "AM",
};

// Banderas de subdivisión (no tienen código ISO alpha-2 de país).
const SPECIAL: Record<string, string> = {
  ENG: "🏴󠁧󠁢󠁥󠁮󠁧󠁿",
  SCO: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
  WAL: "🏴󠁧󠁢󠁷󠁬󠁳󠁿",
  NIR: "🇬🇧",
};

function iso2ToEmoji(iso2: string): string {
  const A = 0x1f1e6; // 'regional indicator symbol letter A'
  return String.fromCodePoint(
    ...[...iso2.toUpperCase()].map((ch) => A + (ch.charCodeAt(0) - 65)),
  );
}

/** Emoji de bandera para un código FIFA (""+ si no se conoce). */
export function flagForFifaCode(code: string | undefined | null): string {
  if (!code) return "";
  const c = code.toUpperCase();
  if (SPECIAL[c]) return SPECIAL[c];
  const iso2 = FIFA_TO_ISO2[c];
  return iso2 ? iso2ToEmoji(iso2) : "";
}

// Códigos de subdivisión de flagcdn (Reino Unido) para las banderas-imagen.
const FIFA_TO_FLAGCDN_SUB: Record<string, string> = {
  ENG: "gb-eng",
  SCO: "gb-sct",
  WAL: "gb-wls",
  NIR: "gb-nir",
};

// URL de la bandera como IMAGEN (SVG vía flagcdn / Flagpedia). Se usa en vez de
// emojis porque los emojis de bandera NO se renderizan en Windows (muestra las
// dos letras). SVG escala a cualquier tamaño. "" si el código no se conoce
// (p.ej. equipos "Por definir" en eliminatorias sin resolver).
export function flagImageUrl(code?: string | null): string {
  if (!code) return "";
  const c = code.toUpperCase();
  if (FIFA_TO_FLAGCDN_SUB[c]) return `https://flagcdn.com/${FIFA_TO_FLAGCDN_SUB[c]}.svg`;
  const iso2 = FIFA_TO_ISO2[c];
  return iso2 ? `https://flagcdn.com/${iso2.toLowerCase()}.svg` : "";
}
