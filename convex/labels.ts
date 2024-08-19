import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";

// Query to fetch all labels associated with a user and system labels
export const getLabels = query({
    args: {},
    handler: async (ctx) => {
        // Retrieve the current user ID
        const userId = await handleUserId(ctx);
        // If a user ID is found, fetch user-specific labels and combine them with system labels
        if (userId) {
            const userLabels = await ctx.db.query("labels").filter((q) => q.eq(q.field("userId"), userId)).collect();
            const systemLabels = await ctx.db.query("labels").collect();
            // Return both sets of labels combined
            return [...systemLabels, ...userLabels];
        }
        // If no user ID is found, return an empty array
        return [];
    },
});

// Query to fetch a single label by its ID
export const getLabelByLabelId = query({
    args: {
        labelId: v.id("labels"),
    },
    handler: async (ctx, { labelId }) => {
        // Retrieve the current user ID
        const userId = await handleUserId(ctx);
        // If a user ID is found, fetch the label by its ID
        if (userId) {
            const project = await ctx.db.query("labels").filter((q) => q.eq(q.field("_id"), labelId)).collect();
            // Return the first matching label or null if not found
            return project?.[0] || null;
        }
        // If no user ID is found, return null
        return null;
    },
});

// Mutation to create a new label
export const createALabel = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, { name }) => {
        try {
            // Retrieve the current user ID
            const userId = await handleUserId(ctx);
            // If a user ID is found, insert a new label with the provided name
            if (userId) {
                const newTaskId = await ctx.db.insert("labels", {
                userId,
                name,
                type: "user",
                });
                // Return the ID of the newly created label
                return newTaskId;
            }
            return null;
        } catch (err) {
            // Log any errors that occur during the creation process
            console.log("Error occurred during createALabel mutation", err);
            // Return null in case of error
            return null;
        }
    },
});
