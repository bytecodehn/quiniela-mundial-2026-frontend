// Dominio: predicciones (F5 — integrado al backend Go real).
//
// MODELO: una predicción es por (usuario, match), NO por grupo. El backend
// puntúa per-grupo en otra tabla y NO expone puntos por predicción, así que
// `Prediction.points` se deja en null y el `status` se DERIVA en cliente
// comparando el marcador predicho contra el resultado real del partido.
//
// Endpoints consumidos:
//   POST   /predictions                  (upsert: crea y edita)
//   GET    /predictions/mine             (?stage opcional)
//   GET    /tournament/matches           (para hidratar el match embebido)
//   GET    /groups/:id/my-score          (puntos/rank del grupo activo)
//
// Las respuestas del backend son JSON crudo (arrays/objetos sin envoltorio);
// este módulo sintetiza los wrappers `{predictions, stats, pagination}` /
// `{prediction}` y el `PredictionStats` que esperan los hooks.
import type { GroupName, Pagination, Prediction, PredictionStats, Team } from "@/types";
import { request } from "./client";

// --- Contrato del backend (snake_case, tal cual lo emite Go) ---

interface BackendTeam {
  id: number;
  fifa_code: string;
  name_en: string;
  name_es: string;
  confederation?: string;
  flag_emoji?: string;
  fifa_rank?: number;
}

type BackendStage = "group" | "r32" | "r16" | "qf" | "sf" | "third" | "final";
type BackendStatus = "scheduled" | "live" | "completed" | "postponed" | "cancelled";

interface BackendScore {
  home: number | null;
  away: number | null;
}

interface BackendMatch {
  id: number;
  stage: BackendStage;
  group?: string;
  kickoff_utc: string;
  venue?: string;
  venue_city?: string;
  status: BackendStatus;
  home?: BackendTeam;
  away?: BackendTeam;
  home_placeholder?: string;
  away_placeholder?: string;
  score?: BackendScore;
}

interface BackendPrediction {
  user_id: string;
  match_id: number;
  home_pred: number;
  away_pred: number;
  locked: boolean;
  locked_at?: string;
  created_at: string;
  updated_at: string;
}

interface BackendMyScore {
  rank: number;
  total_points: number;
  matches_scored: number;
}

// El match embebido en Prediction (subset de Match).
type EmbeddedMatch = Prediction["match"];

// --- Mapeo backend -> frontend ---

const STATUS_MAP: Record<BackendStatus, EmbeddedMatch["status"]> = {
  scheduled: "upcoming",
  live: "live",
  completed: "finished",
  postponed: "upcoming",
  cancelled: "upcoming",
};

function mapTeam(team: BackendTeam, group: GroupName): Team {
  return {
    id: String(team.id),
    name: team.name_es || team.name_en,
    code: team.fifa_code,
    flag: team.flag_emoji ?? "",
    group,
    rank: team.fifa_rank ?? 0,
  };
}

function placeholderTeam(label?: string): Team {
  return { id: "", name: label ?? "Por definir", code: "", flag: "", group: "A", rank: 0 };
}

// Mapea un BackendMatch al subset que vive embebido en Prediction.
function mapMatch(match: BackendMatch): EmbeddedMatch {
  const group: GroupName = (match.group as GroupName) || "A";
  const homeTeam = match.home ? mapTeam(match.home, group) : placeholderTeam(match.home_placeholder);
  const awayTeam = match.away ? mapTeam(match.away, group) : placeholderTeam(match.away_placeholder);
  const kickoff = match.kickoff_utc;
  return {
    id: String(match.id),
    homeTeam,
    awayTeam,
    date: kickoff.slice(0, 10),
    time: kickoff.slice(11, 16),
    status: STATUS_MAP[match.status] ?? "upcoming",
    homeScore: match.score?.home ?? null,
    awayScore: match.score?.away ?? null,
  };
}

// Match mínimo cuando /tournament/matches no devolvió el partido (datos viejos,
// filtro de stage, etc.). Mantiene la UI funcional con placeholders.
function minimalMatch(matchId: number): EmbeddedMatch {
  return {
    id: String(matchId),
    homeTeam: placeholderTeam(),
    awayTeam: placeholderTeam(),
    date: "",
    time: "",
    status: "upcoming",
    homeScore: null,
    awayScore: null,
  };
}

// Deriva el status de una predicción comparando contra el resultado real.
// El backend no expone status/points por predicción (se puntúa per-grupo).
function deriveStatus(
  homePred: number,
  awayPred: number,
  match: EmbeddedMatch,
): Prediction["status"] {
  if (match.status !== "finished") return "pending";
  if (homePred === match.homeScore && awayPred === match.awayScore) return "exact";
  const predSign = Math.sign(homePred - awayPred);
  const realSign = Math.sign((match.homeScore ?? 0) - (match.awayScore ?? 0));
  if (predSign === realSign) return "correct";
  return "incorrect";
}

function buildPrediction(p: BackendPrediction, match: EmbeddedMatch): Prediction {
  return {
    id: String(p.match_id),
    match,
    predictedHomeScore: p.home_pred,
    predictedAwayScore: p.away_pred,
    points: null, // no disponible per-predicción (se puntúa per-grupo)
    status: deriveStatus(p.home_pred, p.away_pred, match),
    createdAt: p.created_at,
  };
}

// Indexa los matches del torneo por id para hidratar las predicciones.
function indexMatches(matches: BackendMatch[]): Map<number, EmbeddedMatch> {
  const byId = new Map<number, EmbeddedMatch>();
  for (const m of matches) byId.set(m.id, mapMatch(m));
  return byId;
}

// Compone el PredictionStats a partir de las predicciones del usuario, los
// matches del torneo y (opcional) el my-score del grupo activo.
function buildStats(
  mine: BackendPrediction[],
  matchesById: Map<number, EmbeddedMatch>,
  groupId: string | undefined,
  myScore: BackendMyScore | null,
): PredictionStats {
  let predictionsPending = 0;
  let exactCount = 0;
  let correctCount = 0;
  const finished: Prediction[] = [];

  for (const p of mine) {
    const match = matchesById.get(p.match_id) ?? minimalMatch(p.match_id);
    const status = deriveStatus(p.home_pred, p.away_pred, match);
    if (match.status !== "finished") predictionsPending++;
    if (status === "exact") exactCount++;
    if (status === "correct") correctCount++;
    if (match.status === "finished") finished.push(buildPrediction(p, match));
  }

  const lastResults: PredictionStats["lastResults"] = finished.slice(0, 5).map((pred) => ({
    match: {
      id: pred.match.id,
      homeTeam: pred.match.homeTeam,
      awayTeam: pred.match.awayTeam,
      date: pred.match.date,
      time: pred.match.time,
      homeScore: pred.match.homeScore,
      awayScore: pred.match.awayScore,
    },
    prediction: {
      predictedHomeScore: pred.predictedHomeScore,
      predictedAwayScore: pred.predictedAwayScore,
      status: pred.status,
    },
    points: 0, // sin puntos per-predicción
  }));

  return {
    // Puntos/rank salen del leaderboard del grupo activo (per-grupo); sin grupo, 0/null.
    totalPoints: myScore?.total_points ?? 0,
    globalRank: 0, // no hay ranking global expuesto
    groupRank: myScore?.rank ?? null,
    groupId: groupId ?? null,
    groupName: null, // el nombre no está a mano en este módulo
    predictionsPending,
    predictionsTotal: mine.length,
    exactCount,
    correctCount,
    lastResults,
  };
}

// --- API pública del dominio ---

export const predictionsApi = {
  getPredictions: async (
    params?: Record<string, string>,
  ): Promise<{ predictions: Prediction[]; stats: PredictionStats; pagination: Pagination }> => {
    const qs = params ? "?" + new URLSearchParams(params).toString() : "";
    const [mine, matches] = await Promise.all([
      request<BackendPrediction[]>(`/predictions/mine${qs}`),
      request<BackendMatch[]>("/tournament/matches"),
    ]);
    const matchesById = indexMatches(matches);
    const predictions = mine.map((p) =>
      buildPrediction(p, matchesById.get(p.match_id) ?? minimalMatch(p.match_id)),
    );
    // stats derivado sin grupo (la página de predicciones solo usa los counters);
    // el dashboard usa getStats() con el grupo activo.
    const stats = buildStats(mine, matchesById, undefined, null);
    const pagination: Pagination = { page: 1, limit: predictions.length, total: predictions.length };
    return { predictions, stats, pagination };
  },

  createPrediction: async (data: {
    matchId: string;
    homeScore: number;
    awayScore: number;
    match?: EmbeddedMatch;
  }): Promise<{ prediction: Prediction }> => {
    const res = await request<BackendPrediction>("/predictions", {
      method: "POST",
      body: JSON.stringify({
        match_id: Number(data.matchId),
        home_pred: data.homeScore,
        away_pred: data.awayScore,
      }),
    });
    // Usamos el match que pasó el caller si lo tenemos; si no, uno mínimo.
    const match = data.match ?? minimalMatch(res.match_id);
    return { prediction: buildPrediction(res, match) };
  },

  getStats: async (groupId?: string): Promise<PredictionStats> => {
    const [mine, matches] = await Promise.all([
      request<BackendPrediction[]>("/predictions/mine"),
      request<BackendMatch[]>("/tournament/matches"),
    ]);
    const matchesById = indexMatches(matches);
    let myScore: BackendMyScore | null = null;
    if (groupId) {
      myScore = await request<BackendMyScore>(`/groups/${groupId}/my-score`);
    }
    return buildStats(mine, matchesById, groupId, myScore);
  },
};
