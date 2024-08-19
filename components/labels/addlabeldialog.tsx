import {
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";

export default function AddLabelDialog() {
    // Use mutation hook for creating a label
    const addLabelMutation = useMutation(api.labels.createALabel);
    // State to track loading status
    const [isLoading, setIsLoading] = useState(false);
    // Router instance for navigation
    const router = useRouter();
    // Toast notification handler
    const { toast } = useToast();
    // Form handling setup
    const form = useForm();

    // Function to handle form submission
    const onSubmit = async ({ name }: any) => {
        if (name) {
            setIsLoading(true);
            // Attempt to create a label with the provided name
            const labelId: Id<"labels"> | null = await addLabelMutation({ name });
            // Check if label creation was successful
            if (labelId !== undefined) {
                // Navigate to the label details page
                router.push(`/loggedin/filter-labels/${labelId}`);
                // Show success toast notification
                toast({
                    title: "😎 Successfully created a Label!",
                    duration: 5000,
                });
                setIsLoading(false);
            }
        }
    };

    return (
        <DialogContent className="max-w-xl lg:h-56 flex flex-col md:flex-row lg:justify-between text-right">
            <DialogHeader className="w-full">
                <DialogTitle>Add a Label</DialogTitle>
                <DialogDescription className="capitalize">
                    {/* Form setup */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 border-2 p-6 border-gray-200 my-2 rounded-sm border-foreground/20">
                            {/* Name input field */}
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input id="name" type="text" placeholder="Label name" required className="border-0 font-semibold text-lg" {...field} />
                                    </FormControl>
                                </FormItem>
                                )}>
                            </FormField>
                            {/* Submit button */}
                            <Button disabled={isLoading} className="">
                                {isLoading ? (
                                <div className="flex gap-2">
                                    <Loader className="h-5 w-5 text-primary" />
                                </div>) : ("Add")}
                            </Button>
                        </form>
                    </Form>
                </DialogDescription>
            </DialogHeader>
        </DialogContent>
    );
}
