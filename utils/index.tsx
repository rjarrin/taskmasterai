import { Calendar, CalendarDays, Grid2X2, Inbox } from "lucide-react";

export const primaryNavigationItems = [
    {
        id: "primary",
        name: "inbox",
        link: "/loggedin",
        icon: <Inbox className="w-4 h-4" />
    },
    {
        id: "Today",
        link: "/loggedin/today",
        icon: <Calendar className="w-4 h-4" />
    },
    {
        id: "Upcoming",
        link: "/loggedin/upcoming",
        icon: <CalendarDays className="w-4 h-4" />
    },
    {
        id: "filters",
        name: "Filters and Labels",
        link: "/loggedin/filter-labels",
        icon: <Grid2X2 className="w-4 h-4" />
    },
];

export const GET_STARTED_PROJECT_ID = 'k97fkkwvfmfkjknvdp5z4ygkg96ycnd1';
// LABEL_ID = 'k57780kfxc0kxb0zcgeyjw7xs16yd4sh'