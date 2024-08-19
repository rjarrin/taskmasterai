"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { AddTaskWrapper } from "../add-tasks/addtaskbutton";
import CompletedTodos from "./completedtodos";
import Todos from "./todos";

export default function TodoList() {
    // Fetching all todos, completed todos, incomplete todos, and total todos count
    const todos = useQuery(api.todos.get) ?? [];
    const completedTodos = useQuery(api.todos.completedTodos) ?? [];
    const inCompleteTodos = useQuery(api.todos.inCompleteTodos) ?? [];
    const totalTodos = useQuery(api.todos.totalTodos) ?? 0;

    // Conditional rendering based on the loading state of the queries
    if ( todos === undefined || completedTodos === undefined || inCompleteTodos === undefined) {
        // Display loading indicator while data is being fetched
        <p>Loading...</p>;
    }

    // Main return statement of the TodoList component
    return (
        <div className="xl:px-40">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Inbox</h1>
            </div>
            {/* Section for displaying incomplete todos */}
            <div className="flex flex-col gap-1 py-4">
                <Todos items={inCompleteTodos} />
            </div>
            {/* Add Task Wrapper component for adding new tasks */}
            <AddTaskWrapper />
            {/* Section for displaying completed todos */}
            <div className="flex flex-col gap-1 py-4">
                <Todos items={completedTodos} />
            </div>
            <CompletedTodos totalTodos={totalTodos} />
        </div>
    );
}
