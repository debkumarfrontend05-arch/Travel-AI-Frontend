import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Landmark,
  MapPin,
  Mountain,
  Pencil,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { fetchSightseeing, addSightseeing, updateSightseeing, deleteSightseeing as deleteSightseeingApi } from "../api";
import toast from "react-hot-toast";

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80";

const defaultForm = {
  name: "",
  state: "",
  city: "",
  type: "Cultural",
  duration: "2-3 hours",
  status: "Active",
  description: "",
  highlights: "",
};

const SightseeingComponent = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const [detailActivityId, setDetailActivityId] = useState(null);
  const [deleteActivityId, setDeleteActivityId] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await fetchSightseeing();
      setActivities(data);
    } catch (error) {
      console.error("Error loading sightseeing:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    return activities.filter((activity) => {
      const matchesSearch =
        `${activity.name} ${activity.city} ${activity.type} ${activity.duration}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesCity = cityFilter === "All Cities" || activity.city === cityFilter;
      const matchesType = typeFilter === "All Types" || activity.type === typeFilter;
      const matchesStatus =
        statusFilter === "All Status" || activity.status === statusFilter;

      return matchesSearch && matchesCity && matchesType && matchesStatus;
    });
  }, [activities, search, cityFilter, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows]);
  const skeletonRows = Array.from({ length: pageSize });

  const cityOptions = useMemo(() => {
    return ["All Cities", ...new Set(activities.map((activity) => activity.city))];
  }, [activities]);

  const typeOptions = useMemo(() => {
    return ["All Types", ...new Set(activities.map((activity) => activity.type))];
  }, [activities]);

  const detailActivity = useMemo(() => {
    return activities.find((activity) => activity._id === detailActivityId) ?? null;
  }, [activities, detailActivityId]);

  const deleteActivity = useMemo(() => {
    return activities.find((activity) => activity._id === deleteActivityId) ?? null;
  }, [activities, deleteActivityId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, cityFilter, typeFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setFormData(defaultForm);
    setEditingActivityId(null);
    setFormMode("add");
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingActivityId(null);
    setFormData(defaultForm);
    setIsFormModalOpen(true);
  };

  const openEditModal = (activity) => {
    setFormMode("edit");
    setEditingActivityId(activity._id);
    setFormData({
      name: activity.name,
      state: activity.state || "",
      city: activity.city,
      type: activity.type,
      duration: activity.duration,
      status: activity.status,
      description: activity.description || "",
      highlights: activity.highlights || "",
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...formData,
        image: fallbackImage,
      };

      if (formMode === "edit" && editingActivityId) {
        await updateSightseeing(editingActivityId, payload);
      } else {
        await addSightseeing(payload);
      }
      loadActivities();
      closeFormModal();
    } catch (error) {
      toast.error("Error saving sightseeing: " + error.message);
    }
  };

  const openDeleteConfirm = (activityId) => {
    setDeleteActivityId(activityId);
  };

  const confirmDelete = async () => {
    if (!deleteActivityId) return;
    try {
      await deleteSightseeingApi(deleteActivityId);
      loadActivities();
      if (detailActivityId === deleteActivityId) setDetailActivityId(null);
      setDeleteActivityId(null);
    } catch (error) {
      toast.error("Error deleting sightseeing: " + error.message);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Sightseeing</h2>
            <p className="text-sm text-slate-500">Manage sightseeing activities</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-violet-700"
          >
            + Add Sightseeing
          </button>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <label className="relative min-w-[220px] flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sightseeing..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-violet-400"
            />
          </label>

          <select
            value={cityFilter}
            onChange={(event) => setCityFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 text-sm text-slate-600">
            <Filter size={14} />
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 bg-transparent outline-none"
            >
              <option value="All Status">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </label>
        </div>

        <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Activity Name</th>
                <th className="px-4 py-3 text-left font-semibold">City</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Duration</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading
                ? skeletonRows.map((_, index) => (
                  <tr key={`sightseeing-skeleton-${index}`} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-4 py-3"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-20 animate-pulse rounded bg-slate-200" /></td>
                  </tr>
                ))
                : paginatedRows.map((activity, index) => (
                <tr
                  key={activity._id}
                  onClick={() => setDetailActivityId(activity._id)}
                  className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-slate-50/70`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-700">{activity.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{activity.city}</td>
                  <td className="px-4 py-3 text-slate-600">{activity.state}</td>
                  <td className="px-4 py-3 text-slate-600">{activity.type}</td>
                  <td className="px-4 py-3 text-slate-600">{activity.duration}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${activity.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                        }`}
                    >
                      {activity.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Edit Activity"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(activity);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete Activity"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDeleteConfirm(activity._id);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && paginatedRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No sightseeing activities found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            {loading
              ? "Loading activities..."
              : `Showing ${filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredRows.length)} of ${filteredRows.length} activities`}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={loading || currentPage === 1}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 enabled:hover:bg-slate-50 disabled:opacity-50"
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
                  disabled={loading}
                  className={`h-8 w-8 rounded-lg border text-sm ${currentPage === pageNumber
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
              disabled={loading || currentPage === totalPages}
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 enabled:hover:bg-slate-50 disabled:opacity-50"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[86vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    {formMode === "edit" ? "Edit Sightseeing" : "Add Sightseeing"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formMode === "edit"
                      ? "Update sightseeing details and save changes."
                      : "Fill in the details to add a new sightseeing activity."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeFormModal}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
              <div className="grid flex-1 gap-4 overflow-y-auto p-6 md:grid-cols-2">
                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Activity Name</span>
                  <div className="relative">
                    <Landmark
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Wat Arun Tour"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">City</span>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="city"
                      value={formData.city}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Bangkok"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">State</span>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Bangkok"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Type</span>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="Cultural">Cultural</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Nature">Nature</option>
                    <option value="City Tour">City Tour</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Leisure">Leisure</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Duration</span>
                  <div className="relative">
                    <Clock3
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="Half Day">Half Day</option>
                      <option value="Full Day">Full Day</option>
                      <option value="2-3 hours">2-3 hours</option>
                      <option value="3-4 hours">3-4 hours</option>
                      <option value="4-5 hours">4-5 hours</option>
                    </select>
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Status</span>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Write a short summary of this sightseeing activity"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Highlights</span>
                  <textarea
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleFormChange}
                    placeholder="e.g. Guide, Tickets, Transport, Water"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>
              </div>

              <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-6 py-4">
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={closeFormModal}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                  >
                    {formMode === "edit" ? "Update Sightseeing" : "Save Sightseeing"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-900">{detailActivity.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Sightseeing Details</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${detailActivity.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {detailActivity.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailActivityId(null)}
                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                    aria-label="Close details modal"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto p-5">
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Type</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Mountain size={14} />
                    {detailActivity.type || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Duration</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Clock3 size={14} />
                    {detailActivity.duration || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">City</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">
                    {detailActivity.city || "-"}{detailActivity.state ? `, ${detailActivity.state}` : ""}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-2 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Location</p>
                  <p className="inline-flex items-start gap-2 text-sm text-slate-700">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                    <span>{detailActivity.city || "-"}{detailActivity.state ? `, ${detailActivity.state}` : ""}</span>
                  </p>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {detailActivity.description || "No description available."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Highlights</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{detailActivity.highlights || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-5 py-3.5">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDetailActivityId(null);
                    openEditModal(detailActivity);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDetailActivityId(null)}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteActivityId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Sightseeing</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this activity? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteActivityId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SightseeingComponent;
