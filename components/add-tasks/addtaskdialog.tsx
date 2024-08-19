import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { Calendar, ChevronDown, Flag, Hash, Tag, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import Task from "../todos/task";
import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "../ui/dialog";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";
import { AddTaskWrapper } from "./addtaskbutton";
import SuggestMissingTasks from "./suggesttasks";

export default function AddTaskDialog({ data }: { data: Doc<"todos"> }) {
    // Destructure properties from the data prop
    const { taskName, description, projectId, labelId, priority, dueDate, _id } = data;
    
    // Fetch project details based on projectId
    const project = useQuery(api.projects.getProjectByProjectId, { projectId });
    
    // Fetch label details based on labelId
    const label = useQuery(api.labels.getLabelByLabelId, { labelId });
    
    // Initialize toast notifications
    const { toast } = useToast();
    
    // Fetch incomplete sub-todos by project ID
    const inCompletedSubtodosByProject = useQuery(api.subTodos.inCompleteSubTodos, { parentId: _id }) ?? [];
    
    // Fetch completed sub-todos by project ID
    const completedSubtodosByProject = useQuery(api.subTodos.completedSubTodos, { parentId: _id }) ?? [];
    
    // Mutations for checking/unchecking a sub-todo and deleting a todo
    const checkASubTodoMutation = useMutation(api.subTodos.checkASubTodo);
    const unCheckASubTodoMutation = useMutation(api.subTodos.unCheckASubTodo);
    const deleteATodoMutation = useMutation(api.todos.deleteATodo);

    // State to hold detailed information about the todo
    const [todoDetails, setTodoDetails] = useState<Array<{ labelName: string; value: string; icon: React.ReactNode }>>([]);

    // Effect hook to update todoDetails state when relevant props change
    useEffect(() => {
        const data = [
            {
                labelName: "Project",
                value: project?.name || "",
                icon: <Hash className="w-4 h-4 text-primary capitalize" />,
            },
            {
                labelName: "Due date",
                value: format(dueDate || new Date(), "MMM dd yyyy"),
                icon: <Calendar className="w-4 h-4 text-primary capitalize" />,
            },
            {
                labelName: "Priority",
                value: priority?.toString() || "",
                icon: <Flag className="w-4 h-4 text-primary capitalize" />,
            },
            {
                labelName: "Label",
                value: label?.name || "",
                icon: <Tag className="w-4 h-4 text-primary capitalize" />,
            },
        ];
        if (data) {
            setTodoDetails(data);
        }
    }, [dueDate, label?.name, priority, project]);

    // Handler for deleting a todo
    const handleDeleteTodo = (e: any) => {
        e.preventDefault();
        const deletedId = deleteATodoMutation({ taskId: _id });
        if (deletedId !== undefined) {
            toast({
                title: "🗑️ Successfully deleted",
                duration: 3000,
            });
        }
    };

    return (
        <DialogContent className="max-w-4xl lg:h-4/6 flex flex-col md:flex-row lg:justify-between text-right">
            <DialogHeader className="w-full">
                <DialogTitle>{taskName}</DialogTitle>
                <DialogDescription>
                    <p className="my-2 capitalize">{description}</p>
                    <div className="flex items-center gap-1 mt-12 border-b-2 border-gray-100 pb-2 flex-wrap sm:justify-between lg:gap-0 ">
                        {/* Sub-tasks section */}
                        <div className="flex gap-1">
                            <ChevronDown className="w-5 h-5 text-primary" />
                            <p className="font-bold flex text-sm text-gray-900">Sub-tasks</p>
                        </div>
                        <div>
                            <SuggestMissingTasks projectId={projectId} taskName={taskName} description={description} parentId={_id} isSubTask={true} />
                        </div>
                    </div>
                    {/* Todo details and actions */}
                    <div className="pl-4">
                        {/* Incomplete sub-todos */}
                        {inCompletedSubtodosByProject.map((task) => {
                            return (
                                <Task key={task._id} data={task} isCompleted={task.isCompleted} handleOnChange={() => checkASubTodoMutation({ taskId: task._id })}/>
                            );
                        })}
                        <div className="pb-4">
                            <AddTaskWrapper parentTask={data} />
                        </div>
                        {/* Completed sub-todos */}
                        {completedSubtodosByProject.map((task) => {
                        return (
                            <Task key={task._id} data={task} isCompleted={task.isCompleted} handleOnChange={() => unCheckASubTodoMutation({ taskId: task._id })}/>
                        );
                        })}
                    </div>
                </DialogDescription>
            </DialogHeader>
            {/* Details pane */}
            <div className="flex flex-col gap-2 bg-gray-100 lg:w-1/2">
                {/* Display todo details */}
                {todoDetails.map(({ labelName, value, icon }, idx) => (
                    <div key={`${value}-${idx}`} className="grid gap-2 p-4 border-b-2 w-full">
                        <Label className="flex items-start">{labelName}</Label>
                        <div className="flex text-left items-center justify-start gap-2 pb-2">
                            {icon}
                            <p className="text-sm">{value}</p>
                        </div>
                    </div>
                ))}
                {/* Delete button */}
                <div className="flex gap-2 p-4 w-full justify-end">
                    <form onSubmit={(e) => handleDeleteTodo(e)}>
                        <button type="submit">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </DialogContent>
    );
}
