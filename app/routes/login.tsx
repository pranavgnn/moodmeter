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
      .select("email")
      .eq("username", username.trim())
      .single();

    if (profileError || !profile) {
      return { error: "Invalid username or password" };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: profile.email,
      password,
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const { data: profile, error: profileError } = await supabase
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
          username: profile?.username || data.user.user_metadata?.username,
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
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, navigate]);

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
            {fetcher.data?.error && (
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
