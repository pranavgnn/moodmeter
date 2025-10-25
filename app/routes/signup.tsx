import type { Route } from "./+types/signup";
import { useFetcher, useNavigate } from "react-router";
import { useEffect, useState } from "react";
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
import { CheckCircle, XCircle } from "lucide-react";

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!username?.trim() || !email?.trim() || !password?.trim()) {
    return { error: "All fields are required" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  try {
    const { data: existingUser, error: checkError } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username.trim())
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      throw checkError;
    }

    if (existingUser) {
      return { error: "Username is already taken" };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          username: username.trim(),
        },
      },
    });

    if (error) {
      throw error;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        username: username.trim(),
        email: email.trim(),
      });

      if (profileError) {
        console.error("Profile creation error:", profileError);
      }
    }

    return {
      success: true,
      message: "Account created successfully! You can now log in.",
    };
  } catch (error) {
    console.error("Signup error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export default function Signup() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [usernameCheckTimeout, setUsernameCheckTimeout] =
    useState<NodeJS.Timeout | null>(null);

  const checkUsernameAvailability = async (usernameToCheck: string) => {
    if (!usernameToCheck.trim()) {
      setIsUsernameAvailable(null);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", usernameToCheck.trim())
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Username check error:", error);
        setIsUsernameAvailable(null);
        return;
      }

      setIsUsernameAvailable(!data);
    } catch (error) {
      console.error("Username check error:", error);
      setIsUsernameAvailable(null);
    }
  };

  const handleUsernameChange = (value: string) => {
    setUsername(value);

    if (usernameCheckTimeout) {
      clearTimeout(usernameCheckTimeout);
    }

    const timeout = setTimeout(() => {
      checkUsernameAvailability(value);
    }, 500);

    setUsernameCheckTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      if (usernameCheckTimeout) {
        clearTimeout(usernameCheckTimeout);
      }
    };
  }, [usernameCheckTimeout]);

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
      navigate("/login");
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Create your account to start tracking your mood.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  className={
                    isUsernameAvailable === false
                      ? "border-destructive"
                      : isUsernameAvailable === true
                      ? "border-green-500"
                      : ""
                  }
                />
                {isUsernameAvailable !== null && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isUsernameAvailable ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                  </div>
                )}
              </div>
              {isUsernameAvailable === false && (
                <p className="text-sm text-destructive">
                  Username is already taken
                </p>
              )}
              {isUsernameAvailable === true && (
                <p className="text-sm text-green-600">Username is available</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={6}
              />
            </div>
            {fetcher.data?.error && (
              <p className="text-destructive text-sm">{fetcher.data.error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={
                fetcher.state === "submitting" || isUsernameAvailable === false
              }
            >
              {fetcher.state === "submitting"
                ? "Creating Account..."
                : "Sign Up"}
            </Button>
          </fetcher.Form>
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
