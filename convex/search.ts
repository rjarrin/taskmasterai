import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalQuery } from "./_generated/server";
import { handleUserId } from "./auth";
import { getEmbeddingsWithAI } from "./googleai";

// Define a query handler for fetching search results from the database
export const fetchSearchResults = internalQuery({
    // Specify the expected structure of the results array
    args: {
        results: v.array(v.object({ _id: v.id("todos"), _score: v.float64() })),
    },
    // Handler function to process the results
    handler: async (ctx, args) => {
        const results = [];
        // Iterate over each result, fetch the document from the database, and push it to the results array
        for (const result of args.results) {
            const doc = await ctx.db.get(result._id);
            if (doc === null) {
                continue;
            }
            results.push({ ...doc });
        }
        // Return the processed results
        return results;
    },
});

// Define an action for searching tasks using embeddings and filtering by user ID
export const searchTasks = action({
    // Specify the expected structure of the input arguments
    args: {
        query: v.string(),
    },
    // Handler function for the search action
    handler: async (ctx, { query }) => {
        try {
            // Retrieve the user ID from the context
            const userId = await handleUserId(ctx);
            // If a user ID is found, proceed with the search
            if (userId) {
                // Generate embeddings for the search query using Google AI
                const embedding = await getEmbeddingsWithAI(query);
                // Perform a vector search for todos matching the embedding, filtered by the user ID
                const results = await ctx.vectorSearch("todos", "by_embedding", { vector: embedding, limit: 16, filter: (q) => q.eq("userId", userId),});
                // Fetch detailed search results from the database
                const rows: any = await ctx.runQuery(internal.search.fetchSearchResults, {results,});
                // Return the fetched search results
                return rows;
            }
        } catch (err) {
            // Log any errors encountered during the search process
            console.error("Error searching", err);
        }
    },
});
