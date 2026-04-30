import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    Briefcase,
    Sparkles,
    PencilLine,
    FileText,
} from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import Sidebar from "../components/Sidebar";
import BookingsOverview from "../components/BookingsOverview";
import DashboardStatsCard from "../components/DashboardStatsCard";
import CreateNewPackage from "../components/CreateNewPackage";
import API_URL, { fetchHotels, fetchTransfers, fetchMeals, fetchSightseeing } from "../api";
import AllPackageTable from "../components/AllPackageTable";
import toast from "react-hot-toast";


const fallbackImage = "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=200&q=80";
const resolvePackageImage = (pkg) => {
    const rawImage =
        pkg?.coverImage?.url ||
        pkg?.coverImage?.path ||
        pkg?.coverImage?.filename ||
        pkg?.coverImage ||
        pkg?.image?.url ||
        pkg?.image?.path ||
        pkg?.image?.filename ||
        pkg?.image ||
        "";

    if (!rawImage || typeof rawImage !== "string") return fallbackImage;

    if (/^https?:\/\//i.test(rawImage)) return rawImage;

    const normalized = rawImage.replace(/\\/g, "/");
    const uploadPath = normalized.startsWith("/")
        ? normalized
        : normalized.startsWith("uploads/")
            ? `/${normalized}`
            : `/uploads/${normalized}`;

    return `${API_URL.replace(/\/api\/?$/, "")}${uploadPath}`;
};

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
    const [isDeletingPackage, setIsDeletingPackage] = useState(false);
    const [selectedEditPackage, setSelectedEditPackage] = useState(null);
    const [isUpdatingPackage, setIsUpdatingPackage] = useState(false);
    const [editImageUrl, setEditImageUrl] = useState("");
    const [editItinerary, setEditItinerary] = useState([]);
    const [editForm, setEditForm] = useState({
        name: "",
        destination: "",
        duration: "",
        type: "Manual",
        route: "",
    });
    const [masterHotels, setMasterHotels] = useState([]);
    const [masterTransfers, setMasterTransfers] = useState([]);
    const [masterMeals, setMasterMeals] = useState([]);
    const [masterSightseeing, setMasterSightseeing] = useState([]);

    useEffect(() => {
        const loadMasterData = async () => {
            try {
                const [h, t, m, s] = await Promise.all([
                    fetchHotels(),
                    fetchTransfers(),
                    fetchMeals(),
                    fetchSightseeing()
                ]);
                setMasterHotels(Array.isArray(h) ? h : []);
                setMasterTransfers(Array.isArray(t) ? t : []);
                setMasterMeals(Array.isArray(m) ? m : []);
                setMasterSightseeing(Array.isArray(s) ? s : []);
            } catch (err) {
                console.error("Failed to load master data", err);
            }
        };
        loadMasterData();
    }, []);

    const destinationPalette = ["#6d5efc", "#4f8df7", "#35c88a", "#ffa44b", "#f48aa8", "#22c55e"];
    const liveStatsCards = useMemo(() => {
        const totalPackages = recentPackages.length;
        const aiCount = recentPackages.filter((pkg) => pkg?.createdVia === "ai").length;
        const mdCount = recentPackages.filter((pkg) => pkg?.createdVia === "md").length;
        const manualCount = Math.max(0, totalPackages - aiCount - mdCount);

        const toPercent = (value) =>
            totalPackages > 0 ? `${((value / totalPackages) * 100).toFixed(1)}%` : "0.0%";

        return [
            {
                title: "Total Packages",
                value: String(totalPackages),
                subtitle: "live packages",
                change: "",
                icon: Briefcase,
                iconBgClass: "bg-violet-100",
                iconColorClass: "text-violet-600",
            },
            {
                title: "AI Generated",
                value: String(aiCount),
                subtitle: "of total packages",
                change: toPercent(aiCount),
                icon: Sparkles,
                iconBgClass: "bg-blue-100",
                iconColorClass: "text-blue-600",
            },
            {
                title: "Manual Packages",
                value: String(manualCount),
                subtitle: "of total packages",
                change: toPercent(manualCount),
                icon: PencilLine,
                iconBgClass: "bg-emerald-100",
                iconColorClass: "text-emerald-600",
            },
            {
                title: "MD Prompt Generator",
                value: String(mdCount),
                subtitle: "of total packages",
                change: toPercent(mdCount),
                icon: FileText,
                iconBgClass: "bg-pink-100",
                iconColorClass: "text-pink-600",
            },
        ];
    }, [recentPackages]);
    const loadRecentPackages = useCallback(async () => {
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
    }, []);

    useEffect(() => {
        loadRecentPackages();
    }, [loadRecentPackages]);



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
                image: resolvePackageImage(pkg),
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
        setEditImageUrl(pkg?.image || "");
        setEditItinerary(Array.isArray(pkg?.raw?.itinerary) ? pkg.raw.itinerary : []);
        setSelectedEditPackage(pkg);
    };

    const handleDeletePackage = (pkg) => {
        setSelectedDeletePackage(pkg);
    };

    const confirmDeletePackage = async () => {
        const packageId =
            selectedDeletePackage?.raw?._id ||
            selectedDeletePackage?.raw?.id ||
            selectedDeletePackage?.id;

        if (!packageId) return;

        setIsDeletingPackage(true);
        try {
            const response = await fetch(`${API_URL}/packages/${packageId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete package");
            }

            setRecentPackages((prev) =>
                prev.filter((pkg) => {
                    const currentId = pkg?._id || pkg?.id || pkg?.packageId || pkg?.title;
                    return String(currentId) !== String(packageId);
                })
            );
            setSelectedDeletePackage(null);
            toast.success("Package deleted successfully.");
        } catch (error) {
            console.error("Failed to delete package", error);
            toast.error("Failed to delete package");
        } finally {
            setIsDeletingPackage(false);
        }
    };

    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };
    const selectedEditItinerary = editItinerary;
    const parseDurationInput = (durationText) => {
        const text = String(durationText || "").trim();
        const compactMatch = text.match(/(\d+)\s*D\s*\/\s*(\d+)\s*N/i);
        if (compactMatch) {
            return { days: Number(compactMatch[1]), nights: Number(compactMatch[2]) };
        }
        const verboseMatch = text.match(/(\d+)\s*days?\s*\/\s*(\d+)\s*nights?/i);
        if (verboseMatch) {
            return { days: Number(verboseMatch[1]), nights: Number(verboseMatch[2]) };
        }
        return { days: 0, nights: 0 };
    };
    const handleEditDayTitleChange = (index, value) => {
        setEditItinerary((prev) =>
            prev.map((day, idx) => (idx === index ? { ...day, title: value } : day))
        );
    };
    const getFieldValue = (day, field) => {
        if (field === "Hotel" && day.hotel) return day.hotel;
        if (field === "Transfer" && day.transfer) return day.transfer;
        if (field === "Meal" && Array.isArray(day.meals) && day.meals.length > 0) return day.meals[0];
        if (field === "Sightseeing" && Array.isArray(day.sightseeing) && day.sightseeing.length > 0) return day.sightseeing[0];
        if (field === "Information" && day.info) return day.info;

        if (Array.isArray(day.activities)) {
            if (field !== "Information") {
                const typedAct = day.activities.find(a => a.type === field);
                if (typedAct && typedAct.detail1) return typedAct.detail1;
            }
            const prefix = `${field}:`;
            const stringAct = day.activities.find(a => {
                const text = typeof a === "string" ? a : (a?.title || a?.detail1 || "");
                return text.startsWith(prefix);
            });
            if (stringAct) {
                const text = typeof stringAct === "string" ? stringAct : (stringAct?.title || stringAct?.detail1 || "");
                return text.substring(prefix.length).trim();
            }
        }
        return "";
    };

    const handleEditDayFieldChange = (index, field, value) => {
        setEditItinerary((prev) =>
            prev.map((day, idx) => {
                if (idx !== index) return day;
                const updatedDay = { ...day };

                if (field === "Hotel") updatedDay.hotel = value;
                if (field === "Transfer") updatedDay.transfer = value;
                if (field === "Meal") updatedDay.meals = [value];
                if (field === "Sightseeing") updatedDay.sightseeing = [value];
                if (field === "Information") updatedDay.info = value;

                const h = field === "Hotel" ? value : getFieldValue(day, "Hotel");
                const t = field === "Transfer" ? value : getFieldValue(day, "Transfer");
                const m = field === "Meal" ? value : getFieldValue(day, "Meal");
                const s = field === "Sightseeing" ? value : getFieldValue(day, "Sightseeing");
                const i = field === "Information" ? value : getFieldValue(day, "Information");

                updatedDay.activities = [
                    { id: `edited-${idx}-0`, type: "Information", title: `Hotel: ${h || "-"}`, detail1: `Hotel: ${h || "-"}`, detail2: "", status: "Planned" },
                    { id: `edited-${idx}-1`, type: "Information", title: `Transfer: ${t || "-"}`, detail1: `Transfer: ${t || "-"}`, detail2: "", status: "Planned" },
                    { id: `edited-${idx}-2`, type: "Information", title: `Meal: ${m || "-"}`, detail1: `Meal: ${m || "-"}`, detail2: "", status: "Planned" },
                    { id: `edited-${idx}-3`, type: "Information", title: `Sightseeing: ${s || "-"}`, detail1: `Sightseeing: ${s || "-"}`, detail2: "", status: "Planned" },
                    { id: `edited-${idx}-4`, type: "Information", title: `Information: ${i || "-"}`, detail1: `Information: ${i || "-"}`, detail2: "", status: "Planned" }
                ];
                return updatedDay;
            })
        );
    };
    const handleUpdatePackage = async () => {
        const packageId =
            selectedEditPackage?.raw?._id ||
            selectedEditPackage?.raw?.id ||
            selectedEditPackage?.id;

        if (!packageId) {
            toast.error("Package id missing.");
            return;
        }

        const duration = parseDurationInput(editForm.duration);
        const baseRaw = selectedEditPackage?.raw || {};
        const payload = {
            ...baseRaw,
            title: editForm.name || baseRaw.title || "Untitled Package",
            state: editForm.destination || baseRaw.state || "",
            city: editForm.destination || baseRaw.city || "",
            duration: {
                days: Number(duration.days || baseRaw?.duration?.days || 0),
                nights: Number(duration.nights || baseRaw?.duration?.nights || 0),
            },
            itinerary: editItinerary,
        };

        if (editImageUrl) {
            payload.image = editImageUrl;
            payload.coverImage = editImageUrl;
        }

        setIsUpdatingPackage(true);
        try {
            const response = await fetch(`${API_URL}/packages/${packageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error("Failed to update package");
            }

            toast.success("Package updated successfully.");
            setSelectedEditPackage(null);
            setEditItinerary([]);
            setEditImageUrl("");
            await loadRecentPackages();
        } catch (error) {
            console.error("Failed to update package", error);
            toast.error(error?.message || "Failed to update package");
        } finally {
            setIsUpdatingPackage(false);
        }
    };

    const destinationBreakdown = useMemo(() => {
        const destinationCounts = recentPackages.reduce((acc, pkg) => {
            const destination = (pkg?.state || pkg?.city || "Unknown").trim();
            const key = destination || "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        const sorted = Object.entries(destinationCounts)
            .sort((a, b) => b[1] - a[1]);

        const topEntries = sorted.slice(0, 5);
        const othersCount = sorted.slice(5).reduce((sum, [, count]) => sum + count, 0);
        const total = recentPackages.length || 1;

        const items = topEntries.map(([name, count], index) => ({
            name,
            count,
            value: Number(((count / total) * 100).toFixed(1)),
            color: destinationPalette[index % destinationPalette.length],
        }));

        if (othersCount > 0) {
            items.push({
                name: "Others",
                count: othersCount,
                value: Number(((othersCount / total) * 100).toFixed(1)),
                color: "#c8cfdf",
            });
        }

        return items;
    }, [recentPackages]);

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
                            <CreateNewPackage onPackageCreated={loadRecentPackages} />
                        </div>
                        <div className="col-span-2 h-full">
                            <BookingsOverview packages={recentPackages} />
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
                                                        <span className="font-semibold text-slate-700">{item.count} ({item.value}%)</span>
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
                                disabled={isDeletingPackage}
                                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={confirmDeletePackage}
                                disabled={isDeletingPackage}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-300"
                            >
                                {isDeletingPackage ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
            {selectedEditPackage ? (
                <div data-lenis-prevent className="fixed inset-0 z-40 grid place-items-center bg-slate-900/40 p-4">
                    <div className="w-full max-w-5xl rounded-2xl bg-white p-5 shadow-xl">
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
                                    disabled
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none disabled:cursor-not-allowed"
                                />
                            </label>
                            <label className="grid gap-1 text-sm text-slate-700">
                                Days / Nights
                                <input
                                    type="text"
                                    name="duration"
                                    value={editForm.duration}
                                    disabled
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none disabled:cursor-not-allowed"
                                />
                            </label>
                            <label className="grid gap-1 text-sm text-slate-700">
                                Type
                                <select
                                    name="type"
                                    value={editForm.type}
                                    onChange={handleEditFormChange}
                                    disabled
                                    className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 outline-none disabled:cursor-not-allowed"
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
                            <label className="grid gap-1 text-sm text-slate-700 sm:col-span-2">
                                Cover Image URL
                                <input
                                    type="text"
                                    value={editImageUrl}
                                    onChange={(event) => setEditImageUrl(event.target.value)}
                                    placeholder="https://..."
                                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100"
                                />
                            </label>
                        </div>

                        <div className="mt-4 rounded-xl border border-slate-200 p-3">
                            <p className="text-sm font-semibold text-slate-900">Day-wise Itinerary</p>
                            {selectedEditItinerary.length ? (
                                <div data-lenis-prevent className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
                                    {selectedEditItinerary.map((day, idx) => (
                                        <div key={`${day?.day || idx}-${day?.title || "day"}`} className="rounded-lg border border-slate-100 bg-slate-50 p-2.5">
                                            <p className="text-xs font-semibold text-violet-700">
                                                Day {day?.day || idx + 1}
                                            </p>
                                            <input
                                                type="text"
                                                value={day?.title || `Day ${idx + 1}`}
                                                onChange={(event) => handleEditDayTitleChange(idx, event.target.value)}
                                                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1.5 text-sm font-semibold text-slate-800 outline-none focus:border-violet-300"
                                            />
                                            <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                                <label className="grid gap-1 text-xs text-slate-700">
                                                    Hotel
                                                    <select
                                                        value={getFieldValue(day, "Hotel")}
                                                        onChange={(e) => handleEditDayFieldChange(idx, "Hotel", e.target.value)}
                                                        className="rounded-md border border-slate-200 px-2 py-1.5 outline-none focus:border-violet-300"
                                                    >
                                                        <option value="">Select Hotel</option>
                                                        <option value="-">-</option>
                                                        {masterHotels.map(h => (
                                                            <option key={h._id || h.id} value={h.hotelName || h.name}>{h.hotelName || h.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label className="grid gap-1 text-xs text-slate-700">
                                                    Transfer
                                                    <select
                                                        value={getFieldValue(day, "Transfer")}
                                                        onChange={(e) => handleEditDayFieldChange(idx, "Transfer", e.target.value)}
                                                        className="rounded-md border border-slate-200 px-2 py-1.5 outline-none focus:border-violet-300"
                                                    >
                                                        <option value="">Select Transfer</option>
                                                        <option value="-">-</option>
                                                        {masterTransfers.map(t => (
                                                            <option key={t._id || t.id} value={t.transferType || t.name}>{t.transferType || t.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label className="grid gap-1 text-xs text-slate-700">
                                                    Meal
                                                    <select
                                                        value={getFieldValue(day, "Meal")}
                                                        onChange={(e) => handleEditDayFieldChange(idx, "Meal", e.target.value)}
                                                        className="rounded-md border border-slate-200 px-2 py-1.5 outline-none focus:border-violet-300"
                                                    >
                                                        <option value="">Select Meal</option>
                                                        <option value="-">-</option>
                                                        {masterMeals.map(m => (
                                                            <option key={m._id || m.id} value={m.mealType || m.name}>{m.mealType || m.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label className="grid gap-1 text-xs text-slate-700">
                                                    Sightseeing
                                                    <select
                                                        value={getFieldValue(day, "Sightseeing")}
                                                        onChange={(e) => handleEditDayFieldChange(idx, "Sightseeing", e.target.value)}
                                                        className="rounded-md border border-slate-200 px-2 py-1.5 outline-none focus:border-violet-300"
                                                    >
                                                        <option value="">Select Sightseeing</option>
                                                        <option value="-">-</option>
                                                        {masterSightseeing.map(s => (
                                                            <option key={s._id || s.id} value={s.activityName || s.name}>{s.activityName || s.name}</option>
                                                        ))}
                                                    </select>
                                                </label>
                                                <label className="grid gap-1 text-xs text-slate-700 sm:col-span-2">
                                                    Information
                                                    <input
                                                        type="text"
                                                        value={getFieldValue(day, "Information")}
                                                        onChange={(e) => handleEditDayFieldChange(idx, "Information", e.target.value)}
                                                        placeholder="Any extra info..."
                                                        className="rounded-md border border-slate-200 px-2 py-1.5 outline-none focus:border-violet-300"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-2 text-xs text-slate-500">No itinerary found for this package.</p>
                            )}
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
                                onClick={handleUpdatePackage}
                                disabled={isUpdatingPackage}
                                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                            >
                                {isUpdatingPackage ? "Updating..." : "Update Package"}
                            </button>
                        </div>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default Dashboard;

