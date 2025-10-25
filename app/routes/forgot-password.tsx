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
import { ArrowLeft } from "lucide-react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email") as string;

  if (!email?.trim()) {
    return { error: "Email is required" };
  }

  const origin = new URL(request.url).origin;
  const redirectUrl = `${origin}/auth/confirm?next=/reset-password`;

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: redirectUrl,
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      message: "Password reset email sent! Check your inbox.",
    };
  } catch (error) {
    console.error("Password reset error:", error);
    return {
      error:
        error instanceof Error ? error.message : "Failed to send reset email",
    };
  }
}

export default function ForgotPassword() {
  const fetcher = useFetcher<typeof action>();
  const navigate = useNavigate();

  useEffect(() => {
    if (fetcher.data?.success) {
      toast.success(fetcher.data.message);
    } else if (fetcher.data?.error) {
      toast.error(fetcher.data.error);
    }
  }, [fetcher.data]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <fetcher.Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            {fetcher.data?.error && (
              <p className="text-destructive text-sm">{fetcher.data.error}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={fetcher.state === "submitting"}
            >
              {fetcher.state === "submitting"
                ? "Sending..."
                : "Send Reset Link"}
            </Button>
          </fetcher.Form>
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
