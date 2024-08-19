"use client";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Hash } from "lucide-react";
import Link from "next/link";
import { Label } from "../ui/label";


export default function ProjectList() {
    // Fetches the list of projects using the Convex query hook.
    const projects = useQuery(api.projects.getProjects);
    return (
        <div className="xl:px-40">
            {/* Header section */}
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Projects</h1>
            </div>
            {/* Projects list container */}
            <div className="flex flex-col gap-1 py-4">
                {/* Maps over each project and renders a link to view details */}
                {projects?.map((project) => {
                    return (
                        <Link key={project._id} href={`/loggedin/projects/${project._id}`}>
                            <div className="flex items-center space-x-2 border-b-2 p-2 border-gray-100">
                                {/* Project icon */}
                                <Hash className="text-primary w-5" />
                                {/* Project name displayed as a clickable label */}
                                <Label htmlFor="projects" className="text-base font-normal hover:cursor-pointer"
                                >{project.name}</Label>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
