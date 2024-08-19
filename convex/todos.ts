import { v } from "convex/values";
import moment from "moment";
import { api } from "./_generated/api";
import { action, mutation, query } from "./_generated/server";
import { handleUserId } from "./auth";
import { getEmbeddingsWithAI } from "./googleai";

// Query to fetch all todos for a user
export const get = query({
    args: {},
    handler: async (ctx) => {
        // If a user is logged in, fetch todos for said user
        const userId = await handleUserId(ctx);
        if (userId) {
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).collect();
        }
        // Otherwise, return empty array
        return [];
    },
});

/* 
    Queries and mutations for managing todos based on various criteria
    (e.g., by project ID, completion status, due dates)
*/
// Fetches completed todos by project ID
export const getCompletedTodosByProjectId = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("projectId"), projectId)).filter((q) => q.eq(q.field("isCompleted"), true)).collect();
        }
        return [];
    },
});

// Fetches todos by project ID
export const getTodosByProjectId = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("projectId"), projectId)).collect();
        }
        return [];
    },
});

// Fetches incomplete todos by project ID
export const getInCompleteTodosByProjectId = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("projectId"), projectId)).filter((q) => q.eq(q.field("isCompleted"), false)).collect();
        }
        return [];
    },
});

// Counts the total number of todos by project ID
export const getTodosTotalByProjectId = query({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            const todos = await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("projectId"), projectId)).filter((q) => q.eq(q.field("isCompleted"), true)).collect();
            return todos?.length || 0;
        }
        return 0;
    },
});

// Fetches todos due today
export const todayTodos = query({
    args: {},
    handler: async (ctx) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            const todayStart = moment().startOf("day");
            const todayEnd = moment().endOf("day");

            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.gte(q.field("dueDate"), todayStart.valueOf()) && q.lte(todayEnd.valueOf(), q.field("dueDate"))).collect();
        }
        return [];
    },
});

// Fetches overdue todos
export const overdueTodos = query({
    args: {},
    handler: async (ctx) => {
        const userId = await handleUserId(ctx);
    
        if (userId) {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
    
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.lt(q.field("dueDate"), todayStart.getTime())).collect();
        }
        return [];
    },
});
  
// Fetches completed todos
export const completedTodos = query({
    args: {},
    handler: async (ctx) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("isCompleted"), true)).collect();
        }
        return [];
    },
});
  
// Fetches incomplete todos
export const inCompleteTodos = query({
    args: {},
    handler: async (ctx) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            return await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("isCompleted"), false)).collect();
        }
        return [];
    },
});
  
// Counts the total number of todos
export const totalTodos = query({
    args: {},
    handler: async (ctx) => {
        const userId = await handleUserId(ctx);
        if (userId) {
            const todos = await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.eq(q.field("isCompleted"), true)).collect();
            return todos.length || 0;
        }
        return 0;
    },
});
  
// Marks a todo as completed
export const checkATodo = mutation({
    args: { taskId: v.id("todos") },
    handler: async (ctx, { taskId }) => {
        const newTaskId = await ctx.db.patch(taskId, { isCompleted: true });
        return newTaskId;
    },
});
  
// Marks a todo as not completed
export const unCheckATodo = mutation({
    args: { taskId: v.id("todos") },
    handler: async (ctx, { taskId }) => {
        const newTaskId = await ctx.db.patch(taskId, { isCompleted: false });
        return newTaskId;
    },
});
  
// Creates a new todo
export const createATodo = mutation({
    args: {
        taskName: v.string(),
        description: v.optional(v.string()),
        priority: v.number(),
        dueDate: v.number(),
        projectId: v.id("projects"),
        labelId: v.id("labels"),
        embedding: v.optional(v.array(v.float64())),
    },
    handler: async (ctx, { taskName, description, priority, dueDate, projectId, labelId, embedding }) => {
        try {
            const userId = await handleUserId(ctx);
            if (userId) {
                const newTaskId = await ctx.db.insert("todos", {
                    userId,
                    taskName,
                    description,
                    priority,
                    dueDate,
                    projectId,
                    labelId,
                    isCompleted: false,
                    embedding,
                });
                return newTaskId;
            }
            return null;
        } catch (err) {
            console.log("Error occurred during createATodo mutation", err);
            return null;
        }
    },
});
  
// Action to create a todo and generate embeddings
export const createTodoAndEmbeddings = action({
    args: {
        taskName: v.string(),
        description: v.optional(v.string()),
        priority: v.number(),
        dueDate: v.number(),
        projectId: v.id("projects"),
        labelId: v.id("labels"),
    },
    handler: async (ctx, { taskName, description, priority, dueDate, projectId, labelId }) => {
        const embedding = await getEmbeddingsWithAI(taskName);
        await ctx.runMutation(api.todos.createATodo, {
            taskName,
            description,
            priority,
            dueDate,
            projectId,
            labelId,
            embedding,
        });
    },
});
  
// Groups todos by their due date
export const groupTodosByDate = query({
    args: {},
    handler: async (ctx) => {
        const userId = await handleUserId(ctx);
    
        if (userId) {
            const todos = await ctx.db.query("todos").filter((q) => q.eq(q.field("userId"), userId)).filter((q) => q.gt(q.field("dueDate"), new Date().getTime())).collect();
    
            const groupedTodos = todos.reduce<any>((acc, todo) => {
                const dueDate = new Date(todo.dueDate).toDateString();
                acc[dueDate] = (acc[dueDate] || []).concat(todo);
                return acc;
            }, {});
            return groupedTodos;
        }
        return [];
    },
});
  
// Deletes a todo
export const deleteATodo = mutation({
    args: {
        taskId: v.id("todos"),
    },
    handler: async (ctx, { taskId }) => {
        try {
            const userId = await handleUserId(ctx);
            if (userId) {
                const deletedTaskId = await ctx.db.delete(taskId);  
                return deletedTaskId;
            }
            return null;
        } catch (err) {
            console.log("Error occurred during deleteATodo mutation", err);
            return null;
        }
    },
});
