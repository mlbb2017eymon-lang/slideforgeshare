"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase = createClient();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checkingSession, setCheckingSession] = useState(true);

  const rawNext = searchParams.get("next");
  const next = rawNext && rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/workspace";

  // If the person is already signed in, never show the login form —
  // send them straight to `next` (which carries prompt/style/language/slides).
  useEffect(() => {
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;

      if (data.user) {
        router.replace(next);
        return;
      }

      setCheckingSession(false);
    });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      router.push(next);
      router.refresh();
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setLoading(false);
        return;
      }

      setMessage(
        "Account created. Check your email to confirm your account."
      );
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07080c] text-white/40">
        <span className="text-sm">Checking your session…</span>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07080c] text-white">
      {/* Animated background */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(139,92,246,.7), rgba(59,130,246,.25), transparent 70%)",
          }}
        />

        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.15)_1px,transparent_1px)] [background-size:60px_60px]" />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Logo */}
          <button
            onClick={() => router.push("/")}
            className="mx-auto mb-10 flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-lg font-black shadow-lg shadow-violet-500/20">
              S
            </div>

            <span className="text-xl font-bold tracking-tight">
              SlideForge
            </span>
          </button>

          {/* Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-8 shadow-2xl backdrop-blur-xl">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold">
                {mode === "login"
                  ? "Welcome back"
                  : "Create your account"}
              </h1>

              <p className="mt-2 text-sm text-white/50">
                {mode === "login"
                  ? "Sign in to continue creating presentations."
                  : "Start creating beautiful AI presentations."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Email
                </label>

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 outline-none transition placeholder:text-white/25 focus:border-violet-500/60"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-white/60">
                  Password
                </label>

                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 outline-none transition placeholder:text-white/25 focus:border-violet-500/60"
                />
              </div>

              {message && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3.5 font-semibold transition hover:scale-[1.01] hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : mode === "login"
                    ? "Sign in"
                    : "Create account"}
              </button>
            </form>

            <div className="my-6 h-px bg-white/10" />

            <p className="text-center text-sm text-white/50">
              {mode === "login"
                ? "Don't have an account?"
                : "Already have an account?"}

              <button
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setMessage("");
                }}
                className="ml-2 font-semibold text-violet-400 hover:text-violet-300"
              >
                {mode === "login" ? "Create one" : "Sign in"}
              </button>
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-white/30">
            By continuing, you agree to SlideForge's terms.
          </p>
        </div>
      </div>
    </main>
  );
}