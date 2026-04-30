import React, { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Pencil,
  Search,
  Soup,
  Trash2,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { fetchMeals, addMeal, updateMeal, deleteMeal as deleteMealApi } from "../api";


const fallbackImage =
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80";

const defaultForm = {
  name: "",
  type: "Veg",
  cuisine: "",
  mealTime: "Lunch",
  status: "Active",
  description: "",
  items: "",
};

const MealsComponent = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [cuisineFilter, setCuisineFilter] = useState("All Cuisines");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [currentPage, setCurrentPage] = useState(1);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("add");
  const [editingMealId, setEditingMealId] = useState(null);
  const [formData, setFormData] = useState(defaultForm);

  const [detailMealId, setDetailMealId] = useState(null);
  const [deleteMealId, setDeleteMealId] = useState(null);

  const pageSize = 5;

  useEffect(() => {
    loadMeals();
  }, []);

  const loadMeals = async () => {
    setLoading(true);
    try {
      const data = await fetchMeals();
      setMeals(data);
    } catch (error) {
      console.error("Error loading meals:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRows = useMemo(() => {
    return meals.filter((meal) => {
      const matchesSearch = `${meal.name} ${meal.type} ${meal.cuisine} ${meal.mealTime}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesType = typeFilter === "All Types" || meal.type === typeFilter;
      const matchesCuisine =
        cuisineFilter === "All Cuisines" || meal.cuisine === cuisineFilter;
      const matchesStatus =
        statusFilter === "All Status" || meal.status === statusFilter;

      return matchesSearch && matchesType && matchesCuisine && matchesStatus;
    });
  }, [meals, search, typeFilter, cuisineFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows]);
  const skeletonRows = Array.from({ length: pageSize });

  const typeOptions = useMemo(() => {
    return ["All Types", ...new Set(meals.map((meal) => meal.type))];
  }, [meals]);

  const cuisineOptions = useMemo(() => {
    return ["All Cuisines", ...new Set(meals.map((meal) => meal.cuisine))];
  }, [meals]);

  const detailMeal = useMemo(() => {
    return meals.find((meal) => meal._id === detailMealId) ?? null;
  }, [meals, detailMealId]);

  const deleteMeal = useMemo(() => {
    return meals.find((meal) => meal._id === deleteMealId) ?? null;
  }, [meals, deleteMealId]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, cuisineFilter, statusFilter]);

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
    setEditingMealId(null);
    setFormMode("add");
  };

  const openAddModal = () => {
    setFormMode("add");
    setEditingMealId(null);
    setFormData(defaultForm);
    setIsFormModalOpen(true);
  };

  const openEditModal = (meal) => {
    setFormMode("edit");
    setEditingMealId(meal._id);
    setFormData({
      name: meal.name,
      type: meal.type,
      cuisine: meal.cuisine,
      mealTime: meal.mealTime,
      status: meal.status,
      description: meal.description || "",
      items: meal.items || "",
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

      if (formMode === "edit" && editingMealId) {
        await updateMeal(editingMealId, payload);
      } else {
        await addMeal(payload);
      }
      loadMeals();
      closeFormModal();
    } catch (error) {
      alert("Error saving meal: " + error.message);
    }
  };

  const openDeleteConfirm = (mealId) => {
    setDeleteMealId(mealId);
  };

  const confirmDelete = async () => {
    if (!deleteMealId) return;
    try {
      await deleteMealApi(deleteMealId);
      loadMeals();
      if (detailMealId === deleteMealId) setDetailMealId(null);
      setDeleteMealId(null);
    } catch (error) {
      alert("Error deleting meal: " + error.message);
    }
  };

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Meals</h2>
            <p className="text-sm text-slate-500">Manage meal options</p>
          </div>
          <button
            type="button"
            onClick={openAddModal}
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-violet-700"
          >
            + Add Meal
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
              placeholder="Search meals..."
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

          <select
            value={cuisineFilter}
            onChange={(event) => setCuisineFilter(event.target.value)}
            className="h-10 rounded-xl border border-slate-200 px-3 text-sm text-slate-600 outline-none focus:border-violet-400"
          >
            {cuisineOptions.map((cuisine) => (
              <option key={cuisine} value={cuisine}>
                {cuisine}
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
                <th className="px-4 py-3 text-left font-semibold">Meal Name</th>
                <th className="px-4 py-3 text-left font-semibold">Type</th>
                <th className="px-4 py-3 text-left font-semibold">Cuisine</th>
                <th className="px-4 py-3 text-left font-semibold">Meal Time</th>
                <th className="px-4 py-3 text-left font-semibold">Status</th>
                <th className="px-4 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {loading
                ? skeletonRows.map((_, index) => (
                  <tr key={`meal-skeleton-${index}`} className={`${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"}`}>
                    <td className="px-4 py-3"><div className="h-4 w-32 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-16 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-4 w-20 animate-pulse rounded bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-6 w-16 animate-pulse rounded-full bg-slate-200" /></td>
                    <td className="px-4 py-3"><div className="h-8 w-20 animate-pulse rounded bg-slate-200" /></td>
                  </tr>
                ))
                : paginatedRows.map((meal, index) => (
                <tr
                  key={meal._id}
                  onClick={() => setDetailMealId(meal._id)}
                  className={`cursor-pointer ${index % 2 === 0 ? "bg-white" : "bg-slate-50/40"} hover:bg-slate-50/70`}
                >
                  <td className="px-4 py-3">
                    <span className="font-medium text-slate-700">{meal.name}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{meal.type}</td>
                  <td className="px-4 py-3 text-slate-600">{meal.cuisine}</td>
                  <td className="px-4 py-3 text-slate-600">{meal.mealTime}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                        meal.status === "Active"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {meal.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Edit Meal"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditModal(meal);
                        }}
                        className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-violet-50 hover:text-violet-700"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        type="button"
                        title="Delete Meal"
                        onClick={(event) => {
                          event.stopPropagation();
                          openDeleteConfirm(meal._id);
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
                    No meals found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500">
          <p>
            {loading
              ? "Loading meals..."
              : `Showing ${filteredRows.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to ${Math.min(currentPage * pageSize, filteredRows.length)} of ${filteredRows.length} meals`}
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
                  className={`h-8 w-8 rounded-lg border text-sm ${
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
                    {formMode === "edit" ? "Edit Meal" : "Add Meal"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {formMode === "edit"
                      ? "Update meal details and save changes."
                      : "Fill in the details to add a new meal option."}
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
                  <span className="text-sm font-medium text-slate-700">Meal Name</span>
                  <div className="relative">
                    <UtensilsCrossed
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Thai Set Lunch"
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
                    <option value="Veg">Veg</option>
                    <option value="Non-Veg">Non-Veg</option>
                    <option value="Jain">Jain</option>
                    <option value="Halal">Halal</option>
                    <option value="Set Menu">Set Menu</option>
                    <option value="Buffet">Buffet</option>
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Cuisine</span>
                  <div className="relative">
                    <Soup
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      name="cuisine"
                      value={formData.cuisine}
                      onChange={handleFormChange}
                      required
                      placeholder="e.g. Thai"
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    />
                  </div>
                </label>

                <label className="space-y-1.5">
                  <span className="text-sm font-medium text-slate-700">Meal Time</span>
                  <div className="relative">
                    <Clock3
                      size={16}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <select
                      name="mealTime"
                      value={formData.mealTime}
                      onChange={handleFormChange}
                      className="h-11 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-violet-400"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snacks">Snacks</option>
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
                    placeholder="Write a short summary of this meal"
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-violet-400"
                  />
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-sm font-medium text-slate-700">Menu Items</span>
                  <textarea
                    name="items"
                    value={formData.items}
                    onChange={handleFormChange}
                    placeholder="e.g. Soup, Main course, Rice, Dessert"
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
                    {formMode === "edit" ? "Update Meal" : "Save Meal"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="flex max-h-[82vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-5 py-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold leading-tight text-slate-900">{detailMeal.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">Meal Details</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${detailMeal.status === "Active"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                      }`}
                  >
                    {detailMeal.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => setDetailMealId(null)}
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
                    <UtensilsCrossed size={14} />
                    {detailMeal.type || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Cuisine</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Soup size={14} />
                    {detailMeal.cuisine || "-"}
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-slate-500">Meal Time</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                    <Clock3 size={14} />
                    {detailMeal.mealTime || "-"}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Description</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">
                      {detailMeal.description || "No description available."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 rounded-xl border border-slate-200 p-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Menu Items</p>
                    <p className="mt-1 text-sm leading-6 text-slate-700">{detailMeal.items || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white px-5 py-3.5">
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDetailMealId(null);
                    openEditModal(detailMeal);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDetailMealId(null)}
                  className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteMealId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900">Delete Meal</h3>
            <p className="mt-2 text-sm text-slate-600">
              Are you sure you want to delete this meal? This action cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteMealId(null)}
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

export default MealsComponent;
