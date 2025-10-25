import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Textarea } from "~/components/ui/textarea";

interface PromptInputProps {
  prompt: string;
  onPromptChange: (value: string) => void;
  fetcher?: ReturnType<typeof useFetcher>;
}

export function PromptInput({
  prompt,
  onPromptChange,
  fetcher,
}: PromptInputProps) {
  // Use provided fetcher or create a new one
  const internalFetcher = useFetcher();
  const activeFetcher = fetcher || internalFetcher;

  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="text-center max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            How are you feeling?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Share your thoughts and let AI analyze your emotional landscape
          </p>
        </div>

        {/* Input Form */}
        <Card className="border-0 shadow-lg bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8">
            <activeFetcher.Form method="post" className="space-y-6">
              <Textarea
                name="prompt"
                placeholder="Tell me about your day, your emotions, your thoughts..."
                value={prompt}
                onChange={(e) => onPromptChange(e.target.value)}
                className="min-h-32 p-6 text-base resize-none border-0 focus:ring-0 bg-muted/30 rounded-xl placeholder:text-muted-foreground/60"
              />
              <Button
                type="submit"
                size="lg"
                disabled={activeFetcher.state === "submitting"}
                className="w-full h-12 text-base font-medium rounded-xl"
              >
                {activeFetcher.state === "submitting" ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                    Analyzing...
                  </>
                ) : (
                  <>Analyze My Mood</>
                )}
              </Button>
            </activeFetcher.Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
