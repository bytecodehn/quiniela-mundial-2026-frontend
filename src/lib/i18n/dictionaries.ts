/**
 * Diccionarios de copy traducibles. Cada locale tiene la MISMA shape
 * (TypeScript fuerza la igualdad estructural via Dictionary).
 *
 * Estrategia incremental: empezamos por nav + auth + common + acciones
 * principales. Cada PR puede migrar más strings a través de useT().
 */

export type Locale = "es" | "en" | "pt-BR";

export const SUPPORTED_LOCALES: Locale[] = ["es", "en", "pt-BR"];

export const LOCALE_LABELS: Record<Locale, string> = {
  es: "Español",
  en: "English",
  "pt-BR": "Português (BR)",
};

const es = {
  nav: {
    dashboard: "Dashboard",
    matches: "Partidos",
    predictions: "Predicciones",
    leaderboard: "Ranking",
    groups: "Grupos",
    profile: "Perfil",
    admin: "Admin",
    logout: "Cerrar sesión",
  },
  auth: {
    login: "Iniciar sesión",
    register: "Crear cuenta",
    demoAccount: "Usar cuenta demo",
    welcome: "Bienvenido",
  },
  common: {
    save: "Guardar",
    cancel: "Cancelar",
    loading: "Cargando...",
    delete: "Eliminar",
    edit: "Editar",
    close: "Cerrar",
    retry: "Reintentar",
    settings: "Ajustes",
    language: "Idioma",
  },
  dashboard: {
    upcomingTitle: "Próximos por cerrar",
    lastResultsTitle: "Últimos resultados",
    closingSoon: "Cierra pronto",
    quickAccess: "Acceso rápido",
  },
  predictions: {
    predict: "Predecir",
    edit: "Editar",
    predicted: "Predicho",
    saved: "Predicción guardada",
  },
  groups: {
    title: "Mis Grupos",
    createGroup: "Crear grupo",
    joinGroup: "Unirse a grupo",
    inviteCode: "Código de invitación",
    shareLink: "Compartir link",
    members: "Miembros",
  },
};

const en: typeof es = {
  nav: {
    dashboard: "Dashboard",
    matches: "Matches",
    predictions: "Predictions",
    leaderboard: "Leaderboard",
    groups: "Groups",
    profile: "Profile",
    admin: "Admin",
    logout: "Sign out",
  },
  auth: {
    login: "Sign in",
    register: "Create account",
    demoAccount: "Use demo account",
    welcome: "Welcome",
  },
  common: {
    save: "Save",
    cancel: "Cancel",
    loading: "Loading...",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    retry: "Retry",
    settings: "Settings",
    language: "Language",
  },
  dashboard: {
    upcomingTitle: "Closing soon",
    lastResultsTitle: "Latest results",
    closingSoon: "Closing soon",
    quickAccess: "Quick access",
  },
  predictions: {
    predict: "Predict",
    edit: "Edit",
    predicted: "Predicted",
    saved: "Prediction saved",
  },
  groups: {
    title: "My Groups",
    createGroup: "Create group",
    joinGroup: "Join group",
    inviteCode: "Invite code",
    shareLink: "Share link",
    members: "Members",
  },
};

const ptBR: typeof es = {
  nav: {
    dashboard: "Painel",
    matches: "Partidas",
    predictions: "Palpites",
    leaderboard: "Ranking",
    groups: "Grupos",
    profile: "Perfil",
    admin: "Admin",
    logout: "Sair",
  },
  auth: {
    login: "Entrar",
    register: "Criar conta",
    demoAccount: "Usar conta demo",
    welcome: "Bem-vindo",
  },
  common: {
    save: "Salvar",
    cancel: "Cancelar",
    loading: "Carregando...",
    delete: "Excluir",
    edit: "Editar",
    close: "Fechar",
    retry: "Tentar de novo",
    settings: "Configurações",
    language: "Idioma",
  },
  dashboard: {
    upcomingTitle: "Próximos a fechar",
    lastResultsTitle: "Últimos resultados",
    closingSoon: "Fecha em breve",
    quickAccess: "Acesso rápido",
  },
  predictions: {
    predict: "Palpitar",
    edit: "Editar",
    predicted: "Palpite",
    saved: "Palpite salvo",
  },
  groups: {
    title: "Meus Grupos",
    createGroup: "Criar grupo",
    joinGroup: "Entrar em grupo",
    inviteCode: "Código do convite",
    shareLink: "Compartilhar link",
    members: "Membros",
  },
};

export type Dictionary = typeof es;

export const dictionaries: Record<Locale, Dictionary> = {
  es,
  en,
  "pt-BR": ptBR,
};
