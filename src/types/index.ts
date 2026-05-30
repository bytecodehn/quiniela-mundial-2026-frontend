export type UserRole = "user" | "admin";
export type UserStatus = "active" | "blocked";
export type MatchStatus = "upcoming" | "live" | "finished";
export type MatchStage = "group" | "round_of_32" | "round_of_16" | "quarterfinal" | "semifinal" | "final" | "third_place";
export type PredictionStatus = "pending" | "correct" | "incorrect" | "exact";
export type GroupName = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  favoriteTeam: string;
  country: string;
  status: UserStatus;
  role: UserRole;
  points: number;
  globalRank: number;
  predictionsCount: number;
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  code: string;
  flag: string;
  group: GroupName;
  rank: number;
}

export interface Match {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  stage: MatchStage;
  groupName: GroupName | null;
  stadium: string;
  date: string;
  time: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
  isPredictionOpen: boolean;
  predictionDeadline: string;
  userPrediction: { homeScore: number; awayScore: number; status: PredictionStatus } | null;
}

export interface Prediction {
  id: string;
  match: Pick<Match, "id" | "homeTeam" | "awayTeam" | "date" | "time" | "status" | "homeScore" | "awayScore">;
  predictedHomeScore: number;
  predictedAwayScore: number;
  points: number | null;
  status: PredictionStatus;
  createdAt: string;
}

export interface PredictionStats {
  totalPoints: number;
  globalRank: number;
  groupRank: number | null;
  groupId: string | null;
  groupName: string | null;
  predictionsPending: number;
  predictionsTotal: number;
  exactCount: number;
  correctCount: number;
  lastResults: Array<{
    match: Pick<Match, "id" | "homeTeam" | "awayTeam" | "date" | "time" | "homeScore" | "awayScore">;
    prediction: Pick<Prediction, "predictedHomeScore" | "predictedAwayScore" | "status">;
    points: number;
  }>;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string;
  points: number;
  correctPredictions: number;
  exactPredictions: number;
  totalPredictions: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardEntry[];
  currentUser: LeaderboardEntry;
  pagination: Pagination;
}

export interface Group {
  id: string;
  name: string;
  inviteCode: string;
  memberCount: number;
  myRank: number | null;
  myPoints: number | null;
  createdBy: string;
  createdAt: string;
}

export interface GroupDetail extends Group {
  members: GroupMember[];
}

export interface GroupMember {
  userId: string;
  name: string;
  avatar: string;
  points: number;
  rank: number;
  joinedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalGroups: number;
  totalMatches: number;
  totalPredictions: number;
  matchesFinished: number;
  matchesUpcoming: number;
  predictionsToday: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  country: string;
  status: UserStatus;
  points: number;
  predictionsCount: number;
  groupsCount: number;
  createdAt: string;
}

export interface AdminMatch {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  stage: MatchStage;
  groupName: GroupName | null;
  stadium: string;
  date: string;
  time: string;
  status: MatchStatus;
  homeScore: number | null;
  awayScore: number | null;
}

export interface ScoringRule {
  key: string;
  label: string;
  points: number;
  enabled: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  pagination?: Pagination;
}
