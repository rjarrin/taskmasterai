import { v } from "convex/values";
import { api } from "./_generated/api";
import { action } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Check if the AI key environment variable is set
if (!process.env.AI_KEY) {
    throw new Error('Environment variable AI_KEY is not set');
}

// Initialize Google Generative AI with the AI key
const genAI = new GoogleGenerativeAI(process.env.AI_KEY);
// Get the generative model configured for use
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } }, );
// Define a unique identifier for AI-generated labels
const AI_LABEL_ID = "k5793ckm8x0q58hs3e7pyt5bt56yxaxj";

// Action to suggest missing items for a project using AI
export const suggestMissingItemsWithAi = action({
    args: {
        projectId: v.id("projects"),
    },
    handler: async (ctx, { projectId }) => {
        // Retrieve todos and project details
        const todos = await ctx.runQuery(api.todos.getTodosByProjectId, {projectId,});
        const project = await ctx.runQuery(api.projects.getProjectByProjectId, {projectId,});
        const projectName = project?.name || "";

        // Start a chat session with the AI model
        const chat = model.startChat({
            // Initial conversation setup
            history: [
                {
                    role: "user",
                    parts: [{ text: "System prompt: I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions."}],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood"}],
                },
            ],
        });

        // Send the current list of todos and project name to the AI for suggestions
        const result = await chat.sendMessage("Here are the listed items so far: " + JSON.stringify({todos, projectName}));
        // Extract the suggested todos from the AI's response
        const response = result.response.text();

        // If there are suggested todos, create them in the database
        if (response) {
          const items = JSON.parse(response)?.todos ?? [];
          for (let i = 0; i < items.length; i++) {
            const { taskName, description } = items[i];
            // Generate embeddings for the new todos
            const embedding = await getEmbeddingsWithAI(taskName);
            await ctx.runMutation(api.todos.createATodo, {
              taskName,
              description,
              priority: 1,
              dueDate: new Date().getTime(),
              projectId,
              labelId: AI_LABEL_ID as Id<"labels">,
              embedding,
            });
          }
        }
    }
})

// Similar action to suggest missing sub-items for a todo using AI
export const suggestMissingSubItemsWithAi = action({
    args: {
        projectId: v.id("projects"),
        parentId: v.id("todos"),
        taskName: v.string(),
        description: v.string(),
    },
    handler: async (ctx, { projectId, parentId, taskName, description }) => {
        // Retrieve sub-todos and project details
        const todos = await ctx.runQuery(api.subTodos.getSubTodosByParentId, {parentId,});
        const project = await ctx.runQuery(api.projects.getProjectByProjectId, {projectId,});
        const projectName = project?.name || "";
        // Start a chat session with the AI model
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "System prompt: I need help identifying missing to-do items. I have a list of existing tasks in JSON format, containing objects with 'taskName' and 'description' properties. I also have a good understanding of the project scope. Can you help me identify 3 additional to-do items for the project with projectName that are not yet included in this list? Please provide these missing items in a separate JSON array with the key 'todos' containing objects with 'taskName' and 'description' properties. Ensure there are no duplicates between the existing list and the new suggestions."}],
                },
                {
                    role: "model",
                    parts: [{ text: "Understood"}],
                },
            ],
        });
        // Send the current list of sub-todos and project name to the AI for suggestions
        const result = await chat.sendMessage("Here are the listed items so far: " + JSON.stringify({todos, projectName, ...{parentTodo: {taskName, description}}}));
        // Extract the suggested sub-todos from the AI's response
        const response = result.response.text();

        // If there are suggested sub-todos, create them in the database
        if (response) {
            const items = JSON.parse(response)?.todos ?? [];
            for (let i = 0; i < items.length; i++) {
                const { taskName, description } = items[i];
                // Generate embeddings for the new sub-todos
                const embedding = await getEmbeddingsWithAI(taskName);
                await ctx.runMutation(api.subTodos.createASubTodo, {
                    taskName,
                    description,
                    priority: 1,
                    dueDate: new Date().getTime(),
                    projectId,
                    parentId,
                    labelId: AI_LABEL_ID as Id<"labels">,
                    embedding,
                });
            }
        }
    }
})

// Function to generate embeddings for a given text using the AI model
export const getEmbeddingsWithAI = async (searchText: string) => {
    const model = genAI.getGenerativeModel({ model: "text-embedding-004"});
    const result = await model.embedContent(searchText);
    const embedding = result.embedding;
    return embedding.values;
}  
