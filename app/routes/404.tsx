import type { Route } from "./+types/404";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Topbar } from "~/components/topbar";
import { Home, ArrowLeft } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "404 - Page Not Found | MoodMeter" },
    {
      name: "description",
      content: "The page you're looking for doesn't exist.",
    },
  ];
}

export default function NotFound() {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />

      {/* Main Content - Perfectly Centered */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="text-center max-w-2xl mx-auto">
          {/* Massive 404 Number */}
          <div className="mb-8">
            <h1 className="text-9xl font-black text-primary leading-none select-none">
              404
            </h1>
          </div>

          {/* Message */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Page Not Found
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/">
                <Button size="lg" className="w-full sm:w-40 px-6 py-3">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Button>
              </Link>
              <Button
                variant="outline"
                size="lg"
                onClick={handleGoBack}
                className="w-full sm:w-40 px-6 py-3"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
