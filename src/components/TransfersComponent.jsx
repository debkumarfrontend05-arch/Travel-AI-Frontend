import React, { useEffect, useMemo, useState } from "react";
import {
  Car,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  MapPin,
  Pencil,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { fetchTransfers, addTransfer, updateTransfer, deleteTransfer as deleteTransferApi } from "../api";

const fallbackImage =
  "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=80";

const defaultForm = {
  name: "",
  type: "Airport Pickup",
  vehicle: "",
  capacity: 3,
  status: "Active",
  from: "",
  to: "",
  duration: "45-60 mins",
  description: "",
  features: "",
};

const TransfersComponent = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingTransferId, setEditingTransferId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const [detailTransferId, setDetailTransferId] = useState(null);
  const [deleteTransferId, setDeleteTransferId] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    loadTransfers();
  }, []);

  const loadTransfers = async () => {
    setLoading(true);
    try {
      const data = await fetchTransfers();
      setTransfers(data);
    } catch (error) {
      console.error("Error loading transfers:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    return transfers.filter((transfer) => {
      const matchesSearch =
        `${transfer.name} ${transfer.type} ${transfer.vehicle} ${transfer.capacity}`
          .toLowerCase()
          .includes(search.toLowerCase());
      const matchesType = typeFilter === "All Types" || transfer.type === typeFilter;
      const matchesStatus =
        statusFilter === "All Status" || transfer.status === statusFilter;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [transfers, search, typeFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows]);
  const skeletonRows = Array.from({ length: pageSize });

  const typeOptions = useMemo(() => {
    return ["All Types", ...new Set(transfers.map((transfer) => transfer.type))];
  }, [transfers]);

  const detailTransfer = useMemo(() => {
    return transfers.find((transfer) => transfer._id === detailTransferId) ?? null;
  }, [transfers, detailTransferId]);

  const deleteTransfer = useMemo(() => {
    return transfers.find((transfer) => transfer._id === deleteTransferId) ?? null;
  }, [transfers, deleteTransferId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, statusFilter]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "capacity" ? Number(value) : value
    }));
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setFormData(defaultForm);
    setEditingTransferId(null);
    setFormMode("add");
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingTransferId(null);
    setFormData(defaultForm);
    setIsFormModalOpen(true);
  };

  const openEditModal = (transfer) => {
    setFormMode("edit");
    setEditingTransferId(transfer._id);
    setFormData({
      name: transfer.name,
      type: transfer.type,
      vehicle: transfer.vehicle,
      capacity: transfer.capacity,
      status: transfer.status,
      from: transfer.from || "",
      to: transfer.to || "",
      duration: transfer.duration || "45-60 mins",
      description: transfer.description || "",
      features: transfer.features || "",
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

      if (formMode === "edit" && editingTransferId) {
        await updateTransfer(editingTransferId, payload);
      } else {
        await addTransfer(payload);
      }
      loadTransfers();
      closeFormModal();
    } catch (error) {
      alert("Error saving transfer: " + error.message);
    }
  };

  const openDeleteConfirm = (transferId) => {
    setDeleteTransferId(transferId);
  };

  const confirmDelete = async () => {
    if (!deleteTransferId) return;
    try {
      await deleteTransferApi(deleteTransferId);
      loadTransfers();
      if (detailTransferId === deleteTransferId) setDetailTransferId(null);
      setDeleteTransferId(null);
    } catch (error) {
      alert("Error deleting transfer: " + error.message);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Transfers</h2>
            <p className="text-sm text-slate-500">Manage transfer services</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-violet-700"
          >
            + Add Transfer
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
              placeholder="Search transfers..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-violet-400"
            />
          </label>

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
                <th className="px-4 py-3 text-left font-semibold">Transfer Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Vehicle</th>
                <th className="px-4 py-3 text-left font-semibold">Capacity</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading
                ? skeletonRows.map((_, index) => (
                  <tr key={`transfer-skeleton-${index}`} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-4 py-3"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-20 animate-pulse rounded bg-slate-200" /></td>
                  </tr>
                ))
                : paginatedRows.map((transfer, index) => (
                <tr
                  key={transfer._id}
                    onClick={() => setDetailTransferId(transfer._id)}
                    className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-slate-50/70`}
                  >
                    <td className="px-4 py-3">
                      <span className="font-medium text-slate-700">{transfer.name}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{transfer.type}</td>
                    <td className="px-4 py-3 text-slate-600">{transfer.vehicle}</td>
                    <td className="px-4 py-3 text-slate-600">{transfer.capacity} Passenger</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${transfer.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                          }`}
                      >
                        {transfer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Edit Transfer"
                          onClick={(event) => {
                            event.stopPropagation();
                            openEditModal(transfer);
                          }}
                          className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          type="button"
                          title="Delete Transfer"
                          onClick={(event) => {
                            event.stopPropagation();
                            openDeleteConfirm(transfer._id);
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
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    No transfers found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            {loading
              ? "Loading transfers..."
              : `Showing ${filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredRows.length)} of ${filteredRows.length} transfers`}
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
                    {formMode === "edit" ? "Edit Transfer" : "Add Transfer"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formMode === "edit"
                      ? "Update transfer details and save changes."
                      : "Fill in the details to add a new transfer service."}
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
                  <span className="text-sm font-medium text-slate-700">Transfer Name</span>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Airport Pickup"
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
                    <option value="Airport Pickup">Airport Pickup</option>
                    <option value="Airport Drop">Airport Drop</option>
                    <option value="Intercity">Intercity</option>
                    <option value="Local">Local</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Vehicle</span>
                  <div className="relative">
                    <Car
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Toyota Camry"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Capacity</span>
                  <div className="relative">
                    <UserRound
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value={3}>3 Passengers</option>
                      <option value={6}>6 Passengers</option>
                      <option value={7}>7 Passengers</option>
                      <option value={9}>9 Passengers</option>
                      <option value={12}>12 Passengers</option>
                    </select>
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">From</span>
                  <input
                    name="from"
                    value={formData.from}
                    onChange={handleFormChange}
                    placeholder="Pickup location"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">To</span>
                  <input
                    name="to"
                    value={formData.to}
                    onChange={handleFormChange}
                    placeholder="Drop location"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  />
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
                      <option value="30-45 mins">30-45 mins</option>
                      <option value="45-60 mins">45-60 mins</option>
                      <option value="2-3 hours">2-3 hours</option>
                      <option value="3-4 hours">3-4 hours</option>
                      <option value="8-10 hours">8-10 hours</option>
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
                    placeholder="Write a short summary of this transfer service"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Features</span>
                  <textarea
                    name="features"
                    value={formData.features}
                    onChange={handleFormChange}
                    placeholder="e.g. Air Conditioned, Flight Tracking, Toll Included"
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
                    {formMode === "edit" ? "Update Transfer" : "Save Transfer"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-900">{detailTransfer.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Transfer Details</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${detailTransfer.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {detailTransfer.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailTransferId(null)}
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
                  <p className="mt-1 text-sm font-semibold text-slate-800">{detailTransfer.type || "-"}</p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Vehicle</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Car size={14} />
                    {detailTransfer.vehicle || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Capacity</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <UserRound size={14} />
                    {detailTransfer.capacity || 0} Passenger
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Route</p>
                  <div>
                    <p className="inline-flex items-start gap-2 text-sm text-slate-700">
                      <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                      <span><span className="font-medium text-slate-800">From:</span> {detailTransfer.from || "-"}</span>
                    </p>
                  </div>
                  <div>
                  <p className="inline-flex items-start gap-2 text-sm text-slate-700">
                    <MapPin size={15} className="mt-0.5 shrink-0 text-slate-400" />
                    <span><span className="font-medium text-slate-800">To:</span> {detailTransfer.to || "-"}</span>
                  </p>
                  </div>
                  <p className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <Clock3 size={15} className="shrink-0 text-slate-400" />
                    <span><span className="font-medium text-slate-800">Duration:</span> {detailTransfer.duration || "-"}</span>
                  </p>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {detailTransfer.description || "No description available."}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Features</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{detailTransfer.features || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-5 py-3.5">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDetailTransferId(null);
                    openEditModal(detailTransfer);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDetailTransferId(null)}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTransferId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Transfer</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this transfer? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTransferId(null)}
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

export default TransfersComponent;
