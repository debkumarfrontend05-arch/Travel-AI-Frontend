import { PieChart } from 'lucide-react'
import React from 'react'
import { Cell, Pie, ResponsiveContainer, Tooltip } from 'recharts'

const TopDestination = () => {
    const destinationBreakdown = [
        { name: "Thailand", value: 35, color: "#6d5efc" },
        { name: "Kerala", value: 22, color: "#4f8df7" },
        { name: "Dubai", value: 15, color: "#35c88a" },
        { name: "Bali", value: 12, color: "#ffa44b" },
        { name: "Singapore", value: 8, color: "#f48aa8" },
        { name: "Others", value: 8, color: "#c8cfdf" },
    ];

    return (
        <>
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
        </>
    )
}

export default TopDestination
