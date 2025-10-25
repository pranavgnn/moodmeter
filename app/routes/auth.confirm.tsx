import type { LoaderFunctionArgs } from "react-router";
import { createServerClient } from "@supabase/ssr";
import { redirect } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") || "/";

  const supabase = createServerClient(
    process.env.VITE_PUBLIC_SUPABASE_URL!,
    process.env.VITE_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.headers
            .get("cookie")
            ?.split(";")
            .map((c) => {
              const [name, value] = c.trim().split("=");
              return { name, value };
            }) || [];
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
    // Handle OTP flow (password reset, email confirmation)
    const { error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any,
    });
    if (!error) {
      return redirect(next);
    }
  }

  // If there's an error, redirect to login
  return redirect("/login");
}