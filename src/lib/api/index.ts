// Compone el cliente `api` a partir de los dominios. Cada dominio vive en su
// propio archivo para permitir integrar módulos en paralelo sin conflictos.
// Las importaciones existentes `from "@/lib/api"` / `"../api"` siguen
// resolviendo a este index.
import { adminApi } from "./admin";
import { authApi } from "./auth";
import { groupsApi } from "./groups";
import { leaderboardApi } from "./leaderboard";
import { predictionsApi } from "./predictions";
import { tournamentApi } from "./tournament";

export { setTokens, clearTokens } from "./client";

export const api = {
  ...authApi,
  ...tournamentApi,
  ...predictionsApi,
  ...leaderboardApi,
  ...groupsApi,
  ...adminApi,
};
