import React from "react";

const DashboardStatsCard = ({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  iconBgClass,
  iconColorClass,
}) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_rgba(15,23,42,0.09)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-violet-500/70 via-blue-500/50 to-emerald-500/70 opacity-70" />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
            {title}
          </p>
          <p className="mt-3 text-4xl font-semibold leading-none tracking-tight text-slate-900">
            {value}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {change ? (
              <p className="text-sm font-semibold text-emerald-600">{change}</p>
            ) : null}
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>
        </div>

        <span
          className={`inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-slate-200/70 ${iconBgClass} ${iconColorClass} shadow-sm`}
        >
          <Icon size={24} />
        </span>
      </div>
    </div>
  );
};

export default DashboardStatsCard;