import React, { useMemo } from "react";
import { LineChart, Line, ResponsiveContainer, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const BookingsOverview = ({ packages = [] }) => {
  const monthWiseData = useMemo(() => {
    const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
    const now = new Date();
    const year = now.getFullYear();

    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(year, index, 1);
      return { name: formatter.format(date), value: 0 };
    });

    packages.forEach((pkg) => {
      const createdAt = pkg?.createdAt || pkg?.updatedAt;
      if (!createdAt) return;
      const date = new Date(createdAt);
      if (Number.isNaN(date.getTime())) return;
      if (date.getFullYear() !== year) return;
      months[date.getMonth()].value += 1;
    });

    return months;
  }, [packages]);

  const totalCreated = monthWiseData.reduce((sum, item) => sum + item.value, 0);
  const peakMonth = monthWiseData.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { name: "-", value: 0 }
  );

  return (
    <section className="h-full rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold text-slate-900">Month-wise Package Creation</h3>
        <div className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600">
          This Year
        </div>
      </div>

      <div className="relative mt-5 h-[210px] rounded-xl bg-slate-50/60 p-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={monthWiseData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid stroke="#e2e8f0" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [`${value}`, "Packages"]} />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#6557ff"
              strokeWidth={3}
              dot={{ r: 3, fill: "#6557ff" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <p>Total Created: <span className="font-semibold text-slate-900">{totalCreated}</span></p>
        <p>Peak Month: <span className="font-semibold text-slate-900">{peakMonth.name} ({peakMonth.value})</span></p>
      </div>
    </section>
  );
};

export default BookingsOverview;
