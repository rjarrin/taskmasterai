import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";
import { getEmbeddingsWithAI } from "./googleai";

// Query to fetch all sub-todos for a user
export const get = query({
    args: {},
    handler: async (ctx) => {
        // Extract the user ID from the context
        const userId = await handleUserId(ctx);
        // If a user ID is found, fetch all sub-todos associated with that user
        if (userId) {
            return await ctx.db.query("subTodos").filter((q) => q.eq(q.field("userId"), userId)).collect();
        }
        // Return an empty array if no user ID is found
        return [];
    },
});

// Query to fetch sub-todos by their parent todo ID
export const getSubTodosByParentId = query({
    args: {
        parentId: v.id("todos"),
    },
    handler: async (ctx, { parentId }) => {
        // Extract the user ID from the context
        const userId = await handleUserId(ctx);
        // If a user ID is found, fetch sub-todos associated with that user and the specified parent ID
        if (userId) {
            return await ctx.db.query("subTodos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("parentId"), parentId)).collect();
        }
        // Return an empty array if no user ID is found
        return [];
    },
});

// Mutation to mark a sub-todo as completed
export const checkASubTodo = mutation({
    args: { taskId: v.id("subTodos") },
    handler: async (ctx, { taskId }) => {
        const newTaskId = await ctx.db.patch(taskId, { isCompleted: true });
        return newTaskId;
    },
});

// Mutation to mark a sub-todo as incomplete
export const unCheckASubTodo = mutation({
    args: { taskId: v.id("subTodos") },
    handler: async (ctx, { taskId }) => {
        const newTaskId = await ctx.db.patch(taskId, { isCompleted: false });
        return newTaskId;
    },
});

// Mutation to create a new sub-todo
export const createASubTodo = mutation({
    args: {
        taskName: v.string(),
        description: v.optional(v.string()),
        priority: v.number(),
        dueDate: v.number(),
        projectId: v.id("projects"),
        labelId: v.id("labels"),
        parentId: v.id("todos"),
        embedding: v.optional(v.array(v.float64())),
    },
    handler: async (ctx, { taskName, description, priority, dueDate, projectId, labelId, parentId, embedding,}) => {
        try {
            // Extract the user ID from the context
            const userId = await handleUserId(ctx);
            // If a user ID is found, insert the new sub-todo into the database
            if (userId) {
                const newTaskId = await ctx.db.insert("subTodos", {
                userId, parentId, taskName, description, priority, dueDate, projectId, labelId, isCompleted: false, embedding,});
                return newTaskId;
            }
            // Return null if no user ID is found
            return null;
        } catch (err) {
            console.log("Error occurred during createASubTodo mutation", err);
            return null;
        }
    },
});

// Action to create a new sub-todo along with generating embeddings using AI
export const createSubTodoAndEmbeddings = action({
    args: {
        taskName: v.string(),
        description: v.optional(v.string()),
        priority: v.number(),
        dueDate: v.number(),
        projectId: v.id("projects"),
        labelId: v.id("labels"),
        parentId: v.id("todos"),
    },
    handler: async (ctx, { taskName, description, priority, dueDate, projectId, labelId, parentId }) => {
        // Generate embeddings for the task name using AI
        const embedding = await getEmbeddingsWithAI(taskName);
        // Run the mutation to create the sub-todo with the generated embeddings
        await ctx.runMutation(api.subTodos.createASubTodo, { taskName, description, priority, dueDate, projectId, labelId, parentId, embedding,});
    },
});

// Query to fetch all completed sub-todos for a specific parent todo
export const completedSubTodos = query({
    args: {
        parentId: v.id("todos"),
    },
    handler: async (ctx, { parentId }) => {
        // Extract the user ID from the context
        const userId = await handleUserId(ctx);
        // If a user ID is found, fetch all completed sub-todos associated with that user and the specified parent ID
        if (userId) {
            const todos = await ctx.db.query("subTodos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("parentId"), parentId)).filter((q) => q.eq(q.field("isCompleted"), true)).collect();
            return todos;
        }
        // Return an empty array if no user ID is found
        return [];
    },
});

// Query to fetch all incomplete sub-todos for a specific parent todo
export const inCompleteSubTodos = query({
    args: {
        parentId: v.id("todos"),
    },
    handler: async (ctx, { parentId }) => {
        // Extract the user ID from the context
        const userId = await handleUserId(ctx);
        // Fetch all incomplete sub-todos associated with that user and the specified parent ID
        const todos = await ctx.db.query("subTodos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("parentId"), parentId)).filter((q) => q.eq(q.field("isCompleted"), false)).collect();
        return todos;
    },
});

// Mutation to delete a sub-todo by its ID
export const deleteASubTodo = mutation({
    args: {
        taskId: v.id("subTodos"),
    },
    handler: async (ctx, { taskId }) => {
        try {
            // Extract the user ID from the context
            const userId = await handleUserId(ctx);
            // If a user ID is found, delete the sub-todo from the database
            if (userId) {
                const deletedTaskId = await ctx.db.delete(taskId);
                return deletedTaskId;
            }
            // Return null if no user ID is found
            return null;
        } catch (err) {
            console.log("Error occurred during deleteASubTodo mutation", err);
            return null;
        }
    },
});
