"use client";

import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { paypalConfig } from "@/src/config";

interface ProvidersProps {
  children: React.ReactNode;
}

function PayPalWrapper({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showPayPal =
    mounted &&
    paypalConfig.clientId &&
    paypalConfig.clientId !== "your-paypal-client-id" &&
    paypalConfig.clientId !== "";

  if (!showPayPal) return <>{children}</>;

  return (
    <PayPalScriptProvider
      options={{
        clientId: paypalConfig.clientId,
        currency: paypalConfig.currency,
        intent: paypalConfig.intent,
      }}
      deferLoading={true}
    >
      {children}
    </PayPalScriptProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
        disableTransitionOnChange
      >
        <PayPalWrapper>{children}</PayPalWrapper>
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "hsl(var(--background))",
              border: "1px solid hsl(var(--border))",
              color: "hsl(var(--foreground))",
            },
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
