import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

// Initialize the HTTP router
const http = httpRouter();

// Define a route for OpenID configuration endpoint
http.route({
    // Path for the OpenID configuration endpoint
    path: "/.well-known/openid-configuration",
    // HTTP method allowed for this endpoint
    method: "GET",
    // Handler function for requests to this endpoint
    handler: httpAction(async () => {
        // Return a new response object with the OpenID configuration details
        return new Response(
        JSON.stringify({
            // Issuer URL for the OAuth provider
            issuer: process.env.CONVEX_SITE_URL,
            // URI where the public keys are located
            jwks_uri: process.env.CONVEX_SITE_URL + "/.well-known/jwks.json",
            // Authorization endpoint URL
            authorization_endpoint:
            process.env.CONVEX_SITE_URL + "/oauth/authorize",
        }),
        {
            // HTTP status code for successful responses
            status: 200,
            // Headers for the response
            headers: {
            "Content-Type": "application/json",
            "Cache-Control":
                "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
            },
        }
        );
    }),
});

// Define a route for JWKS (JSON Web Key Set) endpoint
http.route({
    // Path for the JWKS endpoint
    path: "/.well-known/jwks.json",
    // HTTP method allowed for this endpoint
    method: "GET",
    // Handler function for requests to this endpoint
    handler: httpAction(async () => {
        // Check if the JWKS environment variable is defined
        if (process.env.JWKS === undefined) {
            // Throw an error if JWKS is not defined
            throw new Error("Missing JWKS Convex environment variable");
        }
        // Return a new response object with the JWKS content
        return new Response(process.env.JWKS, {
            // HTTP status code for successful responses
            status: 200,
            // Headers for the response
            headers: {
                "Content-Type": "application/json",
                "Cache-Control":
                "public, max-age=15, stale-while-revalidate=15, stale-if-error=86400",
            },
        });
    }),
});

// Export the configured HTTP router
export default http;
