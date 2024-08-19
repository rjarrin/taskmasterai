import { CircleCheckBig } from "lucide-react";

export default function CompletedTodos({totalTodos = 0,}: {totalTodos: number;}) {
    // Displays the total number of completed tasks.
    return (
        <div className="flex items-center gap-1 border-b-2 p-2 border-gray-100  text-sm text-foreground/80">
            <>
                {/* Rendering the CircleCheckBig icon to visually indicate completed tasks. */}
                <CircleCheckBig />
                {/* Displaying the total number of completed tasks. */}
                <span>+ {totalTodos}</span>
                <span className="capitalize">completed tasks</span>
            </>
        </div>
    );
}
