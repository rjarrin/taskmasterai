"use client";
import { Search, SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";

export default function SearchForm() {
    // Initialize form methods using react-hook-form
    const form = useForm();
    // Get router instance for navigation
    const router = useRouter();

    // Define submit handler for the form
    const onSubmit = async ({ searchText }: any) => {
        console.log("submitted", { searchText });
        // Navigate to search results page with query
        router.push(`/loggedin/search/${searchText}`);
    };

    return (
        <Form {...form}>
            {/* Form element with submission handler */}
            <form className="lg:flex lg:items-center justify-end w-full" onSubmit={form.handleSubmit(onSubmit)}>
                {/* Container for search input and button */}
                <div className="relative flex gap-2 items-center w-full">
                    {/* Absolute positioning search icon */}
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    {/* Field for search input */}
                    <FormField control={form.control} name="searchText" render={({ field }) => (
                        <FormItem className="w-full">
                            {/* Control wrapper for input */}
                            <FormControl>
                                <Input id="searchText" type="search" required placeholder="Search tasks..." className="w-full appearance-none bg-background pl-8 shadow-none h-10" {...field}/>
                            </FormControl>
                        </FormItem>
                        )}>
                    </FormField>
                    <Button className="hover:bg-orange-600 px-4">
                        <SearchIcon className="h-4 w-4" />
                    </Button>
                </div>
            </form>
        </Form>
    );
}
