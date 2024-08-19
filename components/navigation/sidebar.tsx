"use client";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { primaryNavigationItems } from "@/utils";
import { useQuery } from "convex/react";
import { Hash, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddLabelDialog from "../labels/addlabeldialog";
import AddProjectDialog from "../projects/addprojectdialog";
import { Dialog, DialogTrigger } from "../ui/dialog";
import UserProfile from "./userprofile";

// Interface for mapping list titles
interface MyListTitleType {
    [key: string]: string;
}

export default function SideBar() {
    // Use pathname hook to get current URL path
    const pathname = usePathname();
    // Fetch project list using Convex query hook
    const projectList = useQuery(api.projects.getProjects);
    // Mapping of title IDs to display names
    const LIST_OF_TITLE_IDS: MyListTitleType = {
        primary: "",
        projects: "My Projects",
    };
    // State to hold navigation items
    const [navItems, setNavItems] = useState([...primaryNavigationItems]);

    // Function to render project items based on the fetched project list
    const renderItems = (projectList: Array<Doc<"projects">>) => {
        return projectList.map(({ _id, name }, idx) => {
            return {
                ...(idx === 0 && { id: "projects" }),
                name,
                link: `/loggedin/projects/${_id.toString()}`,
                icon: <Hash className="w-4 h-4" />,
            };
        });
    };
    // Effect hook to update navigation items when project list changes
    useEffect(() => {
        if (projectList) {
            const projectItems = renderItems(projectList);
            const items = [...primaryNavigationItems, ...projectItems];
            setNavItems(items);
        }
    }, [projectList]);

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex justify-between h-14 items-center border-b p-1 lg:h-[60px] lg:px-2">
                    {/* User profile section */}
                    <UserProfile />
                </div>
                <nav className="grid items-start px-1 text-sm font-medium lg:px-4">
                {navItems.map(({ name, icon, link, id }, idx) => (
                    <div key={idx}>
                        {/* Conditional rendering for special nav items */}
                        {id && (
                            <div className={cn("flex items-center mt-6 mb-2", id === "filters" && "my-0")}>
                                <p className="flex flex-1 text-base">{LIST_OF_TITLE_IDS[id]}</p>
                                {/* Conditional rendering of dialog components */}
                                {LIST_OF_TITLE_IDS[id] === "My Projects" && (<AddProjectDialog />)}
                            </div>
                        )}
                        <div className={cn("flex items-center lg:w-full")}>
                            <div className={cn("flex items-center text-left lg:gap-3 rounded-lg py-2 transition-all hover:text-primary justify-between w-full", pathname === link ? "active rounded-lg bg-primary/10 text-primary transition-all hover:text-primary" : "text-foreground ")}>
                                <Link key={idx} href={link} className={cn("flex items-center text-left gap-3 rounded-lg transition-all hover:text-primary w-full")}>
                                    <div className="flex gap-4 items-center w-full">
                                        <div className="flex gap-2 items-center">
                                            <p className="flex text-base text-left">{icon || <Hash />}</p>
                                            <p>{name}</p>
                                        </div>
                                    </div>
                                </Link>
                                {/* Conditional rendering of dialog trigger for filters */}
                                {id === "filters" && (
                                    <Dialog>
                                        <DialogTrigger id="closeDialog">
                                            <PlusIcon className="h-5 w-5" aria-label="Add a Label" />
                                        </DialogTrigger>
                                        <AddLabelDialog />
                                    </Dialog>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                </nav>
            </div>
            <div className="mt-auto p-4">
                {/* Upgrade card section */}
                <Card x-chunk="dashboard-02-chunk-0">
                    <CardHeader className="p-2 pt-0 md:p-4">
                        <CardTitle>Upgrade to Pro</CardTitle>
                        <CardDescription>Unlock all features and get unlimited access to our support team.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                        <Button size="sm" className="w-full">Upgrade</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
