import React, { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Building2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Globe,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { fetchHotels, addHotel, updateHotel, deleteHotel as deleteHotelApi } from "../api";

const fallbackImage =
  "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=900&q=80";

const defaultForm = {
  name: "",
  state: "",
  city: "",
  category: "Luxury",
  rating: "4.0",
  rooms: "",
  status: "Active",
  address: "",
  phone: "",
  email: "",
  website: "",
  description: "",
};

const HotelsComponent = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("All Cities");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const [detailHotelId, setDetailHotelId] = useState(null);
  const [deleteHotelId, setDeleteHotelId] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const data = await fetchHotels();
      setHotels(data);
    } catch (error) {
      console.error("Error loading hotels:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesSearch = `${hotel.name} ${hotel.city} ${hotel.category}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCity = cityFilter === "All Cities" || hotel.city === cityFilter;
      const matchesCategory =
        categoryFilter === "All Categories" || hotel.category === categoryFilter;
      const matchesStatus =
        statusFilter === "All Status" || hotel.status === statusFilter;

      return matchesSearch && matchesCity && matchesCategory && matchesStatus;
    });
  }, [hotels, search, cityFilter, categoryFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows]);
  const skeletonRows = Array.from({ length: pageSize });

  const cityOptions = useMemo(() => {
    return ["All Cities", ...new Set(hotels.map((hotel) => hotel.city))];
  }, [hotels]);

  const categoryOptions = useMemo(() => {
    return ["All Categories", ...new Set(hotels.map((hotel) => hotel.category))];
  }, [hotels]);

  const detailHotel = useMemo(() => {
    return hotels.find((hotel) => hotel._id === detailHotelId) ?? null;
  }, [hotels, detailHotelId]);

  const deleteHotel = useMemo(() => {
    return hotels.find((hotel) => hotel._id === deleteHotelId) ?? null;
  }, [hotels, deleteHotelId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, cityFilter, categoryFilter, statusFilter]);

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
    setEditingHotelId(null);
    setFormMode("add");
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingHotelId(null);
    setFormData(defaultForm);
    setIsFormModalOpen(true);
  };

  const openEditModal = (hotel) => {
    setFormMode("edit");
    setEditingHotelId(hotel._id);
    setFormData({
      name: hotel.name,
      state: hotel.state || "",
      city: hotel.city,
      category: hotel.category,
      rating: String(hotel.rating),
      rooms: String(hotel.rooms),
      status: hotel.status,
      address: hotel.address || "",
      phone: hotel.phone || "",
      email: hotel.email || "",
      website: hotel.website || "",
      description: hotel.description || "",
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...formData,
        rating: Number.parseFloat(formData.rating) || 0,
        rooms: Number.parseInt(formData.rooms, 10) || 0,
        image: fallbackImage,
      };

      if (formMode === "edit" && editingHotelId) {
        await updateHotel(editingHotelId, payload);
      } else {
        await addHotel(payload);
      }
      loadHotels();
      closeFormModal();
    } catch (error) {
      alert("Error saving hotel: " + error.message);
    }
  };

  const openDeleteConfirm = (hotelId) => {
    setDeleteHotelId(hotelId);
  };

  const confirmDelete = async () => {
    if (!deleteHotelId) return;
    try {
      await deleteHotelApi(deleteHotelId);
      loadHotels();
      if (detailHotelId === deleteHotelId) setDetailHotelId(null);
      setDeleteHotelId(null);
    } catch (error) {
      alert("Error deleting hotel: " + error.message);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Hotels</h2>
            <p className="text-sm text-slate-500">Manage your hotel inventory</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-violet-700"
          >
            + Add Hotel
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
              placeholder="Search hotels..."
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
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
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
                <th className="px-4 py-3 text-left font-semibold">Hotel Name</th>
                <th className="px-4 py-3 text-left font-semibold">City</th>
                <th className="px-4 py-3 text-left font-semibold">State</th>
                <th className="px-4 py-3 text-left font-semibold">Category</th>
                <th className="px-4 py-3 text-left font-semibold">Rating</th>
                <th className="px-4 py-3 text-left font-semibold">Rooms</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading
                ? skeletonRows.map((_, index) => (
                  <tr key={`hotel-skeleton-${index}`} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-4 py-3"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-12 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-12 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-20 animate-pulse rounded bg-slate-200" /></td>
                  </tr>
                ))
                : paginatedRows.map((hotel, index) => (
                <tr
                  key={hotel._id}
                  onClick={() => setDetailHotelId(hotel._id)}
                  className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-slate-50/70`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-700">{hotel.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{hotel.city}</td>
                   <td className="px-4 py-3 text-slate-500">{hotel.state}</td>
                  <td className="px-4 py-3 text-slate-600">{hotel.category}</td>
                  <td className="px-4 py-3 text-slate-600">{(hotel.rating || 0).toFixed(1)}</td>
                  <td className="px-4 py-3 text-slate-600">{hotel.rooms}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${hotel.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                        }`}
                    >
                      {hotel.status}
                    </span>
                  </td>
                 
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Edit Hotel"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(hotel);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete Hotel"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDeleteConfirm(hotel._id);
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
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No hotels found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            {loading
              ? "Loading hotels..."
              : `Showing ${filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredRows.length)} of ${filteredRows.length} hotels`}
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
                    {formMode === "edit" ? "Edit Hotel" : "Add Hotel"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formMode === "edit"
                      ? "Update hotel details and save changes."
                      : "Fill in the details to add a new hotel entry."}
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
                  <span className="text-sm font-medium text-slate-700">Hotel Name</span>
                  <div className="relative">
                    <Building2
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Grande Centre Point"
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
                  <span className="text-sm font-medium text-slate-700">Category</span>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormChange}
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  >
                    <option value="Luxury">Luxury</option>
                    <option value="Upscale">Upscale</option>
                    <option value="Midscale">Midscale</option>
                    <option value="Economy">Economy</option>
                    <option value="Boutique">Boutique</option>
                    <option value="Budget">Budget</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Rating</span>
                  <div className="relative">
                    <Star
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="rating"
                      value={formData.rating}
                      onChange={handleFormChange}
                      placeholder="4.5"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Rooms</span>
                  <div className="relative">
                    <BedDouble
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="rooms"
                      value={formData.rooms}
                      onChange={handleFormChange}
                      required
                      placeholder="Total rooms"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
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

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Phone</span>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    placeholder="+66 ..."
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Email</span>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="hotel@example.com"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Website</span>
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleFormChange}
                    placeholder="https://hotel-website.com"
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Address</span>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    placeholder="Enter full address"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Write a short summary of this hotel"
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
                    {formMode === "edit" ? "Update Hotel" : "Save Hotel"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[86vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-slate-900">{detailHotel.name}</h3>
                  <p className="text-sm text-slate-500">Hotel Details</p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetailHotelId(null)}
                  className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                  aria-label="Close details modal"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4 overflow-y-auto p-6">
              <div className="grid gap-2 text-sm text-slate-700">
                <p className="inline-flex items-center gap-2">
                  <MapPin size={15} className="text-slate-400" />
                  {detailHotel.address || "-"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Phone size={15} className="text-slate-400" />
                  {detailHotel.phone || "-"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Mail size={15} className="text-slate-400" />
                  {detailHotel.email || "-"}
                </p>
                <p className="inline-flex items-center gap-2">
                  <Globe size={15} className="text-slate-400" />
                  {detailHotel.website || "-"}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-500">Rooms</p>
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                    <BedDouble size={14} />
                    {detailHotel.rooms}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-500">Rating</p>
                  <p className="inline-flex items-center gap-1 text-sm font-semibold text-slate-800">
                    <Star size={14} />
                    {detailHotel.rating.toFixed(1)}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                  <p className="text-xs text-slate-500">Status</p>
                  <p className="text-sm font-semibold text-slate-800">{detailHotel.status}</p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-800">Category</p>
                <p className="mt-1 text-sm text-slate-600">{detailHotel.category}</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-800">Last Updated</p>
                <p className="mt-1 text-sm text-slate-600">{detailHotel.updated}</p>
              </div>

              <div className="rounded-xl border border-slate-200 p-3">
                <p className="text-sm font-semibold text-slate-800">Description</p>
                <p className="mt-1 text-sm text-slate-600">
                  {detailHotel.description || "No description available."}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-6 py-4">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDetailHotelId(null);
                    openEditModal(detailHotel);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDetailHotelId(null)}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteHotel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Hotel</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete <span className="font-semibold">{deleteHotel.name}</span>?
              This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteHotelId(null)}
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

export default HotelsComponent;
