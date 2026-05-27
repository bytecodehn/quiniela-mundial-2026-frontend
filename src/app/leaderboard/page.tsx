"use client";

import { useEffect, useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Badge, Card, EmptyState, ErrorState, Select, SkeletonRows, Tabs } from "@/components/ui";
import { track } from "@/lib/analytics";
import { useGlobalLeaderboard, useGroupLeaderboard, useGroups } from "@/lib/hooks";
import type { LeaderboardEntry } from "@/types";

function Podium({ entries }: { entries: LeaderboardEntry[] }) {
  const medals = ["🥇", "🥈", "🥉"];
  const styles = [
    "border-gold bg-gold-bg/20 shadow-[0_0_30px_oklch(75%_0.15_85/0.2)] scale-105",
    "border-[#a8a8a8] bg-[oklch(70%_0.02_260/0.1)]",
    "border-[#cd7f32] bg-[oklch(50%_0.08_50/0.1)]",
  ];
  return (
    <div className="flex flex-col md:flex-row items-end justify-center gap-4 mb-8">
      {entries.map((e, i) => (
        <div
          key={e.rank}
          className={`flex flex-col items-center text-center p-6 rounded-radius-xl border-2 w-full md:w-1/3 transition-all duration-150 ${styles[i]}`}
        >
          <span className="text-[2rem] mb-1">{medals[i]}</span>
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green to-cyan grid place-items-center text-white font-bold text-[1.1rem] mb-3">
            {e.avatar}
          </div>
          <div className="text-[1.1rem] font-bold text-fg mb-1">{e.name}</div>
          <div className="text-[1.8rem] font-display font-bold text-gold mb-2">{e.points}</div>
          <div className="flex gap-3 text-[0.75rem] text-fg-muted">
            <span>{e.correctPredictions} aciertos</span>
            <span>{e.exactPredictions} exactas</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const TABS = ["Ranking Global", "Por grupo"];

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState(TABS[0]);
  const { data: groupsData, loading: groupsLoading } = useGroups();
  const [selectedGroupId, setSelectedGroupId] = useState<string | undefined>();

  const groups = groupsData?.groups ?? [];

  useEffect(() => {
    if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [groups, selectedGroupId]);

  const isGroupTab = activeTab === TABS[1];
  const globalRes = useGlobalLeaderboard();
  const groupRes = useGroupLeaderboard(isGroupTab ? selectedGroupId : undefined);

  useEffect(() => {
    track("leaderboard_viewed", {
      scope: isGroupTab ? "group" : "global",
      group_id: isGroupTab ? selectedGroupId : undefined,
    });
  }, [isGroupTab, selectedGroupId]);

  const data = isGroupTab ? groupRes.data : globalRes.data;
  const loading = isGroupTab ? groupRes.loading || groupsLoading : globalRes.loading;
  const error = isGroupTab ? groupRes.error : globalRes.error;
  const refetch = isGroupTab ? groupRes.refetch : globalRes.refetch;

  const leaderboard = data?.leaderboard ?? [];
  const currentUserId = data?.currentUser.userId;
  const noGroupsToShow = isGroupTab && !groupsLoading && groups.length === 0;

  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-[1.8rem] font-display font-bold text-fg">Leaderboard</h1>
        <p className="text-fg-secondary text-[0.95rem] mt-1">
          {isGroupTab ? "Ranking dentro de tus grupos privados" : "Clasificación global de todos los participantes"}
        </p>
      </div>

      <Tabs tabs={TABS} active={activeTab} onChange={setActiveTab} label="Tipo de ranking" />

      {isGroupTab && groups.length > 0 && (
        <div className="mb-6 max-w-xs">
          <Select
            options={groups.map((g) => ({ value: g.id, label: g.name }))}
            value={selectedGroupId ?? ""}
            onChange={setSelectedGroupId}
          />
        </div>
      )}

      {noGroupsToShow && (
        <EmptyState
          icon="👥"
          text="Todavía no estás en ningún grupo. Crea uno o únete con un código de invitación para ver el ranking grupal."
        />
      )}

      {!noGroupsToShow && loading && <SkeletonRows count={6} />}

      {!noGroupsToShow && !loading && error && <ErrorState message={error} onRetry={refetch} />}

      {!noGroupsToShow && !loading && !error && data && (
        <>
          <Podium entries={leaderboard.slice(0, 3)} />

          <Card className="overflow-hidden !p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[0.75rem] text-fg-muted uppercase tracking-wider font-semibold border-b border-border">
                    <th className="p-4 w-16">#</th>
                    <th className="p-4">Participante</th>
                    <th className="p-4 text-right">Puntos</th>
                    <th className="p-4 text-right hidden md:table-cell">Aciertos</th>
                    <th className="p-4 text-right hidden md:table-cell">Exactas</th>
                    <th className="p-4 text-right hidden sm:table-cell">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, idx) => {
                    const isMe = entry.userId === currentUserId;
                    const isPodium = idx < 3;
                    return (
                      <tr
                        key={entry.rank}
                        className={`border-b border-border transition-colors duration-150 ${
                          isMe ? "bg-green-bg/20 border-l-2 border-l-green" : "hover:bg-bg-elevated"
                        }`}
                      >
                        <td className="p-4">
                          <span className="font-bold text-[0.95rem] tabular-nums">
                            {isPodium ? ["🥇", "🥈", "🥉"][idx] : entry.rank}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green to-cyan grid place-items-center text-white font-bold text-[0.75rem] shrink-0">
                              {entry.avatar}
                            </div>
                            <div>
                              <span className="font-semibold text-[0.9rem]">{entry.name}</span>
                              {isMe && <Badge variant="green" className="ml-2">Tú</Badge>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-right font-bold text-[1rem] tabular-nums">{entry.points}</td>
                        <td className="p-4 text-right text-fg-secondary text-[0.9rem] hidden md:table-cell tabular-nums">{entry.correctPredictions}</td>
                        <td className="p-4 text-right text-fg-secondary text-[0.9rem] hidden md:table-cell tabular-nums">{entry.exactPredictions}</td>
                        <td className="p-4 text-right text-fg-muted text-[0.85rem] hidden sm:table-cell tabular-nums">{entry.totalPredictions}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </AppLayout>
  );
}
