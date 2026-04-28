import React, { useMemo } from "react";
import { BedDouble, CalendarDays, Car, CheckCircle2, MapPinned, Soup, TentTree, Loader2 } from "lucide-react";

const ReviewRow = ({ label, value }) => (
  <div className="grid gap-1 border-b border-slate-100 py-3 last:border-b-0 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-3">
    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</p>
    <p className="text-sm font-semibold text-slate-800">{value || "-"}</p>
  </div>
);

const ReviewChip = ({ icon: Icon, label, count, colorClass }) => (
  <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 transition-colors hover:border-slate-300">
    <span className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
      <Icon size={14} />
    </span>
    <p className="text-sm font-medium text-slate-700">
      {count} {label}
    </p>
  </div>
);

const ReviewStep = ({ onBack, onCreate, packageData, itineraryData, isSaving }) => {
  const summary = useMemo(() => {
    const timelineItems = itineraryData?.timelineItems || [];
    return {
      transfer: timelineItems.filter((item) => item.type === "Transfer").length,
      hotel: timelineItems.filter((item) => item.type === "Hotel").length,
      sightseeing: timelineItems.filter((item) => item.type === "Sightseeing").length,
      meal: timelineItems.filter((item) => item.type === "Meal").length,
      days: itineraryData?.days?.length || 0,
      items: timelineItems.length,
    };
  }, [itineraryData]);

  return (
    <div className="px-7 py-6">
      <div className="rounded-xl border border-violet-100 bg-violet-50/50 p-4">
        <h4 className="text-2xl font-semibold text-slate-900">Review Package</h4>
        <p className="mt-1 text-sm text-slate-600">
          Final check before creating your package.
        </p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-12">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-5">
          <h5 className="text-lg font-semibold text-slate-900">Basic Information</h5>
          <div className="mt-3">
            <ReviewRow label="Package Name" value={packageData.packageName} />
            <ReviewRow label="State" value={packageData.state} />
            <ReviewRow label="Start Location" value={packageData.startCity} />
            <ReviewRow label="End Location" value={packageData.endCity} />
            <ReviewRow label="Duration" value={`${packageData.days || 0} Days / ${packageData.nights || 0} Nights`} />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-4">
          <h5 className="text-lg font-semibold text-slate-900">Itinerary Summary</h5>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <ReviewChip icon={Car} label="Transfer" count={summary.transfer} colorClass="bg-emerald-100 text-emerald-600" />
            <ReviewChip icon={BedDouble} label="Hotel" count={summary.hotel} colorClass="bg-indigo-100 text-indigo-600" />
            <ReviewChip icon={TentTree} label="Sightseeing" count={summary.sightseeing} colorClass="bg-amber-100 text-amber-600" />
            <ReviewChip icon={Soup} label="Meal" count={summary.meal} colorClass="bg-pink-100 text-pink-600" />
            <ReviewChip icon={MapPinned} label="Days" count={summary.days} colorClass="bg-violet-100 text-violet-600" />
            <ReviewChip icon={CalendarDays} label="Items" count={summary.items} colorClass="bg-blue-100 text-blue-600" />
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-3">
          <h5 className="text-lg font-semibold text-slate-900">Checklist</h5>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              Basic package information added
            </p>
            <p className="flex items-start gap-2">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-600" />
              Itinerary day plan added
            </p>
          </div>
        </section>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onCreate}
          disabled={isSaving}
          className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : null}
          {isSaving ? "Creating..." : "Create Package"}
        </button>
      </div>
    </div>
  );
};

export default ReviewStep;
