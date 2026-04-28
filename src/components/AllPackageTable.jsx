import React from 'react'

const AllPackageTable = () => {
    return (
        <>

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
        </>
    )
}

export default AllPackageTable
