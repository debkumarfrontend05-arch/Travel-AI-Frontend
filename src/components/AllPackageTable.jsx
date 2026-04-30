import { ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AllPackageTable = ({ recentPackages, onEditPackage, onDeletePackage, isLoading = false }) => {
    const navigate = useNavigate();
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);
    const pageSize = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const totalItems = recentPackages.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    useEffect(() => {
        setCurrentPage((prev) => Math.min(prev, totalPages));
    }, [totalPages]);

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, totalItems);
    const paginatedPackages = recentPackages.slice(startIndex, endIndex);
    const skeletonRows = Array.from({ length: pageSize });

    const buildPageNumbers = () => {
        if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (currentPage <= 3) return [1, 2, 3, 4, totalPages];
        if (currentPage >= totalPages - 2) return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
    };

    const pageNumbers = buildPageNumbers();

    const typeBadgeClassMap = {
        "AI Generated": "bg-violet-100 text-violet-600",
        Manual: "bg-blue-100 text-blue-600",
        "MD Prompt": "bg-orange-100 text-orange-600",
    };
    return (
        <>

            <section className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
                    <h3 className="text-3xl font-semibold text-slate-900">Recent Packages</h3>
                    <button
                        type="button"
                        onClick={() => navigate("/packages")}
                        className="rounded-lg border border-violet-200 bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-600 hover:bg-violet-100"
                    >
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
                            {isLoading
                                ? skeletonRows.map((_, idx) => (
                                    <tr key={`skeleton-${idx}`} className="border-t border-slate-100">
                                        <td className="px-5 py-3">
                                            <div className="flex animate-pulse items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-slate-200" />
                                                <div className="space-y-2">
                                                    <div className="h-3 w-32 rounded bg-slate-200" />
                                                    <div className="h-3 w-24 rounded bg-slate-200" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3"><div className="h-3 w-16 animate-pulse rounded bg-slate-200" /></td>
                                        <td className="px-5 py-3"><div className="h-3 w-14 animate-pulse rounded bg-slate-200" /></td>
                                        <td className="px-5 py-3"><div className="h-6 w-20 animate-pulse rounded-md bg-slate-200" /></td>
                                        <td className="px-5 py-3"><div className="h-3 w-8 animate-pulse rounded bg-slate-200" /></td>
                                        <td className="px-5 py-3"><div className="h-3 w-20 animate-pulse rounded bg-slate-200" /></td>
                                        <td className="px-5 py-3"><div className="h-4 w-4 animate-pulse rounded bg-slate-200" /></td>
                                    </tr>
                                ))
                                : paginatedPackages.map((pkg, index) => (
                                <tr key={pkg.id || pkg.name} className="border-t border-slate-100">
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
                                        <div className="relative" ref={openMenuId === (pkg.id || pkg.name) ? menuRef : null}>
                                            <button
                                                type="button"
                                                onClick={() => setOpenMenuId((prev) => (prev === (pkg.id || pkg.name) ? null : (pkg.id || pkg.name)))}
                                                className="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                                                aria-label="Open actions menu"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                            {openMenuId === (pkg.id || pkg.name) && (
                                                <div
                                                    className={`absolute right-0 z-20 w-32 rounded-lg border border-slate-200 bg-white py-1 shadow-lg ${
                                                        index >= paginatedPackages.length - 2 ? "bottom-full mb-2" : "top-full mt-2"
                                                    }`}
                                                >
                                                    <button
                                                        type="button"
                                                        className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            if (onEditPackage) onEditPackage(pkg);
                                                        }}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="w-full px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
                                                        onClick={() => {
                                                            setOpenMenuId(null);
                                                            if (onDeletePackage) onDeletePackage(pkg);
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3 text-sm text-slate-500">
                    <p>
                        {isLoading
                            ? "Loading packages..."
                            : `Showing ${totalItems === 0 ? 0 : startIndex + 1} to ${endIndex} of ${totalItems} packages`}
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                            disabled={isLoading || currentPage === 1}
                            className="rounded-md border border-slate-200 p-2 text-slate-400 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {pageNumbers.map((page, idx) => {
                            const shouldShowEllipsis = idx > 0 && pageNumbers[idx - 1] !== page - 1;
                            return (
                                <React.Fragment key={page}>
                                    {shouldShowEllipsis ? <span className="px-1 text-slate-400">...</span> : null}
                                    <button
                                        type="button"
                                        onClick={() => setCurrentPage(page)}
                                        disabled={isLoading}
                                        className={`h-8 w-8 rounded-md text-sm font-semibold ${currentPage === page
                                            ? "bg-violet-100 text-violet-600"
                                            : "text-slate-500 hover:bg-slate-100"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            );
                        })}
                        <button
                            type="button"
                            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                            disabled={isLoading || currentPage === totalPages}
                            className="rounded-md border border-slate-200 p-2 text-slate-500 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AllPackageTable