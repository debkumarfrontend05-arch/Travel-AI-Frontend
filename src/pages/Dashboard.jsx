import React, { useEffect, useMemo, useState } from "react";
import {
    Briefcase,
    Sparkles,
    PencilLine,
    UsersRound,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar";
import BookingsOverview from "../components/BookingsOverview";
import DashboardStatsCard from "../components/DashboardStatsCard";
import CreateNewPackage from "../components/CreateNewPackage";
import API_URL from "../api";
import AllPackageTable from "../components/AllPackageTable";


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

const fallbackImage = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=200&q=80";

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


//
const Dashboard = () => {
    const [recentPackages, setRecentPackages] = useState([]);
    const [isStatsLoading, setIsStatsLoading] = useState(true);
    const [selectedDeletePackage, setSelectedDeletePackage] = useState(null);
    const [selectedEditPackage, setSelectedEditPackage] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        destination: "",
        duration: "",
        type: "Manual",
        route: "",
    });
    const liveStatsCards = useMemo(
        () =>
            statsCards.map((card) =>
                card.title === "Total Packages"
                    ? { ...card, value: String(recentPackages.length) }
                    : card
            ),
        [recentPackages.length]
    );
    
    useEffect(() => {
        const loadRecentPackages = async () => {
            setIsStatsLoading(true);
            try {
                const response = await fetch(`${API_URL}/packages`);
                const data = await response.json();
                const rows = Array.isArray(data) ? data : [];
                setRecentPackages(rows);
            } catch (error) {
                console.error("Failed to load recent packages", error);
                setRecentPackages([]);
            } finally {
                setIsStatsLoading(false);
            }
        };

        loadRecentPackages();
    }, []);

    

    const mappedRecentPackages = useMemo(() => {
        return recentPackages.map((pkg) => {
            const days = pkg?.duration?.days ?? 0;
            const nights = pkg?.duration?.nights ?? 0;
            const typeLabel =
                pkg?.createdVia === "ai"
                    ? "AI Generated"
                    : pkg?.createdVia === "md"
                        ? "MD Prompt"
                        : "Manual";
            const destination = pkg?.state || pkg?.city || "-";
            const updatedDate = pkg?.updatedAt || pkg?.createdAt;
            const route = pkg?.itinerary
                ?.map((day) => day?.title)
                .filter(Boolean)
                .slice(0, 3)
                .join(" - ");

            return {
                id: pkg?._id || pkg?.id || pkg?.packageId || pkg?.title,
                name: pkg?.title || "Untitled Package",
                route: route || pkg?.city || destination,
                destination,
                duration: `${days}D / ${nights}N`,
                type: typeLabel,
                bookings: pkg?.bookingsCount ?? 0,
                updated: updatedDate ? new Date(updatedDate).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "-",
                image: pkg?.coverImage || fallbackImage,
                raw: pkg,
            };
        });
    }, [recentPackages]);

    const handleEditPackage = (pkg) => {
        setEditForm({
            name: pkg?.name || "",
            destination: pkg?.destination || "",
            duration: pkg?.duration || "",
            type: pkg?.type || "Manual",
            route: pkg?.route || "",
        });
        setSelectedEditPackage(pkg);
    };

    const handleDeletePackage = (pkg) => {
        setSelectedDeletePackage(pkg);
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

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
                        {liveStatsCards.map((card) => (
                            <DashboardStatsCard key={card.title}
                                title={card.title}
                                value={card.value}
                                subtitle={card.subtitle}
                                change={card.change}
                                icon={card.icon}
                                iconBgClass={card.iconBgClass}
                                iconColorClass={card.iconColorClass}
                                isLoading={isStatsLoading}
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
                                <AllPackageTable
                                    recentPackages={mappedRecentPackages}
                                    onEditPackage={handleEditPackage}
                                    onDeletePackage={handleDeletePackage}
                                    isLoading={isStatsLoading}
                                />
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
                                                <p className="text-3xl font-semibold text-slate-900">{recentPackages.length}</p>
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
                                                <p className="text-3xl font-semibold text-slate-900">{recentPackages.length}</p>
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
            {selectedDeletePackage ? (
                <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
                        <h4 className="text-lg font-semibold text-slate-900">Delete Package</h4>
                        <p className="mt-2 text-sm text-slate-600">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-slate-800">{selectedDeletePackage?.name}</span>?
                        </p>
                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedDeletePackage(null)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedDeletePackage(null)}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            {selectedEditPackage ? (
                <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-2xl rounded-2xl bg-white p-5 shadow-xl">
                        <h4 className="text-lg font-semibold text-slate-900">Edit Package</h4>
                        <p className="mt-1 text-sm text-slate-500">Update package information for dashboard listing.</p>

                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            <label className="grid gap-1 text-sm text-slate-700">
                                Package Name
                                <input
                                    type="text"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleEditFormChange}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                />
                            </label>
                            <label className="grid gap-1 text-sm text-slate-700">
                                Destination
                                <input
                                    type="text"
                                    name="destination"
                                    value={editForm.destination}
                                    onChange={handleEditFormChange}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                />
                            </label>
                            <label className="grid gap-1 text-sm text-slate-700">
                                Days / Nights
                                <input
                                    type="text"
                                    name="duration"
                                    value={editForm.duration}
                                    onChange={handleEditFormChange}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                />
                            </label>
                            <label className="grid gap-1 text-sm text-slate-700">
                                Type
                                <select
                                    name="type"
                                    value={editForm.type}
                                    onChange={handleEditFormChange}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                >
                                    <option value="Manual">Manual</option>
                                    <option value="AI Generated">AI Generated</option>
                                    <option value="MD Prompt">MD Prompt</option>
                                </select>
                            </label>
                            <label className="grid gap-1 text-sm text-slate-700 sm:col-span-2">
                                Route
                                <input
                                    type="text"
                                    name="route"
                                    value={editForm.route}
                                    onChange={handleEditFormChange}
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                />
                            </label>
                        </div>

                        <div className="mt-5 flex items-center justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setSelectedEditPackage(null)}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedEditPackage(null)}
                                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                            >
                                Update Package
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Dashboard;
