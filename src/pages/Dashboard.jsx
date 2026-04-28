import React from "react";
import {
    Briefcase,
    Sparkles,
    PencilLine,
    UsersRound,
} from "lucide-react";
import Sidebar from "../components/Sidebar";
import BookingsOverview from "../components/BookingsOverview";
import DashboardStatsCard from "../components/DashboardStatsCard";
import CreateNewPacakge from "../components/CreateNewPacakge";

const statsCards = [
    {
        title: "Total Packages",
        value: "128",
        subtitle: "vs last month",
        change: "↑ 12.5%",
        icon: Briefcase,
        iconBgClass: "bg-violet-100",
        iconColorClass: "text-violet-600",
    },
    {
        title: "AI Generated",
        value: "45",
        subtitle: "of total packages",
        change: "35.2%",
        icon: Sparkles,
        iconBgClass: "bg-blue-100",
        iconColorClass: "text-blue-600",
        changeBgClass: "bg-blue-100",
        changeTextClass: "text-blue-600",
    },
    {
        title: "Manual Packages",
        value: "62",
        subtitle: "of total packages",
        change: "48.4%",
        icon: PencilLine,
        iconBgClass: "bg-emerald-100",
        iconColorClass: "text-emerald-600",
    },
    {
        title: "Total Bookings",
        value: "342",
        subtitle: "vs last month",
        change: "↑ 18.6%",
        icon: UsersRound,
        iconBgClass: "bg-pink-100",
        iconColorClass: "text-pink-600",
    },
];

const Dashboard = () => {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <Sidebar />
            <main className="flex-1 px-6 py-5">
                <div>
                    <div className="heading">
                        <h2 className="text-3xl font-semibold">Dashboard</h2>
                        <p className="text-sm">
                            Welcome back, Sarah! Here's what's happening with your
                            Packages.
                        </p>
                    </div>

                    <section className="dashboardCards mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                        {statsCards.map((card) => (
                            <DashboardStatsCard key={card.title}
                                title={card.title}
                                value={card.value}
                                subtitle={card.subtitle}
                                change={card.change}
                                icon={card.icon}
                                iconBgClass={card.iconBgClass}
                                iconColorClass={card.iconColorClass}
                                changeBgClass={card.changeBgClass}
                                changeTextClass={card.changeTextClass} />
                        ))}
                    </section>
                    <div className="mt-4 grid gap-4 2xl:grid-cols-6">
                        <div className="col-span-4 h-full">
                            <CreateNewPacakge />
                        </div>
                        <div className="col-span-2 h-full">
                            <BookingsOverview />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;