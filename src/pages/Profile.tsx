import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, GraduationCap, Building2, Play, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Lift = Database["public"]["Tables"]["lifts"]["Row"];

const Profile = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLift, setSelectedLift] = useState<Lift | null>(null);

  useEffect(() => {
    const fetchProfileAndLifts = async () => {
      if (!id) return;

      setLoading(true);

      // Fetch profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      setProfile(profileData);

      // Fetch lifts for this user
      const { data: liftsData } = await supabase
        .from("lifts")
        .select("*")
        .eq("user_id", id)
        .order("submitted_at", { ascending: false });

      setLifts(liftsData || []);
      setLoading(false);
    };

    fetchProfileAndLifts();
  }, [id]);

  // Calculate best lifts (only verified lifts count)
  const getBestLift = (type: "bench" | "squat" | "deadlift") => {
    const verifiedLiftsOfType = lifts.filter(
      (lift) => lift.lift_type === type && lift.status === "verified"
    );
    if (verifiedLiftsOfType.length === 0) return 0;
    return Math.max(...verifiedLiftsOfType.map((lift) => lift.weight));
  };

  const bench = getBestLift("bench");
  const squat = getBestLift("squat");
  const deadlift = getBestLift("deadlift");
  const total = bench + squat + deadlift;

  const hasVerifiedLifts = lifts.some((lift) => lift.status === "verified");

  const liftTypeLabels: Record<string, string> = {
    bench: "Bench Press",
    squat: "Squat",
    deadlift: "Deadlift",
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </Layout>
    );
  }

  if (!profile) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-12 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">User not found</h1>
          <Link to="/">
            <Button>Back to Leaderboard</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Profile Header */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-primary-foreground" />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-primary mb-2">
                    {profile.full_name || "Anonymous User"}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-4 h-4" />
                      {profile.email}
                    </span>
                    {profile.class_year && (
                      <span className="flex items-center gap-1.5">
                        <GraduationCap className="w-4 h-4" />
                        Class of {profile.class_year}
                      </span>
                    )}
                    {profile.college && (
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-4 h-4" />
                        {profile.college} College
                      </span>
                    )}
                  </div>
                </div>

                {/* Total */}
                <div className="text-center md:text-right">
                  <p className="text-sm text-muted-foreground mb-1">Total</p>
                  <p className="text-4xl font-bold text-primary">
                    {total.toLocaleString()}
                  </p>
                  <span
                    className={
                      hasVerifiedLifts
                        ? "status-verified text-xs"
                        : "status-pending text-xs"
                    }
                  >
                    {hasVerifiedLifts ? "Verified" : "Pending"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Bench</p>
                <p className="text-2xl font-bold text-foreground">{bench}</p>
                <p className="text-xs text-muted-foreground">lbs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Squat</p>
                <p className="text-2xl font-bold text-foreground">{squat}</p>
                <p className="text-xs text-muted-foreground">lbs</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-sm text-muted-foreground mb-1">Deadlift</p>
                <p className="text-2xl font-bold text-foreground">{deadlift}</p>
                <p className="text-xs text-muted-foreground">lbs</p>
              </CardContent>
            </Card>
          </div>

          {/* Lift History */}
          <Card>
            <CardHeader>
              <CardTitle>Lift History</CardTitle>
            </CardHeader>
            <CardContent>
              {lifts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No lifts submitted yet
                </p>
              ) : (
                <div className="space-y-4">
                  {lifts.map((lift) => (
                    <div
                      key={lift.id}
                      className="flex items-center justify-between p-4 bg-muted rounded-lg cursor-pointer hover:bg-muted/80 transition-colors"
                      onClick={() => lift.video_url && setSelectedLift(lift)}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${lift.video_url ? 'bg-primary/10' : 'bg-muted-foreground/10'}`}>
                          <Play className={`w-5 h-5 ${lift.video_url ? 'text-primary' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <p className="font-medium">
                            {liftTypeLabels[lift.lift_type] || lift.lift_type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(lift.submitted_at).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {lift.video_url && (
                          <Button variant="ghost" size="sm" className="text-primary">
                            Watch Video
                          </Button>
                        )}
                        <span className="text-xl font-bold">{lift.weight} lbs</span>
                        <span
                          className={
                            lift.status === "verified"
                              ? "status-verified"
                              : lift.status === "rejected"
                              ? "status-rejected"
                              : "status-pending"
                          }
                        >
                          {lift.status.charAt(0).toUpperCase() + lift.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <Link to="/">
              <Button variant="outline">Back to Leaderboard</Button>
            </Link>
          </div>
        </div>

        {/* Video Dialog */}
        <Dialog open={!!selectedLift} onOpenChange={() => setSelectedLift(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>
                {selectedLift && liftTypeLabels[selectedLift.lift_type]} - {selectedLift?.weight} lbs
              </DialogTitle>
            </DialogHeader>
            {selectedLift?.video_url && (
              <div className="aspect-video w-full">
                <video
                  src={selectedLift.video_url}
                  controls
                  autoPlay
                  className="w-full h-full rounded-lg"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Profile;
