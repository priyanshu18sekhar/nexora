"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Sparkles, Mail, Lock, User, Eye, EyeOff,
  GraduationCap, Briefcase, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { registerSchema, type RegisterInput } from "@/src/lib/validations/auth";
import { cn } from "@/src/lib/utils";
import { BrandPanel } from "@/src/components/auth/brand-panel";

const roles = [
  { value: "STUDENT",      label: "Student",      description: "Engineering / college student", icon: GraduationCap, color: "from-violet-500 to-purple-600" },
  { value: "PROFESSIONAL", label: "Professional", description: "Working professional",          icon: Briefcase,     color: "from-blue-500 to-cyan-600" },
];

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSocialLoading, setIsSocialLoading] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("STUDENT");

  const {
    register, handleSubmit, setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" },
  });

  React.useEffect(() => {
    register("role");
  }, [register]);

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error || "Registration failed. Please try again.");
      } else {
        toast.success("Account created! Please sign in.");
        router.push("/login");
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsSocialLoading(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard/student" });
    } catch {
      toast.error("Social login failed. Try again.");
      setIsSocialLoading(null);
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <BrandPanel
        title="Build the career you deserve"
        description="Create a free account to unlock courses, certificates, and direct access to internships from 300+ hiring partners."
        bullets={[
          "Start with free beginner-friendly courses",
          "Verified certificates for every course",
          "Apply to exclusive internships",
          "Lifetime access — learn at your own pace",
        ]}
      />

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md"
        >
          <div className="flex justify-center mb-8 lg:hidden">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center shadow-brand">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold font-display gradient-text">Nexora</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold font-display tracking-tight mb-2">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Already have one?{" "}
              <Link href="/login" className="text-primary hover:underline font-semibold">
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-2.5 mb-6">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 h-11 px-4 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium disabled:opacity-60 shadow-sm"
              onClick={() => handleSocialLogin("google")}
              disabled={!!isSocialLoading}
            >
              {isSocialLoading === "google" ? (
                <span className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
              ) : (
                <GoogleIcon />
              )}
              Continue with Google
            </button>
          </div>

          <div className="divider-label mb-6">or sign up with email</div>

          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    id={`role-${role.value.toLowerCase()}`}
                    onClick={() => {
                      setSelectedRole(role.value);
                      setValue("role", role.value as RegisterInput["role"], { shouldValidate: true });
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200",
                      selectedRole === role.value
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    )}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <role.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.name?.message}
                className="h-11 rounded-xl"
                {...register("name")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-email" className="text-sm font-medium">Email Address</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                className="h-11 rounded-xl"
                {...register("email")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="reg-password" className="text-sm font-medium">Password</Label>
              <Input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
                leftIcon={<Lock className="w-4 h-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                    className="hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                error={errors.password?.message}
                className="h-11 rounded-xl"
                {...register("password")}
              />
            </div>

            <Button
              id="register-submit-btn"
              type="submit"
              className="w-full gradient-bg text-white font-semibold shadow-brand rounded-xl h-11 text-sm hover:opacity-90"
              loading={isLoading}
            >
              Create Account
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By registering, you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms</Link> and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
