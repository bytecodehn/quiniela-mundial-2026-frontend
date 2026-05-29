// Dominio: grupos de quiniela. PENDIENTE F3: migrar a /groups/* del backend
// (invite_token en vez de inviteCode, POST /groups/:id/join) + contexto de
// "grupo activo".
import type { Group, GroupDetail } from "@/types";
import { request } from "./client";

export const groupsApi = {
  getGroups: () => request<{ groups: Group[] }>("/groups"),

  getGroup: (id: string) => request<{ group: GroupDetail }>(`/groups/${id}`),

  createGroup: (data: { name: string }) =>
    request<{ group: Group }>("/groups", { method: "POST", body: JSON.stringify(data) }),

  joinGroup: (data: { inviteCode: string }) =>
    request<{ group: Group }>("/groups/join", { method: "POST", body: JSON.stringify(data) }),
};
