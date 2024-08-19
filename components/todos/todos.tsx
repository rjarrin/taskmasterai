import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useToast } from "../ui/use-toast";
import Task from "./task";

export default function Todos({ items }: { items: Array<Doc<"todos">> }) {
    // Initialize toast notification system
    const { toast } = useToast();
    // Hooks for checking and unchecking todo items
    const checkATodo = useMutation(api.todos.checkATodo);
    const unCheckATodo = useMutation(api.todos.unCheckATodo);

    // Function to handle changes in todo item completion status
    const handleOnChangeTodo = (task: Doc<"todos">) => {
        // If the task is already marked as completed, uncheck it
        if (task.isCompleted) {
            unCheckATodo({ taskId: task._id });
        } else {
            // Otherwise, mark the task as completed and show a toast notification
            checkATodo({ taskId: task._id });
            toast({
                title: "✅ Task completed",
                description: "You're a rockstar",
                duration: 3000,
            });
        }
    };
    // Render each todo item, passing the handler for change events
    return items.map((task: Doc<"todos">, idx: number) => (
        <Task key={task._id} data={task} isCompleted={task.isCompleted} handleOnChange={() => handleOnChangeTodo(task)} />
    ));
}
