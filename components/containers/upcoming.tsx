"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Dot } from "lucide-react";
import moment from "moment";
import { AddTaskWrapper } from "../add-tasks/addtaskbutton";
import Todos from "../todos/todos";

export default function Upcoming() {
    // Fetch grouped todos by due date and overdue todos
    const groupTodosByDate = useQuery(api.todos.groupTodosByDate) ?? [];
    const overdueTodos = useQuery(api.todos.overdueTodos) ?? [];

    // Check if data is still loading
    if (groupTodosByDate === undefined || overdueTodos === undefined) {
        <p>Loading...</p>;
    }
    return (
        <div className="xl:px-40">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Upcoming</h1>
            </div>
            {/* Display overdue todos */}
            <div className="flex flex-col gap-1 py-4">
                <p className="font-bold flex text-sm">Overdue</p>
                <Todos items={overdueTodos} />
            </div>
            {/* Add task button */}
            <div className="pb-6">
                <AddTaskWrapper />
            </div>
            {/* Display todos grouped by due date */}
            <div className="flex flex-col gap-1 py-4">
                {/* Iterate over each due date and display todos */}
                {Object.keys(groupTodosByDate || {}).map((dueDate) => {
                return (
                    <div key={dueDate} className="mb-6">
                        {/* Display due date and day */}
                        <p className="font-bold flex text-sm items-center">
                            {moment(dueDate).format("LL")} <Dot />
                            {moment(dueDate).format("dddd")}
                        </p>
                        {/* List of todos for the current due date */}
                        <ul>
                            <Todos items={groupTodosByDate[dueDate]} />
                            <AddTaskWrapper />
                        </ul>
                    </div>
                );
                })}
            </div>
        </div>
    );
}
