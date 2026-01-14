import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type LiftType = Database["public"]["Enums"]["lift_type"];

const SubmitLift = () => {
  const [liftType, setLiftType] = useState<LiftType | "">("");
  const [weight, setWeight] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Not logged in",
        description: "Please log in to submit a lift.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!liftType || !weight || !videoFile) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields and upload a video.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload video to storage
      const fileExt = videoFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('lift-videos')
        .upload(fileName, videoFile);

      if (uploadError) {
        throw new Error(`Failed to upload video: ${uploadError.message}`);
      }

      // Get public URL for the video
      const { data: { publicUrl } } = supabase.storage
        .from('lift-videos')
        .getPublicUrl(fileName);

      // Insert lift record
      const { error: insertError } = await supabase
        .from('lifts')
        .insert({
          user_id: user.id,
          lift_type: liftType as LiftType,
          weight: parseInt(weight, 10),
          video_url: publicUrl,
        });

      if (insertError) {
        throw new Error(`Failed to save lift: ${insertError.message}`);
      }

      toast({
        title: "Lift submitted!",
        description: "Your lift has been submitted for verification. You'll be notified once it's reviewed.",
      });

      // Reset form
      setLiftType("");
      setWeight("");
      setVideoFile(null);
    } catch (error) {
      toast({
        title: "Submission failed",
        description: error instanceof Error ? error.message : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-primary mb-4">
              Submit Your Lift
            </h1>
            <p className="text-lg text-muted-foreground">
              Record your PR and submit it for verification to appear on the leaderboard.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lift Details</CardTitle>
              <CardDescription>
                Provide information about your lift and upload a video for verification.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Lift Type */}
                <div className="space-y-2">
                  <Label htmlFor="liftType">Type of Lift</Label>
                  <Select value={liftType} onValueChange={(value) => setLiftType(value as LiftType)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lift type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bench">Bench Press</SelectItem>
                      <SelectItem value="squat">Squat</SelectItem>
                      <SelectItem value="deadlift">Deadlift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weight */}
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight Lifted (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="e.g., 315"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>

                {/* Video Upload */}
                <div className="space-y-2">
                  <Label>Video Submission</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="video-upload"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer">
                      <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                      {videoFile ? (
                        <p className="text-sm font-medium">{videoFile.name}</p>
                      ) : (
                        <>
                          <p className="text-sm font-medium mb-1">
                            Click to upload
                          </p>
                          <p className="text-xs text-muted-foreground">
                            MP4, MOV, or WebM (max 100MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Guidelines */}
                <div className="bg-muted rounded-lg p-4">
                  <h4 className="font-medium mb-2 text-sm">Video Guidelines</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Show full range of motion</li>
                    <li>• Weight plates must be clearly visible</li>
                    <li>• No excessive editing or cuts</li>
                    <li>• Good lighting and camera angle</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Submit for Verification"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SubmitLift;
