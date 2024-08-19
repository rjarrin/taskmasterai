import { Doc } from "@/convex/_generated/dataModel";
import clsx from "clsx";
import { Calendar, GitBranch } from "lucide-react";
import moment from "moment";
import AddTaskDialog from "../add-tasks/addtaskdialog";
import { Checkbox } from "../ui/checkbox";
import { Dialog, DialogTrigger } from "../ui/dialog";

// Type guard to differentiate between tasks and subtasks based on the presence of a parentId property
function isSubTodo(data: Doc<"todos"> | Doc<"subTodos">): data is Doc<"subTodos"> {
    return "parentId" in data;
}

export default function Task({data, isCompleted, handleOnChange, showDetails = false, }:{ data: Doc<"todos"> | Doc<"subTodos">; isCompleted: boolean; handleOnChange: any; showDetails?: boolean;}) {
    const { taskName, dueDate } = data;

    return (
        <div key={data._id} className="flex items-center space-x-2 border-b-2 p-2 border-gray-100 animate-in fade-in" >
            {/* Dialog component wrapping the entire task item */}
            <Dialog>
                <div className="flex gap-2 items-center justify-end w-full">
                    <div className="flex gap-2 w-full">
                        {/* Checkbox for marking tasks as completed */}
                        <Checkbox id="todo" className={clsx("w-5 h-5 rounded-xl", isCompleted && "data-[state=checked]:bg-gray-300 border-gray-300")} checked={isCompleted} onCheckedChange={handleOnChange} />
                        {/* Trigger for showing the dialog to edit or delete the task */}
                        <DialogTrigger asChild>
                            <div className="flex flex-col items-start">
                                {/* Button displaying the task name, with details shown if showDetails is true */}
                                <button className={clsx("text-sm font-normal text-left", isCompleted && "line-through text-foreground/30" )}>{taskName}</button>
                                {/* Details section including git branch icon and due date */}
                                {showDetails && (
                                    <div className="flex gap-2">
                                        <div className="flex items-center justify-center gap-1">
                                            <GitBranch className="w-3 h-3 text-foreground/70" />
                                            <p className="text-xs text-foreground/70"></p>
                                        </div>
                                        <div className="flex items-center justify-center gap-1">
                                            <Calendar className="w-3 h-3 text-primary" />
                                            <p className="text-xs text-primary">{moment(dueDate).format("LL")}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </DialogTrigger>
                    </div>
                    {/* Conditional rendering of AddTaskDialog for non-subtasks */}
                    {!isSubTodo(data) && <AddTaskDialog data={data} />}
                </div>
            </Dialog>
        </div>
    );
}
