import { useNavigate } from "react-router-dom";
import type { LeaderboardEntry } from "@/pages/Leaderboard";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  category: "total" | "bench" | "squat" | "deadlift";
}

const categoryLabels = {
  total: "Total Leaderboard",
  bench: "Bench Press Leaderboard",
  squat: "Squat Leaderboard",
  deadlift: "Deadlift Leaderboard",
};

const getMedalEmoji = (rank: number) => {
  switch (rank) {
    case 1:
      return "🥇";
    case 2:
      return "🥈";
    case 3:
      return "🥉";
    default:
      return null;
  }
};

const LeaderboardTable = ({ entries, category }: LeaderboardTableProps) => {
  const navigate = useNavigate();

  if (entries.length === 0) {
    return (
      <div className="bg-card rounded-lg overflow-hidden border border-border shadow-sm">
        <div className="leaderboard-header">
          {categoryLabels[category]} 🏆
        </div>
        <div className="py-12 text-center text-muted-foreground">
          <p>No verified lifts yet.</p>
          <p className="text-sm mt-2">Be the first to submit a lift!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl overflow-hidden border border-border/70 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="leaderboard-header rounded-t-xl">
        {categoryLabels[category]} 🏆
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/20">
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground tracking-wide">
                Rank
              </th>
              <th className="text-left py-4 px-6 text-sm font-medium text-muted-foreground tracking-wide">
                Name
              </th>
              <th className="text-center py-4 px-6 text-sm font-medium text-muted-foreground tracking-wide">
                Weight (lbs)
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => {
              const rank = index + 1;
              const medal = getMedalEmoji(rank);

              return (
                <tr
                  key={entry.id}
                  onClick={() => navigate(`/profile/${entry.user_id}`)}
                  className="leaderboard-row transition-all duration-200 hover:bg-muted/40 cursor-pointer"
                >
                  <td className="py-5 px-6">
                    <span className="flex items-center gap-2 font-medium">
                      {medal && <span className="text-lg transition-transform duration-200 hover:scale-125">{medal}</span>}
                      <span className={rank <= 3 ? "text-primary font-semibold" : "text-foreground"}>
                        {rank}
                      </span>
                    </span>
                  </td>
                  <td className="py-5 px-6 font-medium text-foreground">{entry.name}</td>
                  <td className="py-5 px-6 text-center font-semibold text-foreground">
                    {entry.weight.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardTable;
