"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  Users,
  Building,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { registerSchema, type RegisterInput } from "@/src/lib/validations/auth";
import { cn } from "@/src/lib/utils";

const roles = [
  {
    value: "STUDENT",
    label: "Student",
    description: "Engineering / college student",
    icon: GraduationCap,
    color: "from-violet-500 to-purple-600",
  },
  {
    value: "PROFESSIONAL",
    label: "Professional",
    description: "Working professional",
    icon: Briefcase,
    color: "from-blue-500 to-cyan-600",
  },
  {
    value: "MENTOR",
    label: "Mentor",
    description: "Teach and guide others",
    icon: Users,
    color: "from-emerald-500 to-teal-600",
  },
  {
    value: "RECRUITER",
    label: "Recruiter",
    description: "Post internship openings",
    icon: Building,
    color: "from-amber-500 to-orange-600",
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>("STUDENT");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "STUDENT" },
  });

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

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-muted/30">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl"
      >
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">Nexora</span>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-muted-foreground text-sm">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>

          <form id="register-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <Label>I am a...</Label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    id={`role-${role.value.toLowerCase()}`}
                    onClick={() => {
                      setSelectedRole(role.value);
                      setValue("role", role.value as RegisterInput["role"]);
                    }}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all duration-200",
                      selectedRole === role.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/40 hover:bg-muted"
                    )}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <role.icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{role.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {role.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              {errors.role && (
                <p className="text-xs text-destructive">{errors.role.message}</p>
              )}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                leftIcon={<User className="w-4 h-4" />}
                error={errors.name?.message}
                {...register("name")}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="reg-email">Email Address</Label>
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />}
                error={errors.email?.message}
                {...register("email")}
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
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
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                error={errors.password?.message}
                {...register("password")}
              />
            </div>

            <Button
              id="register-submit-btn"
              type="submit"
              className="w-full"
              size="lg"
              loading={isLoading}
            >
              Create Account
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By registering, you agree to our{" "}
            <Link href="/terms" className="underline">Terms</Link> and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
