"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dot } from "lucide-react";
import moment from "moment";
import { AddTaskWrapper } from "../add-tasks/addtaskbutton";
import Todos from "../todos/todos";

export default function Today() {
    // Fetch all todos, todos due today, and overdue todos
    const todos = useQuery(api.todos.get) ?? [];
    const todayTodos = useQuery(api.todos.todayTodos) ?? [];
    const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];

    // Check if any of the queries are still loading
    if (todos === undefined || todayTodos === undefined) {
        <p>Loading...</p>;
    }
    return (
        <div className="xl:px-40">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Today</h1>
            </div>
            {/* Section for overdue todos */}
            <div className="flex flex-col gap-1 py-4">
                <p className="font-bold flex text-sm">Overdue</p>
                <Todos items={overdueTodos} />
            </div>
            <AddTaskWrapper />
            {/* Section for today's todos */}
            <div className="flex flex-col gap-1 py-4">
                {/* Display current date and day of the week */}
                <p className="font-bold flex text-sm items-center border-b-2 p-2 border-gray-100">
                    {moment(new Date()).format("LL")}
                    <Dot />
                    Today
                    <Dot />
                    {moment(new Date()).format("dddd")}
                </p>
                <Todos items={todayTodos} />
            </div>
        </div>
    );
}
