"use client";
import MobileNav from "@/components/navigation/mobilenav";
import SideBar from "@/components/navigation/sidebar";
import Todos from "@/components/todos/todos";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Search() {
    // Extract the search query parameter from the URL
    const { searchQuery } = useParams<{ searchQuery: string }>();
    // State to hold the search results
    const [searchResults, setSearchResults] = useState<any>([]);
    // State to indicate if a search is in progress
    const [searchInProgress, setSearchInProgress] = useState(false);
    // Action hook to perform the search operation
    const vectorSearch = useAction(api.search.searchTasks);

    // Log the current search query for debugging
    console.log({ searchQuery });

    // Effect hook to perform the search whenever the search query changes
    useEffect(() => {
        const handleSearch = async () => {
            // Reset search results and set search in progress
            setSearchResults([]);
            setSearchInProgress(true);
            try {
                // Perform the search and update the results
                const results = await vectorSearch({query: searchQuery,});
                setSearchResults(results);
            } finally {
                // Set search not in progress after completion
                setSearchInProgress(false);
            }
        };
        // Only perform the search if there is a valid query
        if (searchQuery) {
            handleSearch();
        }
    }, [searchQuery, vectorSearch]); // Re-run effect when searchQuery or vectorSearch changes

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <SideBar />
            <div className="flex flex-col">
                <MobileNav />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:px-8">
                    <div className="xl:px-40">
                        {/* Display search query */}
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold md:text-2xl">
                                Search Results for{" "}
                                <span>
                                    {`"`}
                                    {decodeURI(searchQuery)}
                                    {`"`}
                                </span>
                            </h1>
                        </div>
                        {/* Display uncompleted todos based on search results */}
                        <div className="flex flex-col gap-1 py-4">
                            <Todos items={searchResults.filter((item: any) => item.isCompleted === false)}/>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
