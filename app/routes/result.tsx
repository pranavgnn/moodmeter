import { Topbar } from "~/components/topbar";
import { MoodResults } from "~/components/mood-results";
import { useLocation } from "react-router";
import type { MoodAnalysis } from "~/utils/mood-analysis";
import { AlertTriangle } from "lucide-react";

export function meta({}: any) {
  return [
    { title: "Your Mood Analysis | MoodMeter" },
    {
      name: "description",
      content: "View your detailed mood analysis and insights",
    },
  ];
}

export default function Result() {
  const location = useLocation();
  const analysis = location.state?.analysis as MoodAnalysis;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-background">
        <Topbar />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Analysis Not Available
                </h1>
                <p className="text-muted-foreground mb-6">
                  This page is only accessible after completing a mood analysis.
                  Direct access is not allowed.
                </p>
                <a
                  href="/prompt"
                  className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  Go to Prompt
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <main className="container mx-auto px-4 py-8">
        <MoodResults analysis={analysis} />
      </main>
    </div>
  );
}
