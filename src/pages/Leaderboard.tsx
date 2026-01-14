import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import LeaderboardTabs from "@/components/leaderboard/LeaderboardTabs";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
export interface LeaderboardEntry {
  id: string;
  user_id: string;
  name: string;
  weight: number;
  lift_type: string;
}
type Category = "total" | "bench" | "squat" | "deadlift";
const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState<Category>("total");
  const navigate = useNavigate();
  const {
    isAuthenticated
  } = useAuth();
  const {
    data: leaderboardData,
    isLoading
  } = useQuery({
    queryKey: ["leaderboard", activeTab],
    queryFn: async () => {
      if (activeTab === "total") {
        // For total, we need to get the best lift for each user across all types and sum them
        const {
          data: lifts,
          error
        } = await supabase.from("lifts").select(`
            id,
            user_id,
            lift_type,
            weight,
            profiles!inner(full_name)
          `).eq("status", "verified");
        if (error) throw error;

        // Group by user and calculate total (best of each lift type)
        const userBestLifts: Record<string, {
          bench: number;
          squat: number;
          deadlift: number;
          name: string;
          user_id: string;
        }> = {};
        lifts?.forEach((lift: any) => {
          const userId = lift.user_id;
          const liftType = lift.lift_type as "bench" | "squat" | "deadlift";
          const name = lift.profiles?.full_name || "Anonymous";
          if (!userBestLifts[userId]) {
            userBestLifts[userId] = {
              bench: 0,
              squat: 0,
              deadlift: 0,
              name,
              user_id: userId
            };
          }
          if (lift.weight > userBestLifts[userId][liftType]) {
            userBestLifts[userId][liftType] = lift.weight;
          }
        });

        // Calculate totals and sort
        const entries: LeaderboardEntry[] = Object.entries(userBestLifts).map(([_, data]) => ({
          id: data.user_id,
          user_id: data.user_id,
          name: data.name,
          weight: data.bench + data.squat + data.deadlift,
          lift_type: "total"
        })).filter(entry => entry.weight > 0).sort((a, b) => b.weight - a.weight);
        return entries;
      } else {
        // For individual lifts, get best lift per user for that type
        const {
          data: lifts,
          error
        } = await supabase.from("lifts").select(`
            id,
            user_id,
            lift_type,
            weight,
            profiles!inner(full_name)
          `).eq("status", "verified").eq("lift_type", activeTab);
        if (error) throw error;

        // Group by user and get best lift
        const userBestLifts: Record<string, LeaderboardEntry> = {};
        lifts?.forEach((lift: any) => {
          const userId = lift.user_id;
          const name = lift.profiles?.full_name || "Anonymous";
          if (!userBestLifts[userId] || lift.weight > userBestLifts[userId].weight) {
            userBestLifts[userId] = {
              id: lift.id,
              user_id: userId,
              name,
              weight: lift.weight,
              lift_type: lift.lift_type
            };
          }
        });
        return Object.values(userBestLifts).sort((a, b) => b.weight - a.weight);
      }
    }
  });
  const handleSubmitClick = () => {
    if (!isAuthenticated) {
      navigate("/login", {
        state: {
          from: "/submit"
        }
      });
    } else {
      navigate("/submit");
    }
  };
  return <Layout>
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold text-primary mb-5 tracking-tight">
            Yale Strength Leaderboard
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            See how you stack up against fellow Yale students in the Big Three
            lifts—Bench, Squat, and Deadlift.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10">
          <LeaderboardTabs activeTab={activeTab} onTabChange={tab => setActiveTab(tab as Category)} />
        </div>

        {/* Leaderboard Table */}
        <div className="max-w-4xl mx-auto mb-16">
          {isLoading ? <div className="flex justify-center items-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div> : <LeaderboardTable entries={leaderboardData || []} category={activeTab} />}
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground mb-5">
            Want to get on the leaderboard? Submit your lifts for verification.
          </p>
          <Button size="lg" className="px-10 py-6 text-base font-medium rounded-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200" onClick={handleSubmitClick}>
            Submit Your Lift
          </Button>
        </div>
      </div>
    </Layout>;
};
export default Leaderboard;