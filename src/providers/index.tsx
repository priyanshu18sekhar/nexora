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

export function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const showPayPal = mounted && paypalConfig.clientId && paypalConfig.clientId !== "your-paypal-client-id";

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange={false}
      >
        {showPayPal ? (
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
        ) : (
          children
        )}
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
