export const mockUser = {
  id: "user-1",
  name: "Carlos Andrés",
  email: "carlos@example.com",
  avatar: "CA",
  favoriteTeam: "Argentina",
  country: "AR",
  status: "active" as const,
  role: "user" as const,
  points: 284,
  globalRank: 1,
  predictionsCount: 38,
  createdAt: "2026-05-01T00:00:00Z",
};

export const mockAdminUser = { ...mockUser, role: "admin" as const, name: "Admin Master", avatar: "AM", email: "admin@quiniela.com" };

const teams = [
  { id: "t1", name: "Argentina", code: "ARG", flag: "🇦🇷", group: "A" as const, rank: 1 },
  { id: "t2", name: "Brasil", code: "BRA", flag: "🇧🇷", group: "A" as const, rank: 5 },
  { id: "t3", name: "Uruguay", code: "URU", flag: "🇺🇾", group: "A" as const, rank: 11 },
  { id: "t4", name: "Chile", code: "CHI", flag: "🇨🇱", group: "A" as const, rank: 25 },
  { id: "t5", name: "España", code: "ESP", flag: "🇪🇸", group: "B" as const, rank: 8 },
  { id: "t6", name: "Alemania", code: "GER", flag: "🇩🇪", group: "B" as const, rank: 10 },
  { id: "t7", name: "Francia", code: "FRA", flag: "🇫🇷", group: "C" as const, rank: 2 },
  { id: "t8", name: "Inglaterra", code: "ENG", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", group: "C" as const, rank: 4 },
  { id: "t9", name: "Italia", code: "ITA", flag: "🇮🇹", group: "D" as const, rank: 9 },
  { id: "t10", name: "Países Bajos", code: "NED", flag: "🇳🇱", group: "D" as const, rank: 7 },
];

export function makeTeam(name: string, code: string, flag: string, group: string, rank: number) {
  return { id: `t-${code}`, name, code, flag, group, rank };
}

export const mockMatches = [
  { id: "m1", homeTeam: teams[0], awayTeam: teams[1], stage: "group" as const, groupName: "A" as const, stadium: "Estadio Monumental, Buenos Aires", date: "2026-06-14", time: "16:00", status: "upcoming" as const, homeScore: null, awayScore: null, isPredictionOpen: true, predictionDeadline: "2026-06-14T16:00:00Z", userPrediction: null },
  { id: "m2", homeTeam: teams[2], awayTeam: teams[3], stage: "group" as const, groupName: "A" as const, stadium: "Estadio Centenario, Montevideo", date: "2026-06-14", time: "19:00", status: "upcoming" as const, homeScore: null, awayScore: null, isPredictionOpen: true, predictionDeadline: "2026-06-14T19:00:00Z", userPrediction: null },
  { id: "m3", homeTeam: teams[4], awayTeam: teams[5], stage: "group" as const, groupName: "B" as const, stadium: "Estadio Santiago Bernabéu, Madrid", date: "2026-06-15", time: "15:00", status: "upcoming" as const, homeScore: null, awayScore: null, isPredictionOpen: true, predictionDeadline: "2026-06-15T15:00:00Z", userPrediction: null },
  { id: "m4", homeTeam: teams[6], awayTeam: teams[7], stage: "group" as const, groupName: "C" as const, stadium: "Stade de France, París", date: "2026-06-15", time: "21:00", status: "upcoming" as const, homeScore: null, awayScore: null, isPredictionOpen: true, predictionDeadline: "2026-06-15T21:00:00Z", userPrediction: null },
  { id: "m5", homeTeam: teams[0], awayTeam: teams[2], stage: "group" as const, groupName: "A" as const, stadium: "Estadio Monumental, Buenos Aires", date: "2026-06-18", time: "16:00", status: "upcoming" as const, homeScore: null, awayScore: null, isPredictionOpen: true, predictionDeadline: "2026-06-18T16:00:00Z", userPrediction: null },
  { id: "m6", homeTeam: teams[1], awayTeam: teams[3], stage: "group" as const, groupName: "A" as const, stadium: "Maracanã, Río de Janeiro", date: "2026-06-18", time: "21:00", status: "upcoming" as const, homeScore: null, awayScore: null, isPredictionOpen: true, predictionDeadline: "2026-06-18T21:00:00Z", userPrediction: null },
];

export const mockFinishedMatches = [
  { id: "m7", homeTeam: teams[8], awayTeam: teams[9], stage: "group" as const, groupName: "D" as const, stadium: "Estadio Olímpico, Roma", date: "2026-06-12", time: "21:00", status: "finished" as const, homeScore: 2, awayScore: 1, isPredictionOpen: false, predictionDeadline: "2026-06-12T21:00:00Z", userPrediction: { homeScore: 2, awayScore: 1, status: "exact" as const } },
  { id: "m8", homeTeam: teams[4], awayTeam: teams[9], stage: "group" as const, groupName: "B" as const, stadium: "Camp Nou, Barcelona", date: "2026-06-12", time: "18:00", status: "finished" as const, homeScore: 3, awayScore: 0, isPredictionOpen: false, predictionDeadline: "2026-06-12T18:00:00Z", userPrediction: { homeScore: 2, awayScore: 0, status: "correct" as const } },
];

export const allMatches = [...mockFinishedMatches, ...mockMatches];

export const mockPredictions = [
  { id: "p1", match: { id: "m7", homeTeam: teams[8], awayTeam: teams[9], date: "2026-06-12", time: "21:00", status: "finished" as const, homeScore: 2, awayScore: 1 }, predictedHomeScore: 2, predictedAwayScore: 1, points: 5, status: "exact" as const, createdAt: "2026-06-10T10:00:00Z" },
  { id: "p2", match: { id: "m8", homeTeam: teams[4], awayTeam: teams[9], date: "2026-06-12", time: "18:00", status: "finished" as const, homeScore: 3, awayScore: 0 }, predictedHomeScore: 2, predictedAwayScore: 0, points: 3, status: "correct" as const, createdAt: "2026-06-10T08:00:00Z" },
  { id: "p3", match: { id: "m1", homeTeam: teams[0], awayTeam: teams[1], date: "2026-06-14", time: "16:00", status: "upcoming" as const, homeScore: null, awayScore: null }, predictedHomeScore: 2, predictedAwayScore: 1, points: null, status: "pending" as const, createdAt: "2026-06-13T14:00:00Z" },
  { id: "p4", match: { id: "m3", homeTeam: teams[4], awayTeam: teams[5], date: "2026-06-15", time: "15:00", status: "upcoming" as const, homeScore: null, awayScore: null }, predictedHomeScore: 1, predictedAwayScore: 1, points: null, status: "pending" as const, createdAt: "2026-06-13T16:00:00Z" },
];

export const mockStats = {
  totalPoints: 284,
  globalRank: 1,
  groupRank: 1,
  groupId: "g1",
  groupName: "Los Crack del 26",
  predictionsPending: 8,
  predictionsTotal: 38,
  exactCount: 14,
  correctCount: 42,
  lastResults: [
    { match: mockFinishedMatches[0], prediction: { predictedHomeScore: 2, predictedAwayScore: 1, status: "exact" as const }, points: 5 },
    { match: mockFinishedMatches[1], prediction: { predictedHomeScore: 2, predictedAwayScore: 0, status: "correct" as const }, points: 3 },
  ],
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
  { id: "g1", name: "Los Crack del 26", inviteCode: "CRACK26", memberCount: 12, myRank: 1, myPoints: 284, createdBy: "Carlos Andrés", createdAt: "2026-05-01T00:00:00Z" },
  { id: "g2", name: "Mundialeros", inviteCode: "MUND26", memberCount: 8, myRank: 2, myPoints: 271, createdBy: "María López", createdAt: "2026-05-02T00:00:00Z" },
  { id: "g3", name: "Fútbol Amigos", inviteCode: "FUT26", memberCount: 15, myRank: 3, myPoints: 265, createdBy: "Pedro Gómez", createdAt: "2026-04-28T00:00:00Z" },
  { id: "g4", name: "Oficina United", inviteCode: "OFIC26", memberCount: 6, myRank: 4, myPoints: 258, createdBy: "Ana Martínez", createdAt: "2026-05-05T00:00:00Z" },
];

export const mockGroupDetail = {
  ...mockGroups[0],
  members: [
    { userId: "u-0", name: "Carlos Andrés", avatar: "CA", points: 284, rank: 1, joinedAt: "2026-05-01T00:00:00Z" },
    { userId: "u-1", name: "José Fernández", avatar: "JF", points: 271, rank: 2, joinedAt: "2026-05-01T12:00:00Z" },
    { userId: "u-2", name: "Gabriela Acosta", avatar: "GA", points: 265, rank: 3, joinedAt: "2026-05-01T14:00:00Z" },
    { userId: "u-3", name: "Lucas Torres", avatar: "LT", points: 258, rank: 4, joinedAt: "2026-05-02T10:00:00Z" },
    { userId: "u-4", name: "Fernanda Cruz", avatar: "FC", points: 252, rank: 5, joinedAt: "2026-05-02T16:00:00Z" },
  ],
};

export const mockAdminStats = {
  totalUsers: 50240,
  activeUsers: 38400,
  totalGroups: 8240,
  totalMatches: 64,
  totalPredictions: 891200,
  matchesFinished: 48,
  matchesUpcoming: 16,
  predictionsToday: 3400,
};

export const mockAdminUsers = Array.from({ length: 10 }, (_, i) => ({
  id: `admin-u-${i}`,
  name: ["Carlos Andrés", "María López", "Pedro Gómez", "Ana Martínez", "José Fernández", "Gabriela Acosta", "Lucas Torres", "Fernanda Cruz", "Diego Ramírez", "Valentina Ruiz"][i],
  email: [`carlos@example.com`, `maria@example.com`, `pedro@example.com`, `ana@example.com`, `jose@example.com`, `gabriela@example.com`, `lucas@example.com`, `fernanda@example.com`, `diego@example.com`, `valentina@example.com`][i],
  country: ["AR", "MX", "ES", "CO", "CL", "UY", "BR", "EC", "PE", "AR"][i],
  status: (i < 8 ? "active" : "blocked") as "active" | "blocked",
  points: [284, 271, 265, 258, 252, 248, 241, 237, 230, 225][i],
  predictionsCount: [38, 36, 35, 34, 33, 32, 31, 30, 29, 28][i],
  groupsCount: [3, 2, 4, 2, 3, 1, 3, 2, 1, 2][i],
  createdAt: "2026-05-01T00:00:00Z",
}));

export const mockAdminGroups = Array.from({ length: 8 }, (_, i) => ({
  id: `ag-${i}`,
  name: ["Los Crack del 26", "Mundialeros", "Fútbol Amigos", "Oficina United", "La Pizarra FC", "Gol de Media", "Cancha Libre", "Selcción Nacional"][i],
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
