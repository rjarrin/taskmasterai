"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useMemo } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function getTokenFromSession(session: Session | null): string | null {
  return session?.convexToken ?? null;
}

function useAuth() {
  const {data: session, update} = useSession();
  const convexToken = getTokenFromSession(session);
  return useMemo(() => ({
    isLoading: false,
    isAuthenticated: session !== null,
    fetchAccessToken: async ({
      forceRefreshToken,
    }: {
      forceRefreshToken: boolean;
    }) => {
      if (forceRefreshToken) {
        const session = await update();
        return getTokenFromSession(session);
      }
      return convexToken;
    },
  }),
  [JSON.stringify(session?.user)]
  );
}

export default function Providers({ children, session }: { children: ReactNode, session: Session | null }) {
  return (
  <SessionProvider session={session}>
    <ConvexProvider client={convex} useAuth={useAuth}>
      {children}
    </ConvexProvider>
  </SessionProvider>
  );
}