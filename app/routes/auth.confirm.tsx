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

  console.log("Auth confirm loader called with:", {
    code: !!code,
    token_hash: !!token_hash,
    type,
    next,
  });

  // Check for error parameters in URL hash
  const url = new URL(request.url);
  const hash = url.hash.substring(1); // Remove the '#'
  const errorParams = new URLSearchParams(hash);
  const error = errorParams.get("error");
  const errorCode = errorParams.get("error_code");
  const errorDescription = errorParams.get("error_description");

  // If there are error parameters, return error data
  if (error) {
    console.log("Error parameters found:", {
      error,
      errorCode,
      errorDescription,
    });
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
        setAll(cookies: { name: string; value: string; options: any }[]) {
          // This is a server-side loader, so we can't set cookies here
          // The client will handle the session
        },
      },
    }
  );

  if (code) {
    // Handle PKCE flow (signup/login)
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirect(next);
    }
  } else if (token_hash && type) {
    console.log("Processing OTP verification with type:", type);
    // Handle OTP flow (password reset, email confirmation)
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    console.log("OTP verification result:", {
      error: !!error,
      errorMessage: error?.message,
    });

    if (!error) {
      console.log("OTP verification successful, processing profile update");
      // If this is an email confirmation, update the profile to mark email as verified
      if (type === "email") {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        console.log("Got user:", { userId: user?.id, userEmail: user?.email });

        if (user) {
          // Try to update the profile, but don't fail if it doesn't exist yet
          const { error: profileError } = await supabase
            .from("profiles")
            .update({ email_verified: true })
            .eq("id", user.id);

          console.log("Profile update result:", {
            error: !!profileError,
            errorCode: profileError?.code,
            errorMessage: profileError?.message,
          });

          // If profile doesn't exist, try to insert it
          if (profileError && profileError.code === "PGRST116") {
            console.log("Profile not found, attempting to create it");
            const { error: insertError } = await supabase
              .from("profiles")
              .insert({
                id: user.id,
                username: user.user_metadata?.username || "",
                email: user.email || "",
                email_verified: true,
              });

            console.log("Profile insert result:", {
              error: !!insertError,
              errorMessage: insertError?.message,
            });
          } else if (profileError) {
            console.error("Failed to update profile:", profileError);
          }
        }
      }
      // Return success data instead of redirecting
      console.log("Returning success response");
      return { success: true, type, next };
    } else {
      console.error("OTP verification failed:", error);
    }
  }

  // If there's an error, return error data
  return { success: false, error: "Verification failed" };
}

export default function AuthConfirm() {
  const data = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  // Clean up URL hash if there are error parameters
  useEffect(() => {
    if (!data.success && window.location.hash) {
      // Remove error parameters from URL
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
