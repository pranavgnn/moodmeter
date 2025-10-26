import type { LoaderFunctionArgs } from "react-router";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "react-router";
import { useLoaderData, useNavigate } from "react-router";
import { useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { CheckCircle, ArrowRight, XCircle, RefreshCw } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/";

  const url = new URL(request.url);
  const hash = url.hash.substring(1);
  const errorParams = new URLSearchParams(hash);
  const error = errorParams.get("error");
  const errorCode = errorParams.get("error_code");
  const errorDescription = errorParams.get("error_description");

  if (error) {
    return {
      success: false,
      error: errorDescription || "Verification failed",
      errorCode,
    };
  }

  const supabase = createServerClient(
    process.env.VITE_PUBLIC_SUPABASE_URL!,
    process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return (
            request.headers
              .get("cookie")
              ?.split(";")
              .map((c: string) => {
                const [name, value] = c.trim().split("=");
                return { name, value };
              }) || []
          );
        },
        setAll(cookies: { name: string; value: string; options: any }[]) {},
      },
    }
  );

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next);
    }
  } else if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });

    if (!error) {
      if (type === "email") {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ email_verified: true })
            .eq("id", user.id);

          if (profileError && profileError.code === "PGRST116") {
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                username: user.user_metadata?.username || "",
                email: user.email || "",
                email_verified: true,
              });
          } else if (profileError) {
            console.error("Failed to update profile:", profileError);
          }
        }
      }
      return { success: true, type, next };
    }
  }

  return { success: false, error: "Verification failed" };
}

export default function AuthConfirm() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!data.success && window.location.hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }
  }, [data.success]);

  if (!data.success) {
    const isExpiredLink = data.errorCode === "otp_expired";
    const isInvalidLink = data.errorCode === "access_denied";

    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-lg shadow-lg border-0 bg-card/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-xl font-bold text-destructive">
              {isExpiredLink
                ? "Link Expired"
                : isInvalidLink
                ? "Invalid Link"
                : "Verification Failed"}
            </CardTitle>
            <CardDescription className="text-base">
              {data.error || "There was an error verifying your email."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-lg bg-muted/50 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                {isExpiredLink
                  ? "This verification link has expired. Please request a new one."
                  : isInvalidLink
                  ? "This verification link is invalid or has already been used."
                  : "Please try again or contact support if the problem persists."}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={() => navigate("/login")} className="w-full">
                <ArrowRight className="mr-2 h-4 w-4" />
                Go to Login
              </Button>

              {isExpiredLink && (
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  className="w-full"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Request New Verification Email
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-card/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle className="h-8 w-8 text-emerald-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Email Verified</CardTitle>
          <CardDescription className="text-base">
            Your email has been successfully verified. You can now log in to
            your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-4 border border-emerald-200 dark:border-emerald-800">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Account activated and ready to use
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <Button onClick={() => navigate("/login")} className="w-full">
              <ArrowRight className="mr-2 h-4 w-4" />
              Continue to Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
