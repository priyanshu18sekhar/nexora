"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Sparkles, Mail, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { loginSchema, type LoginInput } from "@/src/lib/validations/auth";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);


function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/student";
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const result = await signIn("credentials", { email: data.email, password: data.password, redirect: false, callbackUrl });
      if (result?.error) { toast.error("Invalid email or password. Please try again."); }
      else { toast.success("Welcome back!"); router.push(callbackUrl); router.refresh(); }
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setIsLoading(false); }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsSocialLoading(provider);
    try { await signIn(provider, { callbackUrl }); }
    catch { toast.error("Social login failed. Try again."); setIsSocialLoading(null); }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left: Brand panel */}
      <div
        className="hidden lg:flex lg:w-[45%] relative overflow-hidden flex-col items-center justify-center p-12"
        style={{ background: "linear-gradient(135deg, #5046e5 0%, #7c3aed 60%, #2563eb 100%)" }}
      >
        {/* Mesh texture */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-white/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-white/8 rounded-full blur-3xl" />

        <div className="relative text-white text-center max-w-sm z-10">
          <Link href="/" className="flex items-center gap-3 justify-center mb-10">
            <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold font-display">Nexora</span>
          </Link>

          <h2 className="text-3xl font-bold font-display mb-4 leading-tight">
            Welcome back to your learning journey
          </h2>
          <p className="text-white/65 leading-relaxed text-sm">
            Sign in to access your courses, track your progress, view internship applications, and connect with mentors.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[{ value: "50K+", label: "Learners" }, { value: "1,200+", label: "Courses" }, { value: "95%", label: "Success Rate" }].map((s) => (
              <div key={s.label} className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm">
                <div className="text-2xl font-bold font-display">{s.value}</div>
                <div className="text-xs text-white/60 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 space-y-3 text-left">
            {["Industry-recognized certificates", "Direct internship placements", "1-on-1 expert mentorship"].map((t) => (
              <div key={t} className="flex items-center gap-3 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-white/60 flex-shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center shadow-brand">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-display gradient-text">Nexora</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display tracking-tight mb-2">Sign in</h1>
            <p className="text-muted-foreground text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-semibold">
                Create one free
              </Link>
            </p>
          </div>

          {/* Social buttons */}
          <div className="space-y-2.5 mb-6">
            <button
              id="google-login-btn"
              className="w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium disabled:opacity-60"
              onClick={() => handleSocialLogin("google")}
              disabled={!!isSocialLoading}
            >
              {isSocialLoading === "google" ? <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" /> : <GoogleIcon />}
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="divider-label mb-6">or sign in with email</div>

          {/* Credentials form */}
          <form id="login-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                className="h-11 rounded-xl"
                {...register("email")}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                <Link href="/forgot-password" className="text-xs text-primary hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="hover:text-foreground transition-colors" aria-label="Toggle password">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                className="h-11 rounded-xl"
                {...register("password")}
              />
            </div>

            <Button
              id="login-submit-btn"
              type="submit"
              className="w-full gradient-bg text-white font-semibold shadow-brand rounded-xl h-11 text-sm hover:opacity-90"
              loading={isLoading}
            >
              Sign In
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>}>
      <LoginFormContent />
    </Suspense>
  );
}
