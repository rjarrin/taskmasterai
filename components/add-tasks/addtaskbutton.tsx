import { Doc, Id } from "@/convex/_generated/dataModel";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import AddTaskInline from "./addtaskinline";

// Component wrapper for displaying either the inline task addition form or the button to trigger it
export const AddTaskWrapper = ({parentTask, projectId,}:{parentTask?: Doc<"todos">; projectId?: Id<"projects">;}) => {
    const [showAddTask, setShowAddTask] = useState(false);

    return showAddTask ? (
        // If the state indicates to show the form, render the AddTaskInline component
        <AddTaskInline setShowAddTask={setShowAddTask} parentTask={parentTask} projectId={projectId}/>) : (
        // Otherwise, render the AddTaskButton component
        <AddTaskButton onClick={() => setShowAddTask(true)} title={parentTask?._id ? "Add sub-task" : "Add task"}/>
    );
};

// Button component for adding tasks
export default function AddTaskButton({onClick, title,}:{onClick: Dispatch<SetStateAction<any>>; title: string;}) {
    return (
        // Render a button with an icon and title
        <button className="pl-2 flex mt-2 flex-1" onClick={onClick}>
            <div className="flex flex-col items-center justify-center gap-1 text-center">
                <div className="flex items-center gap-2 justify-center">
                    {/* Icon for adding tasks */}
                    <Plus className="h-4 w-4 text-primary hover:bg-primary hover:rounded-xl hover:text-white" />
                    {/* Title indicating the action (e.g., adding a task or a sub-task) */}
                    <h3 className="text-base font-light tracking-tight text-foreground/70">{title}</h3>
                </div>
            </div>
        </button>
    );
}
