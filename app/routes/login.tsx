import type { Route } from "./+types/login";
import { useFetcher, useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { supabase } from "~/lib/supabase";
import { toast } from "sonner";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username?.trim() || !password?.trim()) {
    return { error: "Username and password are required" };
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, email_verified")
      .eq("username", username.trim())
      .single();

    if (profileError || !profile) {
      return { error: "Invalid username or password" };
    }

    // Check if email is verified before attempting login
    if (!profile.email_verified) {
      return {
        error: "Please verify your email before logging in",
        needsVerification: true,
        email: profile.email,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();

      if (profileError) {
        console.error("Profile fetch error:", profileError);
      }

      return {
        success: true,
        token: data.session?.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          username: userProfile?.username || data.user.user_metadata?.username,
        },
      };
    }
  } catch (error) {
    console.error("Login error:", error);
    return {
      error: error instanceof Error ? error.message : "Failed to log in",
    };
  }
}

export default function Login() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("auth");
    if (token) {
      navigate("/prompt");
      return;
    }
  }, [navigate]);

  useEffect(() => {
    if (fetcher.data?.success && fetcher.data.token) {
      localStorage.setItem("auth", fetcher.data.token);
      toast.success("Login successful");
      navigate("/prompt");
    } else if (fetcher.data?.error && !fetcher.data.needsVerification) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, navigate]);

  const handleResendVerification = async () => {
    if (!fetcher.data?.email) return;

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: fetcher.data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
        },
      });

      if (error) {
        toast.error("Failed to resend verification email");
        console.error("Resend error:", error);
      } else {
        toast.success("Verification email sent! Check your inbox.");
      }
    } catch (error) {
      toast.error("Failed to resend verification email");
      console.error("Resend error:", error);
    }
  };

  // Show verification screen if user needs to verify email
  if (fetcher.data?.needsVerification) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background to-muted/20 p-4">
        <Card className="w-full max-w-lg shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-base">
              We've sent a verification link to activate your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Verification email sent to:
              </p>
              <p className="text-lg font-semibold text-foreground break-all">
                {fetcher.data.email}
              </p>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Click the verification link in your email to complete your
                  registration and start using MoodMeter.
                </p>
              </div>

              <div className="rounded-lg border border-dashed border-muted-foreground/25 p-4 bg-muted/20">
                <h4 className="text-sm font-medium mb-2 text-center">
                  Didn't receive the email?
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure the email address is correct</li>
                  <li>• Try refreshing this page to resend</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button
                onClick={handleResendVerification}
                className="w-full"
                disabled={fetcher.state === "submitting"}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>

              <Button
                onClick={() => navigate("/")}
                variant="ghost"
                className="w-full"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Need help? Contact support if you're still having issues.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" type="text" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            {fetcher.data?.error && !fetcher.data.needsVerification && (
              <p className="text-destructive text-sm">{fetcher.data.error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting" ? "Logging in..." : "Login"}
            </Button>
          </fetcher.Form>
          <div className="mt-4 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              <a
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot Password?
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <a href="/signup" className="text-primary hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
