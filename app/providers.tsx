"use client";
import { ConvexProviderWithAuth, ConvexReactClient } from "convex/react";
import { Session } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { ReactNode, useMemo } from "react";

// Initialize Convex client with environment variable for the Convex URL
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Extracts the Convex token from the session object.
 * Returns null if no session or no Convex token is present.
 */
function convexTokenFromSession(session: Session | null): string | null {
    return session?.convexToken ?? null;
}

/**
 * Custom hook to encapsulate authentication logic.
 * Utilizes NextAuth's useSession hook to get the current session.
 * Calculates whether the user is authenticated based on the presence of a session.
 * Provides a method to refresh the Convex token if needed.
 */
function useAuth() {
    const { data: session, update } = useSession();
    // Get the Convex token from the current session
    const convexToken = convexTokenFromSession(session);
    return useMemo(() => ({isLoading: false, isAuthenticated: session !== null, fetchAccessToken: async ({forceRefreshToken,}:{forceRefreshToken: boolean;}) => {
                if (forceRefreshToken) {
                    // Refresh the session to get the latest Convex token
                    const session = await update();
                    return convexTokenFromSession(session);
                }
                // Return the current Convex token without refreshing
                return convexToken;
            },
        }),
        [JSON.stringify(session?.user)]
    );
}

/**
 * Main component that wraps the application with necessary providers.
 * - `SessionProvider`: Makes the session available throughout the app.
 * - `ConvexProviderWithAuth`: Provides authentication context for Convex operations.
 * - Both providers receive necessary props like the Convex client instance and the custom auth hook.
 */
export default function Providers({children, session,}:{children: ReactNode; session: Session | null;}) {
    return (
        <SessionProvider session={session}>
            <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
                {children}
            </ConvexProviderWithAuth>
        </SessionProvider>
    );
}
