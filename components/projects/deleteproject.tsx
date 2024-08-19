import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { GET_STARTED_PROJECT_ID } from "@/utils";
import { useAction } from "convex/react";
import { EllipsisIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useToast } from "../ui/use-toast";

export default function DeleteProject({projectId,}: {projectId: Id<"projects">;}) {
    // Initialize form using react-hook-form with default values
    const form = useForm({ defaultValues: { name: "" } });
    // Get toast notification functionality
    const { toast } = useToast();
    // Get router instance for navigation
    const router = useRouter();

    // Use the deleteProject action from Convex
    const deleteProject = useAction(api.projects.deleteProjectAndItsTasks);

    // Define the onSubmit function for the form
    const onSubmit = async () => {
        // Check if the projectId is the system project ID
        if (projectId === GET_STARTED_PROJECT_ID) {
            // Show a toast notification indicating the system project cannot be deleted
            toast({
                title: "🤗 Just a reminder",
                description: "System projects are protected from deletion.",
                duration: 3000,
            });
        } else {
            // Attempt to delete the project and its tasks
            const deleteTaskId = await deleteProject({ projectId });

            // If the project was successfully deleted, show a success toast and redirect
            if (deleteTaskId !== undefined) {
                toast({
                    title: "🗑️ Successfully created a project",
                    duration: 3000,
                });
                router.push(`/loggedin/projects`);
            }
        }
    };

    return (
        <DropdownMenu>
            {/* Trigger for opening the dropdown menu */}
            <DropdownMenuTrigger>
                <EllipsisIcon className="w-5 h-5 text-foreground hover:cursor-pointer" />
            </DropdownMenuTrigger>
            {/* Content of the dropdown menu */}
            <DropdownMenuContent>
                {/* Label for the dropdown item */}
                <DropdownMenuLabel className="w-40 lg:w-56">
                    {/* Form for submitting the delete request */}
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Button to submit the form */}
                        <button type="submit" className="flex gap-2">
                            {/* Icon for the button */}
                            <Trash2 className="w-5 h-5 rotate-45 text-foreground/40" /> Delete Project
                        </button>
                    </form>
                </DropdownMenuLabel>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
