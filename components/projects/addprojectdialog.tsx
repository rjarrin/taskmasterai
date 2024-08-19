"use client";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

export default function AddProjectDialog() {
    return (
        <Dialog>
            {/* Trigger for opening the dialog */}
            <DialogTrigger id="closeDialog">
                <PlusIcon className="h-5 w-5" aria-label="Add a Project" />
            </DialogTrigger>
            {/* Content of the dialog for adding a project */}
            <AddProjectDialogContent />
        </Dialog>
    );
}

function AddProjectDialogContent() {
    // Initialize form with default values
    const form = useForm({ defaultValues: { name: "" } });
    // Setup toast notifications
    const { toast } = useToast();
    // Setup routing
    const router = useRouter();

    // Mutation hook for creating a project
    const createAProject = useMutation(api.projects.createAProject);

    // Handler for form submission
    const onSubmit = async ({ name }: any) => {
        console.log("submitted", { name });

        // Attempt to create a project with the submitted name
        const projectId = await createAProject({ name });

        // If successful, show success toast, reset form, and navigate to the project page
        if (projectId !== undefined) {
            toast({
                title: "🚀 Successfully created a project!",
                duration: 3000,
            });
            form.reset({ name: "" });
            router.push(`/loggedin/projects/${projectId}`);
        }
    };

    // Render method for the content of the dialog
    return (
        <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
            <DialogHeader className="w-full">
                <DialogTitle>Add a Project</DialogTitle>
                <DialogDescription className="capitalize">
                    {/* Form setup and submission */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20">
                            {/* Field for entering the project name */}
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input id="name" type="text" placeholder="Project name" required className="border-0 font-semibold text-lg" {...field} />
                                    </FormControl>
                                </FormItem>
                                )}>
                            </FormField>
                            {/* Submit button */}
                            <Button className="">Add</Button>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
