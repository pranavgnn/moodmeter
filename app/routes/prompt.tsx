import type { Route } from "./+types/prompt";
import { useFetcher, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Topbar } from "~/components/topbar";
import { PromptInput } from "~/components/prompt-input";
import { analyzeMoodPrompt } from "~/utils/mood-analysis";
import { toast } from "sonner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Prompt | MoodMeter" },
    {
      name: "description",
      content: "Analyze your mood and get personalized insights",
    },
  ];
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const prompt = formData.get("prompt") as string;

  if (!prompt?.trim()) {
    return { error: "Please enter some text to analyze" };
  }

  try {
    const analysis = await analyzeMoodPrompt(prompt.trim());
    return { success: true, analysis };
  } catch (error) {
    console.error("Analysis error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to analyze mood",
    };
  }
}

export default function Prompt() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");

  // Handle fetcher response
  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.analysis) {
      // Navigate to results page with analysis data
      navigate("/result", { state: { analysis: fetcher.data.analysis } });
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Topbar />
      <PromptInput
        prompt={prompt}
        onPromptChange={setPrompt}
        fetcher={fetcher}
      />
    </div>
  );
}
