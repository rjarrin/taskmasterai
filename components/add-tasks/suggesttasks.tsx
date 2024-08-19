import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

// Component for suggesting missing tasks or subtasks via AI.
export default function SuggestMissingTasks({projectId, isSubTask = false, taskName = "", description = "", parentId,}:{projectId: Id<"projects">; isSubTask?: boolean; taskName?: string; description?: string; parentId?: Id<"todos">;}) {
    // State to track loading status of the suggestion process
    const [isLoadingSuggestMissingTasks, setIsLoadingSuggestMissingTasks] = useState(false);
    
    // Actions for suggesting missing items and subitems with AI
    const suggestMissingTasks = useAction(api.googleai.suggestMissingItemsWithAi) || [];
    const suggestMissingSubTasks = useAction(api.googleai.suggestMissingSubItemsWithAi) || [];

    // Handler for suggesting missing tasks.
    const handleMissingTasks = async () => {
        setIsLoadingSuggestMissingTasks(true);
        try {
            await suggestMissingTasks({ projectId });
        } catch (error) {
            console.log("Error in suggestMissingTasks", error);
        } finally {
            setIsLoadingSuggestMissingTasks(false);
        }
    };

    // Handler for suggesting missing subtasks.
    const handleMissingSubTasks = async () => {
        setIsLoadingSuggestMissingTasks(true);
        try {
            if (parentId) {
                await suggestMissingSubTasks({projectId, taskName, description, parentId,});
            }
        } catch (error) {
            console.log("Error in suggestMissingSubTasks", error);
        } finally {
            setIsLoadingSuggestMissingTasks(false);
        }
    };

    return (
        <>
            <Button variant={"outline"} disabled={isLoadingSuggestMissingTasks} onClick={isSubTask ? handleMissingSubTasks : handleMissingTasks}>
                {isLoadingSuggestMissingTasks ? (
                    <div className="flex gap-2">
                        Loading Tasks (AI)
                        <Loader className="h-5 w-5 text-primary" />
                    </div>
                ) : ("Suggest Missing Tasks (AI)")}
            </Button>
        </>
    );
}
