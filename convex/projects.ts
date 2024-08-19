import { v } from "convex/values";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";
import { action, mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";

// Query to fetch all projects associated with a user and system projects.
export const getProjects = query({
    args: {},
    handler: async (ctx) => {
        // Extracts the user ID from the context
        const userId = await handleUserId(ctx);
        if (userId) {
            // Fetches user-specific projects
            const userProjects = await ctx.db.query("projects").filter((q) => q.eq(q.field("userId"), userId)).collect();
            // Fetches system projects
            const systemProjects = await ctx.db.query("projects").filter((q) => q.eq(q.field("type"), "system")).collect();
            // Combines both lists and returns them
            return [...systemProjects, ...userProjects];
        }
        // Returns an empty array if no user ID is found
        return [];
    },
});

// Query to fetch a single project by its ID.
export const getProjectByProjectId = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        // Extracts the user ID from the context
        const userId = await handleUserId(ctx);
        if (userId) {
            // Fetches the project with the specified ID
            const project = await ctx.db.query("projects").filter((q) => q.eq(q.field("_id"), projectId)).collect();
            // Returns the first matching project or null if not found
            return project?.[0] || null;
        }
        // Returns null if no user ID is found
        return null;
    },
});

// Mutation to create a new project with the specified name
export const createAProject = mutation({
    args: {
        name: v.string(),
    },
    handler: async (ctx, { name }) => {
        try {
            const userId = await handleUserId(ctx);
            if (userId) {
                // Inserts a new project with the specified name and user ID
                const newTaskId = await ctx.db.insert("projects", {userId, name, type: "user",});
                // Returns the ID of the newly created project
                return newTaskId;
            }
            // Returns null if no user ID is found
            return null;
        } catch (err) {
            console.log("Error occurred during createAProject mutation", err);
            return null;
        }
    },
});

// Mutation to delete a project by its ID
export const deleteProject = mutation({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        try {
            // Extracts the user ID from the context
            const userId = await handleUserId(ctx);
            if (userId) {
                // Deletes the project with the specified ID
                const taskId = await ctx.db.delete(projectId);
                // Returns the ID of the deleted project
                return taskId;
            }
            // Returns null if no user ID is found
            return null;
        } catch (err) {
            console.log("Error occurred during deleteProject mutation", err);
            return null;
        }
    },
});

// Action to delete a project and all its associated tasks
export const deleteProjectAndItsTasks = action({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        try {
            // Retrieves all tasks associated with the project
            const allTasks = await ctx.runQuery(api.todos.getTodosByProjectId, {projectId,});

            // Deletes each task
            const promises = Promise.allSettled(
                allTasks.map(async (task: Doc<"todos">) =>
                ctx.runMutation(api.todos.deleteATodo, {taskId: task._id,}))
            );
            const statuses = await promises;
            // Deletes the project
            await ctx.runMutation(api.projects.deleteProject, {projectId,});
        } catch (err) {
            console.error("Error deleting tasks and projects", err);
        }
    },
});
