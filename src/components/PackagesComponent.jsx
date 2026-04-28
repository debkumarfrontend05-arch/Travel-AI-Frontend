import React, { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2X2,
  Heart,
  List,
  MapPin,
  MoreVertical,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

const packageRows = [
  {
    id: 1,
    name: "Thailand Getaway",
    locations: ["Bangkok", "Phuket"],
    destination: "Thailand",
    durationDays: 6,
    durationText: "6D / 5N",
    pax: "2-10 Passengers",
    rating: 4.8,
    reviews: 120,
    price: 1250,
    source: "AI Generated",
    type: "Cultural",
    updated: "Updated 12 May, 2025",
    image:
      "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 2,
    name: "Bali Bliss",
    locations: ["Ubud", "Kuta", "Nusa Dua"],
    destination: "Bali",
    durationDays: 6,
    durationText: "6D / 5N",
    pax: "2-8 Passengers",
    rating: 4.7,
    reviews: 98,
    price: 980,
    source: "Manual",
    type: "Beach",
    updated: "Updated 09 May, 2025",
    image:
      "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 3,
    name: "Dubai Explorer",
    locations: ["Dubai", "Abu Dhabi"],
    destination: "UAE",
    durationDays: 4,
    durationText: "4D / 3N",
    pax: "2-6 Passengers",
    rating: 4.6,
    reviews: 75,
    price: 1450,
    source: "MD Prompt",
    type: "City",
    updated: "Updated 10 May, 2025",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1531123414780-f74242c2b052?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1542204625-de293a44d120?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 4,
    name: "Maldives Escape",
    locations: ["Male", "North Male Atoll"],
    destination: "Maldives",
    durationDays: 5,
    durationText: "5D / 4N",
    pax: "2-4 Passengers",
    rating: 4.9,
    reviews: 140,
    price: 2150,
    source: "Manual",
    type: "Beach",
    updated: "Updated 08 May, 2025",
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1546961329-78bef0414d7c?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 5,
    name: "Singapore Delight",
    locations: ["Singapore"],
    destination: "Singapore",
    durationDays: 3,
    durationText: "3D / 2N",
    pax: "1-6 Passengers",
    rating: 4.5,
    reviews: 60,
    price: 750,
    source: "Manual",
    type: "City",
    updated: "Updated 08 May, 2025",
    image:
      "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 6,
    name: "Kerala Backwaters",
    locations: ["Kochi", "Alleppey", "Munnar"],
    destination: "Kerala",
    durationDays: 5,
    durationText: "5D / 4N",
    pax: "2-8 Passengers",
    rating: 4.6,
    reviews: 85,
    price: 620,
    source: "Manual",
    type: "Nature",
    updated: "Updated 11 May, 2025",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 7,
    name: "Swiss Adventure",
    locations: ["Zurich", "Interlaken", "Lucerne"],
    destination: "Switzerland",
    durationDays: 7,
    durationText: "7D / 6N",
    pax: "2-8 Passengers",
    rating: 4.7,
    reviews: 40,
    price: 1850,
    source: "AI Generated",
    type: "Nature",
    updated: "Updated 07 May, 2025",
    image:
      "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1541534401786-2077eed87a72?auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: 8,
    name: "Japan Discovery",
    locations: ["Tokyo", "Kyoto", "Osaka"],
    destination: "Japan",
    durationDays: 8,
    durationText: "8D / 7N",
    pax: "2-10 Passengers",
    rating: 4.8,
    reviews: 110,
    price: 1650,
    source: "MD Prompt",
    type: "Cultural",
    updated: "Updated 06 May, 2025",
    image:
      "https://images.unsplash.com/photo-1492571350019-22de08371fd3?auto=format&fit=crop&w=900&q=80",
    members: [
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100&q=80",
    ],
  },
];

const PackagesComponent = () => {
  const [search, setSearch] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("All Destinations");
  const [durationFilter, setDurationFilter] = useState("All Durations");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("Latest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = viewMode === "grid" ? 8 : 5;

  const destinationOptions = useMemo(() => {
    return ["All Destinations", ...new Set(packageRows.map((pkg) => pkg.destination))];
  }, []);

  const typeOptions = useMemo(() => {
    return ["All Types", ...new Set(packageRows.map((pkg) => pkg.type))];
  }, []);

  const filteredRows = useMemo(() => {
    const durationMatches = (days) => {
      if (durationFilter === "All Durations") return true;
      if (durationFilter === "Short (3-5 days)") return days >= 3 && days <= 5;
      if (durationFilter === "Medium (6-7 days)") return days >= 6 && days <= 7;
      return days >= 8;
    };

    const rows = packageRows.filter((pkg) => {
      const matchesSearch =
        `${pkg.name} ${pkg.destination} ${pkg.locations.join(" ")} ${pkg.type}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesDestination =
        destinationFilter === "All Destinations" || pkg.destination === destinationFilter;
      const matchesDuration = durationMatches(pkg.durationDays);
      const matchesType = typeFilter === "All Types" || pkg.type === typeFilter;
      const matchesStatus = statusFilter === "All Status" || pkg.status === statusFilter;

      return (
        matchesSearch &&
        matchesDestination &&
        matchesDuration &&
        matchesType &&
        matchesStatus
      );
    });

    return [...rows].sort((a, b) => {
      if (sortBy === "Price: Low to High") return a.price - b.price;
      if (sortBy === "Price: High to Low") return b.price - a.price;
      if (sortBy === "Rating") return b.rating - a.rating;
      return b.id - a.id;
    });
  }, [search, destinationFilter, durationFilter, typeFilter, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, destinationFilter, durationFilter, typeFilter, statusFilter, sortBy, viewMode]);

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-4xl font-semibold text-slate-900">Packages</h2>
          <p className="mt-1 text-lg text-slate-500">Manage and organize your travel packages</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative w-full min-w-[280px] lg:min-w-[360px]">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search packages..."
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-9 pr-10 text-sm outline-none focus:border-violet-400"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
              Ctrl+K
            </span>
          </label>

          <button className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 hover:bg-slate-50">
            <Bell size={18} />
            <span className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-xs text-white">
              3
            </span>
          </button>

          <button className="inline-flex h-12 items-center gap-2 rounded-2xl bg-violet-600 px-5 text-sm font-semibold text-white hover:bg-violet-700">
            <Sparkles size={16} />
            Create Package
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50">
            <SlidersHorizontal size={16} />
          </button>

          <select
            value={destinationFilter}
            onChange={(event) => setDestinationFilter(event.target.value)}
            className="h-11 min-w-[180px] rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            {destinationOptions.map((destination) => (
              <option key={destination} value={destination}>
                {destination}
              </option>
            ))}
          </select>

          <select
            value={durationFilter}
            onChange={(event) => setDurationFilter(event.target.value)}
            className="h-11 min-w-[180px] rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            <option>All Durations</option>
            <option>Short (3-5 days)</option>
            <option>Medium (6-7 days)</option>
            <option>Long (8+ days)</option>
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-11 min-w-[170px] rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 min-w-[170px] rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Draft</option>
          </select>

          <div className="ml-auto flex flex-wrap items-center gap-3">
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              className="h-11 min-w-[150px] rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
            >
              <option>Latest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating</option>
            </select>

            <div className="inline-flex rounded-xl border border-slate-200 p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`rounded-lg p-2 ${
                  viewMode === "grid" ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <Grid2X2 size={16} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`rounded-lg p-2 ${
                  viewMode === "list" ? "bg-violet-600 text-white" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-4">
          {paginatedRows.map((pkg) => (
            <article key={pkg.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="relative h-52">
                <img src={pkg.image} alt={pkg.name} className="h-full w-full object-cover" />
                <div className="absolute right-3 top-3 inline-flex rounded-lg bg-white/95 px-2.5 py-1 text-xs font-semibold text-violet-600">
                  * {pkg.source}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-3xl font-semibold text-slate-900">{pkg.name}</h3>
                  <p className="text-right text-violet-600">
                    <span className="text-4xl font-semibold">${pkg.price.toLocaleString()}</span>
                    <span className="block text-xs text-slate-500">per person</span>
                  </p>
                </div>

                <p className="mt-2 inline-flex items-center gap-1 text-sm text-slate-500">
                  <MapPin size={14} />
                  {pkg.locations.join(" | ")}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-100 pt-3 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} />
                    {pkg.durationText}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Star size={14} className="text-amber-500" />
                    {pkg.rating} ({pkg.reviews})
                  </span>
                </div>

              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {paginatedRows.map((pkg) => (
            <article
              key={pkg.id}
              className="grid grid-cols-[220px_1fr] gap-4 rounded-2xl border border-slate-200 bg-white p-3"
            >
              <img src={pkg.image} alt={pkg.name} className="h-36 w-full rounded-xl object-cover" />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{pkg.locations.join(" | ")}</p>
                  <p className="mt-2 text-sm text-slate-600">
                    {pkg.durationText} | {pkg.pax} | {pkg.rating} ({pkg.reviews})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-semibold text-violet-600">${pkg.price.toLocaleString()}</p>
                  <p className="text-xs text-slate-500">per person</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
        <p>
          Showing {filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to{" "}
          {Math.min(currentPage * pageSize, filteredRows.length)} of {filteredRows.length} packages
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 enabled:hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronLeft size={14} />
          </button>
          {Array.from({ length: totalPages }).map((_, index) => {
            const pageNumber = index + 1;
            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setCurrentPage(pageNumber)}
                className={`h-9 w-9 rounded-lg border text-sm ${
                  currentPage === pageNumber
                    ? "border-violet-600 bg-violet-600 text-white"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 enabled:hover:bg-slate-50 disabled:opacity-50"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default PackagesComponent;