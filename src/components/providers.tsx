"use client";

import { Provider } from "jotai";
import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <Provider>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster />
    </Provider>
  );
}
