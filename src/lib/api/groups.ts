// Dominio: grupos de quiniela (F3 — integrado al backend real /groups/*).
//
// Mapea los DTO snake_case del backend Go al modelo camelCase del frontend.
//
// DECISIÓN — "inviteCode" compuesto:
// El backend une por `POST /groups/:id/join {token}`, es decir necesita el id
// del grupo Y el invite_token. El frontend, en cambio, maneja un único string
// "código de invitación" (el campo Group.inviteCode que se muestra/comparte).
// Para no cambiar la UI ni los tipos, codificamos AMBOS datos en ese único
// string como `${group.id}.${invite_token}`. Al unirse lo parseamos: separamos
// por el PRIMER ".", el primer segmento es el id y el resto (re-unido por ".")
// es el token (un UUID puede no contener ".", pero el split defensivo lo
// soporta igual). Así el link de invitación sigue siendo un solo "código".
import type { Group, GroupDetail, GroupMember } from "@/types";
import { rawRequest, request } from "./client";

// DTO del backend (contrato F3).
export interface GroupResponse {
  id: string;
  name: string;
  owner_user_id: string;
  invite_token?: string;
  invite_expires_at?: string;
  max_members: number;
  member_count: number;
  closes_at?: string;
  is_open: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupMemberResponse {
  user_id: string;
  email: string;
  is_owner: boolean;
  joined_at: string;
}

// Genera el avatar (iniciales) a partir del email, ya que el backend de
// miembros solo expone email. Las stats per-grupo (points/rank) llegan en otro
// módulo (leaderboard de grupo, F4/F5); por ahora 0.
function avatarFromEmail(email: string): string {
  return email.slice(0, 2).toUpperCase();
}

export function mapGroup(g: GroupResponse): Group {
  // inviteCode compuesto: solo lo armamos si el backend nos dio el token
  // (solo el owner lo recibe). Para no-owners queda "" y la UI no muestra
  // código compartible.
  const inviteCode = g.invite_token ? `${g.id}.${g.invite_token}` : "";
  return {
    id: g.id,
    name: g.name,
    inviteCode,
    memberCount: g.member_count,
    myRank: null, // las stats per-grupo llegan en otro módulo
    myPoints: null,
    createdBy: g.owner_user_id,
    createdAt: g.created_at,
  };
}

export function mapMember(m: GroupMemberResponse): GroupMember {
  return {
    userId: m.user_id,
    name: m.email,
    avatar: avatarFromEmail(m.email),
    points: 0,
    rank: 0,
    joinedAt: m.joined_at,
  };
}

export const groupsApi = {
  getGroups: async (): Promise<{ groups: Group[] }> => {
    const res = await request<GroupResponse[]>("/groups/mine");
    return { groups: res.map(mapGroup) };
  },

  getGroup: async (id: string): Promise<{ group: GroupDetail }> => {
    const [group, members] = await Promise.all([
      request<GroupResponse>(`/groups/${id}`),
      request<GroupMemberResponse[]>(`/groups/${id}/members`),
    ]);
    return {
      group: {
        ...mapGroup(group),
        members: members.map(mapMember),
      },
    };
  },

  createGroup: async (data: { name: string }): Promise<{ group: Group }> => {
    const res = await request<GroupResponse>("/groups", {
      method: "POST",
      body: JSON.stringify({ name: data.name }),
    });
    return { group: mapGroup(res) };
  },

  // joinGroup recibe el inviteCode compuesto `${id}.${token}` (ver nota arriba).
  joinGroup: async (data: { inviteCode: string }): Promise<{ group: Group }> => {
    const raw = data.inviteCode.trim();
    const dot = raw.indexOf(".");
    if (dot === -1) {
      throw new Error("Código de invitación inválido");
    }
    const id = raw.slice(0, dot);
    const token = raw.slice(dot + 1);
    if (!id || !token) {
      throw new Error("Código de invitación inválido");
    }

    // El backend devuelve 200 (posiblemente con body vacío); usamos rawRequest
    // para no forzar el parseo JSON del helper request().
    const res = await rawRequest(`/groups/${id}/join`, {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || `HTTP ${res.status}`);
    }

    // Re-leemos el grupo ya unido para devolver el modelo actualizado.
    const group = await request<GroupResponse>(`/groups/${id}`);
    return { group: mapGroup(group) };
  },
};
