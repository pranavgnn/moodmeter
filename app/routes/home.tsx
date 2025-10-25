import type { Route } from "./+types/home";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Topbar } from "~/components/topbar";
import { Brain, BarChart3, Lightbulb } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MoodMeter - Discover Your Emotional Landscape" },
    {
      name: "description",
      content:
        "AI-powered mood analysis to help you understand and improve your emotional well-being. Get personalized insights and practical suggestions.",
    },
  ];
}

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    setIsLoggedIn(!!token);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <Topbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-primary/5 via-transparent to-primary/5"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-primary">
                AI-Powered Emotional Intelligence
              </span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 bg-linear-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent">
              Discover Your
              <br />
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Emotional Landscape
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-muted-foreground mb-8 leading-relaxed max-w-3xl mx-auto">
              Transform your self-awareness with AI-powered mood analysis.
              Understand your emotions, track patterns, and get personalized
              suggestions to feel better.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isLoggedIn ? (
                <Link to="/prompt">
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Go to Prompt
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Start Your Journey
                  </Button>
                </Link>
              )}
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg"
                onClick={scrollToFeatures}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Why Choose MoodMeter?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of emotional wellness with cutting-edge AI
              technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced AI understands your emotions with remarkable
                  accuracy, providing deep insights into your mood patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Visual Insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Beautiful charts and visualizations help you understand your
                  emotional data at a glance.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Personalized Tips</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get actionable suggestions tailored to your unique emotional
                  state and circumstances.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to emotional clarity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-2xl font-bold mb-4">Share Your Thoughts</h3>
              <p className="text-muted-foreground leading-relaxed">
                Describe how you're feeling or what's on your mind. Be as
                detailed or brief as you like.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Analysis</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our advanced AI processes your input and identifies the emotions
                you're experiencing.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Get Insights</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive beautiful visualizations and personalized suggestions to
                improve your mood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-linear-to-r from-card to-card/80 backdrop-blur-sm">
            <CardContent className="p-12 lg:p-16 text-center">
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                Ready to Understand Yourself Better?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands who have discovered new insights about their
                emotional well-being.
              </p>
              {isLoggedIn ? (
                <Link to="/prompt">
                  <Button
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Go to Prompt
                  </Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button
                    size="lg"
                    className="px-12 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Get Started Now
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">MoodMeter</h3>
            <p className="text-muted-foreground text-sm">
              Empowering emotional intelligence through AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
