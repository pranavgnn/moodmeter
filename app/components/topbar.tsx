import { Button } from "~/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { Theater, LogOut, LogIn } from "lucide-react";
import { toast } from "sonner";
import ThemeToggle from "~/components/theme-toggle";

export function Topbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth");
    setIsLoggedIn(!!token);

    // Listen for storage changes (in case login/logout happens in another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem("auth");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-linear-to-br from-primary via-primary/80 to-primary/60 shadow-lg flex items-center justify-center">
                  <Theater className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 border-2 border-background"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                  MoodMeter
                </h1>
              </div>
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button
                onClick={handleLogout}
                variant="ghost"
                size="sm"
                className="h-9 px-4 text-sm font-medium hover:bg-destructive/10 hover:text-destructive transition-all duration-200 rounded-lg"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            ) : (
              <Link to="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-4 text-sm font-medium hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-lg"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
