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
import jwt from "jsonwebtoken";
import { toast } from "sonner";

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("VITE_JWT_SECRET environment variable is required");
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username === "test" && password === "test") {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
    return { success: true, token };
  } else {
    return { error: "Invalid username or password" };
  }
}

export default function Login() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to prompt if already logged in
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
        </CardContent>
      </Card>
    </div>
  );
}
