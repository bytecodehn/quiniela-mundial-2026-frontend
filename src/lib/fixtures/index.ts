import { WC_MATCHES, WC_TEAMS } from "./world-cup-2026";

export const mockUser = {
  id: "user-1",
  name: "Carlos Andrés",
  email: "carlos@example.com",
  avatar: "CA",
  favoriteTeam: "México",
  country: "MX",
  status: "active" as const,
  role: "user" as const,
  points: 0,
  globalRank: 0,
  predictionsCount: 2,
  createdAt: "2026-05-01T00:00:00Z",
};

export const mockAdminUser = { ...mockUser, role: "admin" as const, name: "Admin Master", avatar: "AM", email: "admin@quiniela.com" };

export function makeTeam(name: string, code: string, flag: string, group: string, rank: number) {
  return { id: `t-${code}`, name, code, flag, group, rank };
}

// Fixture REAL del Mundial 2026 (auto-generado desde la fuente oficial).
// Pre-torneo: todos los partidos "upcoming", sin marcadores.
export const allMatches = WC_MATCHES;
export const mockMatches = WC_MATCHES;
export const mockFinishedMatches = [] as typeof WC_MATCHES;

// Predicciones demo (pendientes) sobre partidos reales, para poblar la UI.
export const mockPredictions = [
  { id: "p1", match: WC_MATCHES[0], predictedHomeScore: 2, predictedAwayScore: 1, points: null, status: "pending" as const, createdAt: "2026-05-20T10:00:00Z" },
  { id: "p2", match: WC_MATCHES[1], predictedHomeScore: 1, predictedAwayScore: 1, points: null, status: "pending" as const, createdAt: "2026-05-20T11:00:00Z" },
];

export const mockStats = {
  totalPoints: 0,
  globalRank: 0,
  groupRank: null,
  groupId: null,
  groupName: null,
  predictionsPending: mockPredictions.length,
  predictionsTotal: mockPredictions.length,
  exactCount: 0,
  correctCount: 0,
  lastResults: [] as { match: (typeof WC_MATCHES)[number]; prediction: { predictedHomeScore: number; predictedAwayScore: number; status: string }; points: number }[],
};

export const mockLeaderboard = Array.from({ length: 15 }, (_, i) => ({
  rank: i + 1,
  userId: `u-${i}`,
  name: ["MessiFan_10", "GolAzul", "LaTri_26", "FutboleroCR", "Crack_Verde", "Pichichi_23", "BalónDeOro", "JugadorNro12", "Cancha_3", "Diego_10", "Raya_9", "TikiTaka_8", "Cabezazo_7", "MediaCancha", "Arquero_1"][i] || `User_${i}`,
  avatar: ["JF", "GA", "LT", "FC", "CV", "P2", "BD", "JN", "C3", "DM", "R9", "TT", "CB", "MC", "AR"][i] || `U${i}`,
  points: [284, 271, 265, 258, 252, 248, 241, 237, 230, 225, 219, 214, 208, 202, 198][i],
  correctPredictions: [42, 40, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26][i],
  exactPredictions: [14, 12, 11, 10, 10, 9, 8, 8, 7, 7, 6, 6, 5, 5, 4][i],
  totalPredictions: 56,
}));

export const mockGroups = [
  { id: "g1", name: "Los Crack del 26", inviteCode: "CRACK26", memberCount: 12, myRank: 1, myPoints: 0, createdBy: "Carlos Andrés", createdAt: "2026-05-01T00:00:00Z" },
  { id: "g2", name: "Mundialeros", inviteCode: "MUND26", memberCount: 8, myRank: 2, myPoints: 0, createdBy: "María López", createdAt: "2026-05-02T00:00:00Z" },
  { id: "g3", name: "Fútbol Amigos", inviteCode: "FUT26", memberCount: 15, myRank: 3, myPoints: 0, createdBy: "Pedro Gómez", createdAt: "2026-04-28T00:00:00Z" },
  { id: "g4", name: "Oficina United", inviteCode: "OFIC26", memberCount: 6, myRank: 4, myPoints: 0, createdBy: "Ana Martínez", createdAt: "2026-05-05T00:00:00Z" },
];

export const mockGroupDetail = {
  ...mockGroups[0],
  members: [
    { userId: "u-0", name: "Carlos Andrés", avatar: "CA", points: 0, rank: 1, joinedAt: "2026-05-01T00:00:00Z" },
    { userId: "u-1", name: "José Fernández", avatar: "JF", points: 0, rank: 2, joinedAt: "2026-05-01T12:00:00Z" },
    { userId: "u-2", name: "Gabriela Acosta", avatar: "GA", points: 0, rank: 3, joinedAt: "2026-05-01T14:00:00Z" },
    { userId: "u-3", name: "Lucas Torres", avatar: "LT", points: 0, rank: 4, joinedAt: "2026-05-02T10:00:00Z" },
    { userId: "u-4", name: "Fernanda Cruz", avatar: "FC", points: 0, rank: 5, joinedAt: "2026-05-02T16:00:00Z" },
  ],
};

export const mockAdminStats = {
  totalUsers: 50240,
  activeUsers: 38400,
  totalGroups: 8240,
  totalMatches: 104,
  totalPredictions: 891200,
  matchesFinished: 0,
  matchesUpcoming: 104,
  predictionsToday: 3400,
};

export const mockAdminUsers = Array.from({ length: 10 }, (_, i) => ({
  id: `admin-u-${i}`,
  name: ["Carlos Andrés", "María López", "Pedro Gómez", "Ana Martínez", "José Fernández", "Gabriela Acosta", "Lucas Torres", "Fernanda Cruz", "Diego Ramírez", "Valentina Ruiz"][i],
  email: [`carlos@example.com`, `maria@example.com`, `pedro@example.com`, `ana@example.com`, `jose@example.com`, `gabriela@example.com`, `lucas@example.com`, `fernanda@example.com`, `diego@example.com`, `valentina@example.com`][i],
  country: ["MX", "MX", "ES", "CO", "CL", "UY", "BR", "EC", "PE", "AR"][i],
  status: (i < 8 ? "active" : "blocked") as "active" | "blocked",
  points: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0][i],
  predictionsCount: [2, 1, 3, 2, 0, 1, 2, 0, 1, 0][i],
  groupsCount: [3, 2, 4, 2, 3, 1, 3, 2, 1, 2][i],
  createdAt: "2026-05-01T00:00:00Z",
}));

export const mockAdminGroups = Array.from({ length: 8 }, (_, i) => ({
  id: `ag-${i}`,
  name: ["Los Crack del 26", "Mundialeros", "Fútbol Amigos", "Oficina United", "La Pizarra FC", "Gol de Media", "Cancha Libre", "Selección Nacional"][i],
  inviteCode: ["CRACK26", "MUND26", "FUT26", "OFIC26", "PIZ26", "MED26", "CAN26", "SEL26"][i],
  memberCount: [12, 8, 15, 6, 10, 7, 14, 9][i],
  myRank: null,
  myPoints: null,
  createdBy: ["Carlos Andrés", "María López", "Pedro Gómez", "Ana Martínez", "Luis Pérez", "Sofía Vega", "Jorge Mora", "Carla Ríos"][i],
  createdAt: "2026-05-01T00:00:00Z",
}));

export const mockAdminMatches = allMatches.map((m) => ({
  ...m,
  homeScore: m.homeScore,
  awayScore: m.awayScore,
  groupName: m.groupName,
}));

export const mockRules = [
  { key: "exact_score", label: "Marcador exacto", points: 5, enabled: true },
  { key: "correct_winner", label: "Acertar ganador o empate", points: 3, enabled: true },
  { key: "incorrect", label: "Fallar", points: 0, enabled: true },
  { key: "correct_goal_diff", label: "Acertar diferencia de goles", points: 4, enabled: false },
  { key: "knockout_bonus", label: "Bonus fase eliminatoria", points: 2, enabled: true },
];
