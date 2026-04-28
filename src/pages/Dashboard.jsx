import React from "react";
import {
    Briefcase,
    Sparkles,
    PencilLine,
    UsersRound,
    MoreVertical,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar";
import BookingsOverview from "../components/BookingsOverview";
import DashboardStatsCard from "../components/DashboardStatsCard";
import CreateNewPackage from "../components/CreateNewPackage";

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

const recentPackages = [
    {
        name: "Thailand Getaway",
        route: "Bangkok - Phuket",
        destination: "Thailand",
        duration: "6D / 5N",
        type: "AI Generated",
        status: "Published",
        bookings: 48,
        updated: "12 May, 2025",
        image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Kerala Backwaters",
        route: "Kochi - Alleppey - Munnar",
        destination: "Kerala",
        duration: "5D / 4N",
        type: "Manual",
        status: "Published",
        bookings: 36,
        updated: "11 May, 2025",
        image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Dubai Explorer",
        route: "Dubai - Abu Dhabi",
        destination: "Dubai",
        duration: "4D / 3N",
        type: "MD Prompt",
        status: "Draft",
        bookings: 12,
        updated: "10 May, 2025",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Bali Bliss",
        route: "Ubud - Kuta - Nusa Dua",
        destination: "Bali",
        duration: "6D / 5N",
        type: "AI Generated",
        status: "Published",
        bookings: 62,
        updated: "09 May, 2025",
        image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Singapore Delight",
        route: "Singapore",
        destination: "Singapore",
        duration: "3D / 2N",
        type: "Manual",
        status: "Published",
        bookings: 41,
        updated: "08 May, 2025",
        image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Maldives Escape",
        route: "Male - North Male Atoll",
        destination: "Maldives",
        duration: "5D / 4N",
        type: "Manual",
        status: "Published",
        bookings: 29,
        updated: "07 May, 2025",
        image: "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Japan Discovery",
        route: "Tokyo - Kyoto - Osaka",
        destination: "Japan",
        duration: "8D / 7N",
        type: "MD Prompt",
        status: "Draft",
        bookings: 17,
        updated: "06 May, 2025",
        image: "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Swiss Adventure",
        route: "Zurich - Interlaken - Lucerne",
        destination: "Switzerland",
        duration: "7D / 6N",
        type: "AI Generated",
        status: "Published",
        bookings: 33,
        updated: "05 May, 2025",
        image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Andaman Retreat",
        route: "Port Blair - Havelock",
        destination: "Andaman",
        duration: "5D / 4N",
        type: "Manual",
        status: "Published",
        bookings: 21,
        updated: "04 May, 2025",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Vietnam Highlights",
        route: "Hanoi - Da Nang - Ho Chi Minh",
        destination: "Vietnam",
        duration: "6D / 5N",
        type: "AI Generated",
        status: "Draft",
        bookings: 15,
        updated: "03 May, 2025",
        image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=200&q=80",
    },
];

const destinationBreakdown = [
    { name: "Thailand", value: 35, color: "#6d5efc" },
    { name: "Kerala", value: 22, color: "#4f8df7" },
    { name: "Dubai", value: 15, color: "#35c88a" },
    { name: "Bali", value: 12, color: "#ffa44b" },
    { name: "Singapore", value: 8, color: "#f48aa8" },
    { name: "Others", value: 8, color: "#c8cfdf" },
];

const typeBreakdown = [
    { name: "Manual", count: 48, percentText: "37.5%", chartPercent: 38, color: "#4f8df7" },
    { name: "AI Generated", count: 45, percentText: "35.2%", chartPercent: 35, color: "#8b6df9" },
    { name: "MD Prompt", count: 35, percentText: "27.3%", chartPercent: 27, color: "#ffa44b" },
];

const typeBadgeClassMap = {
    "AI Generated": "bg-violet-100 text-violet-600",
    Manual: "bg-blue-100 text-blue-600",
    "MD Prompt": "bg-orange-100 text-orange-600",
};

const statusBadgeClassMap = {
    Published: "bg-emerald-100 text-emerald-600",
    Draft: "bg-amber-100 text-amber-600",
};

const Dashboard = () => {
    const typeChartData = typeBreakdown.map((item) => ({
        name: item.name,
        value: item.chartPercent,
        color: item.color,
    }));

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
                            <CreateNewPackage/>
                        </div>
                        <div className="col-span-2 h-full">
                            <BookingsOverview />
                        </div>
                    </div>
                    <div className="mt-4 newsection">
                        <div className="mt-5 grid gap-4 xl:grid-cols-12">
                            <div className="col-span-8 h-full">
                                <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                                    <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                                        <h3 className="text-3xl font-semibold text-slate-900">Recent Packages</h3>
                                        <button className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-100">
                                            View all
                                        </button>
                                    </div>
                                    <div className="flex-1 overflow-auto">
                                        <table className="w-full min-w-[860px]">
                                            <thead className="bg-slate-50 text-left text-sm text-slate-600">
                                                <tr>
                                                    <th className="px-5 py-3 font-semibold">Package Name</th>
                                                    <th className="px-5 py-3 font-semibold">Destination</th>
                                                    <th className="px-5 py-3 font-semibold">Days / Nights</th>
                                                    <th className="px-5 py-3 font-semibold">Type</th>
                                                    <th className="px-5 py-3 font-semibold">Bookings</th>
                                                    <th className="px-5 py-3 font-semibold">Updated</th>
                                                    <th className="px-5 py-3 font-semibold" />
                                                </tr>
                                            </thead>
                                            <tbody className="text-sm text-slate-700">
                                                {recentPackages.map((pkg) => (
                                                    <tr key={pkg.name} className="border-t border-slate-100">
                                                        <td className="px-5 py-3">
                                                            <div className="flex items-center gap-3">
                                                                <img src={pkg.image} alt={pkg.name} className="h-10 w-10 rounded-lg object-cover" />
                                                                <div>
                                                                    <p className="font-semibold text-slate-800">{pkg.name}</p>
                                                                    <p className="text-xs text-slate-500">{pkg.route}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-5 py-3">{pkg.destination}</td>
                                                        <td className="px-5 py-3">{pkg.duration}</td>
                                                        <td className="px-5 py-3">
                                                            <span className={`rounded-md px-2 py-1 text-xs font-semibold ${typeBadgeClassMap[pkg.type]}`}>
                                                                {pkg.type}
                                                            </span>
                                                        </td>
                                                        <td className="px-5 py-3">{pkg.bookings}</td>
                                                        <td className="px-5 py-3">{pkg.updated}</td>
                                                        <td className="px-5 py-3">
                                                            <button className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                                                                <MoreVertical size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
                                        <p>Showing 1 to 10 of 128 packages</p>
                                        <div className="flex items-center gap-2">
                                            <button className="rounded-md border border-slate-200 p-2 text-slate-400">
                                                <ChevronLeft size={14} />
                                            </button>
                                            <button className="h-8 w-8 rounded-md bg-violet-100 text-sm font-semibold text-violet-600">1</button>
                                            <button className="h-8 w-8 rounded-md text-sm font-semibold text-slate-500">2</button>
                                            <button className="h-8 w-8 rounded-md text-sm font-semibold text-slate-500">3</button>
                                            <span className="px-1">...</span>
                                            <button className="h-8 w-8 rounded-md text-sm font-semibold text-slate-500">26</button>
                                            <button className="rounded-md border border-slate-200 p-2 text-slate-500">
                                                <ChevronRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className="col-span-4 h-full">
                                <div className="grid h-full gap-4 md:grid-cols-1">
                                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h4 className="text-3xl font-semibold text-slate-900">Top Destinations</h4>
                                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center xl:flex-col xl:items-start">
                                        <div className="relative mx-auto h-44 w-44">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={destinationBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={82} paddingAngle={2}>
                                                        {destinationBreakdown.map((item) => (
                                                            <Cell key={item.name} fill={item.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-center">
                                                <p className="text-3xl font-semibold text-slate-900">128</p>
                                                <p className="text-sm text-slate-500">Total</p>
                                            </div>
                                        </div>
                                        <ul className="w-full space-y-2">
                                            {destinationBreakdown.map((item) => (
                                                <li key={item.name} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                        {item.name}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{item.value}%</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>

                                <section className="rounded-2xl border border-slate-200 bg-white p-5">
                                    <h4 className="text-3xl font-semibold text-slate-900">Package by Type</h4>
                                    <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center xl:flex-col xl:items-start">
                                        <div className="relative mx-auto h-44 w-44">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie data={typeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={82} paddingAngle={2}>
                                                        {typeChartData.map((item) => (
                                                            <Cell key={item.name} fill={item.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip formatter={(value) => [`${value}%`, "Share"]} />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-center">
                                                <p className="text-3xl font-semibold text-slate-900">128</p>
                                                <p className="text-sm text-slate-500">Total</p>
                                            </div>
                                        </div>
                                        <ul className="w-full space-y-3">
                                            {typeBreakdown.map((item) => (
                                                <li key={item.name} className="flex items-center justify-between text-sm">
                                                    <div className="flex items-center gap-2 text-slate-600">
                                                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                                        {item.name}
                                                    </div>
                                                    <span className="font-semibold text-slate-700">{item.count} ({item.percentText})</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </section>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
