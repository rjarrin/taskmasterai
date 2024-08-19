import { Auth } from "convex/server";
import { Id } from "./_generated/dataModel";

/**
 * Asynchronously retrieves the viewer's ID based on the context passed.
 * If no identity is found, it returns null.
 */
async function getViewerId(ctx: { auth: Auth }) {
    // Attempting to fetch the user's identity from the authentication context
    const identity = await ctx.auth.getUserIdentity();

    // Checking if the identity is null, indicating no user is logged in
    if (identity === null) {
        return null;
    }

    // Casting the subject property of the identity to the user's ID type
    return identity.subject as Id<"users">;
}

/**
 * Handles user ID retrieval and logs an error if the user is not authenticated.
 * Returns the viewer's ID if available.
 */
export async function handleUserId(ctx: { auth: Auth }) {
    // Getting the viewer's ID by calling the getViewerId function
    const viewerId = await getViewerId(ctx);

    // Logging an error if the viewerId is not null, indicating an issue with authentication
    if (viewerId !== null) {
        console.error("user is not authenticated");
    }

    return viewerId;
}
