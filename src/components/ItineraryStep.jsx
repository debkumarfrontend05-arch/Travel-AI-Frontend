import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BedDouble,
  BusFront,
  Car,
  Check,
  ChevronDown,
  Clock3,
  EllipsisVertical,
  Eye,
  MapPinned,
  NotebookPen,
  Pencil,
  Plus,
  Soup,
  TentTree,
  Trash2,
  TreePalm,
  X,
  ListChecks,
} from "lucide-react";

const initialDays = [
  { id: 1, day: "Day 1", title: "Arrival in Bangkok", icon: MapPinned },
  { id: 2, day: "Day 2", title: "Bangkok City Tour", icon: Check },
  { id: 3, day: "Day 3", title: "Bangkok to Phuket", icon: TentTree },
  { id: 4, day: "Day 4", title: "Phuket Island Tour", icon: TreePalm },
  { id: 5, day: "Day 5", title: "Leisure Day in Phuket", icon: TreePalm },
  { id: 6, day: "Day 6", title: "Departure", icon: Check },
];

const seedItems = [
  {
    id: "item-1",
    dayId: 1,
    time: "09:00",
    type: "Transfer",
    title: "Transfer",
    detail1: "Suvarnabhumi Airport (BKK) -> Grande Centre Point Terminal 21",
    detail2: "Private Car",
    status: "Included",
  },
  {
    id: "item-2",
    dayId: 1,
    time: "14:00",
    type: "Hotel",
    title: "Hotel Check-in",
    detail1: "Grande Centre Point Terminal 21",
    detail2: "Deluxe Room",
    status: "Included",
  },
  {
    id: "item-3",
    dayId: 1,
    time: "16:00",
    type: "Sightseeing",
    title: "Sightseeing",
    detail1: "Wat Arun (Temple of Dawn)",
    detail2: "Half Day Tour",
    status: "Included",
  },
  {
    id: "item-4",
    dayId: 1,
    time: "19:00",
    type: "Meal",
    title: "Meal",
    detail1: "Dinner at The Deck by Arun Residence",
    detail2: "Thai Cuisine",
    status: "Included",
  },
];

const iconByType = {
  Transfer: { icon: Car, className: "bg-emerald-100 text-emerald-600" },
  Hotel: { icon: BedDouble, className: "bg-indigo-100 text-indigo-600" },
  Sightseeing: { icon: TentTree, className: "bg-amber-100 text-amber-600" },
  Meal: { icon: Soup, className: "bg-pink-100 text-pink-600" },
  Activity: { icon: BusFront, className: "bg-blue-100 text-blue-600" },
  Information: { icon: NotebookPen, className: "bg-slate-200 text-slate-700" },
};

const addItemOptions = ["Hotel", "Transfer", "Meal", "Sightseeing", "Information"];

const defaultForms = {
  Hotel: { hotelName: "", roomType: "", checkInTime: "14:00", notes: "" },
  Transfer: {
    transferType: "Airport Pickup",
    from: "",
    to: "",
    date: "12 May 2025",
    time: "10:30",
    vehicle: "Private Car",
    notes: "",
  },
  Meal: { mealType: "Dinner", restaurant: "", cuisine: "", time: "19:30", notes: "" },
  Sightseeing: { place: "", timing: "Afternoon", duration: "Half Day Tour", notes: "" },
  Information: { infoType: "General Note", note: "" },
};

const formFromItem = (item) => {
  if (item.type === "Hotel") {
    return {
      hotelName: item.detail1 || "",
      roomType: item.detail2 || "",
      checkInTime: item.time || "14:00",
      notes: "",
    };
  }

  if (item.type === "Transfer") {
    const [from = "", to = ""] = (item.detail1 || "").split(" -> ");
    return {
      transferType: "Airport Pickup",
      from,
      to,
      date: "12 May 2025",
      time: item.time || "10:30",
      vehicle: item.detail2 || "Private Car",
      notes: "",
    };
  }

  if (item.type === "Meal") {
    return {
      mealType: "Dinner",
      restaurant: item.detail1 || "",
      cuisine: item.detail2 || "",
      time: item.time || "19:30",
      notes: "",
    };
  }

  if (item.type === "Sightseeing") {
    return {
      place: item.detail1 || "",
      timing: "Afternoon",
      duration: item.detail2 || "",
      notes: "",
    };
  }

  return {
    infoType: item.detail1 || "General Note",
    note: item.detail2 || "",
  };
};

const toMinutes = (timeValue) => {
  const [h, m] = timeValue.split(":").map(Number);
  return h * 60 + m;
};

const normalizeTime = (timeValue) => {
  const [h, m] = timeValue.split(":");
  return `${h.padStart(2, "0")}:${m.padStart(2, "0")}`;
};

const getTypeMeta = (type) => iconByType[type] || iconByType.Information;

const buildItemFromForm = (panelType, formState, selectedDay) => {
  if (panelType === "Hotel") {
    return {
      id: `item-${Date.now()}`,
      time: formState.checkInTime || "14:00",
      type: "Hotel",
      title: "Hotel Check-in",
      detail1: formState.hotelName || "Hotel",
      detail2: formState.roomType || "Room details pending",
      status: "Manual",
      dayId: selectedDay.id,
    };
  }

  if (panelType === "Transfer") {
    return {
      id: `item-${Date.now()}`,
      time: formState.time || "10:30",
      type: "Transfer",
      title: "Transfer",
      detail1: `${formState.from || "Pickup"} -> ${formState.to || "Drop"}`,
      detail2: formState.vehicle || "Vehicle pending",
      status: "Manual",
      dayId: selectedDay.id,
    };
  }

  if (panelType === "Meal") {
    return {
      id: `item-${Date.now()}`,
      time: formState.time || "19:30",
      type: "Meal",
      title: "Meal",
      detail1: formState.restaurant || "Restaurant pending",
      detail2: formState.cuisine || formState.mealType,
      status: "Manual",
      dayId: selectedDay.id,
    };
  }

  if (panelType === "Sightseeing") {
    return {
      id: `item-${Date.now()}`,
      time: "16:00",
      type: "Sightseeing",
      title: "Sightseeing",
      detail1: formState.place || "Place pending",
      detail2: formState.duration || "Duration pending",
      status: "Manual",
      dayId: selectedDay.id,
    };
  }

  return {
    id: `item-${Date.now()}`,
    time: "12:00",
    type: "Information",
    title: "Information",
    detail1: formState.infoType || "General Note",
    detail2: formState.note || "No details",
    status: "Manual",
    dayId: selectedDay.id,
  };
};

const ItemRow = ({ item, onEdit, onDelete }) => {
  const typeMeta = getTypeMeta(item.type);
  const ItemIcon = typeMeta.icon;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const itemMenuRef = useRef(null);

  useEffect(() => {
    if (!isMenuOpen) return undefined;

    const handleOutsideClick = (event) => {
      if (itemMenuRef.current && !itemMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen]);

  return (
    <div className="grid grid-cols-[56px_minmax(0,1fr)] gap-3">
      <div className="flex items-start gap-2 pt-2 text-sm text-slate-500">
        <Clock3 size={14} className="mt-0.5" />
        <span>{normalizeTime(item.time)}</span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 transition-colors hover:border-violet-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-xl shrink-0 ${typeMeta.className}`}>
              <ItemIcon size={18} />
            </span>
            <div>
              <p className="text-base font-semibold text-slate-900">{item.title}</p>
              <p className="text-xs font-medium text-slate-500">{item.detail1}</p>
              <p className="mt-1 text-sm font-semibold  text-slate-600">{item.detail2}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-semibold ${item.status === "Included"
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-600"
                }`}
            >
              {item.status}
            </span>
            <div ref={itemMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-violet-600"
                title="Item actions"
              >
                <EllipsisVertical size={16} />
              </button>
              {isMenuOpen ? (
                <div className="absolute bottom-full right-0 z-50 mb-1 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      onEdit(item);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-violet-50"
                  >
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onDelete(item.id);
                      setIsMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddItemMenu = ({ onSelect }) => {
  return (
    <div className="absolute right-1 -top-28 z-20 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
      <p className="px-2 pb-2 pt-1 text-sm font-semibold text-slate-900">Add Item</p>
      <div className="space-y-1">
        {addItemOptions.map((option) => {
          const OptionIcon = getTypeMeta(option).icon;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
            >
              <OptionIcon size={16} />
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const DrawerField = ({ label, children }) => (
  <div>
    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
    {children}
  </div>
);

const RightDrawer = ({
  panelType,
  formState,
  setFormState,
  onClose,
  onSubmit,
  selectedDay,
  isEditing,
}) => {
  const setValue = (key, value) => setFormState((prev) => ({ ...prev, [key]: value }));

  return (
    <aside className="w-full rounded-xl border border-slate-200 bg-white p-4 xl:w-[320px]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xl font-semibold text-slate-900">Add {panelType}</p>
          <p className="text-sm text-slate-500">{selectedDay?.day} - {selectedDay?.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {panelType === "Hotel" ? (
          <>
            <DrawerField label="Hotel Name">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Search or enter hotel" value={formState.hotelName} onChange={(e) => setValue("hotelName", e.target.value)} />
            </DrawerField>
            <DrawerField label="Room Type">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" placeholder="Deluxe Room" value={formState.roomType} onChange={(e) => setValue("roomType", e.target.value)} />
            </DrawerField>
            <DrawerField label="Check-in Time">
              <input type="time" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.checkInTime} onChange={(e) => setValue("checkInTime", e.target.value)} />
            </DrawerField>
          </>
        ) : null}

        {panelType === "Transfer" ? (
          <>
            <DrawerField label="Transfer Type">
              <select className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.transferType} onChange={(e) => setValue("transferType", e.target.value)}>
                <option>Airport Pickup</option>
                <option>Intercity Travel</option>
                <option>Local Transport</option>
              </select>
            </DrawerField>
            <DrawerField label="From">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.from} onChange={(e) => setValue("from", e.target.value)} placeholder="From location" />
            </DrawerField>
            <DrawerField label="To">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.to} onChange={(e) => setValue("to", e.target.value)} placeholder="To location" />
            </DrawerField>
            <DrawerField label="Time">
              <input type="time" className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.time} onChange={(e) => setValue("time", e.target.value)} />
            </DrawerField>
          </>
        ) : null}

        {panelType === "Meal" ? (
          <>
            <DrawerField label="Meal Type">
              <div className="flex gap-2">
                {["Breakfast", "Lunch", "Dinner"].map((mealType) => (
                  <button key={mealType} type="button" onClick={() => setValue("mealType", mealType)} className={`rounded-lg border px-3 py-2 text-xs font-medium ${formState.mealType === mealType ? "border-violet-600 bg-violet-600 text-white" : "border-slate-200 text-slate-600"}`}>
                    {mealType}
                  </button>
                ))}
              </div>
            </DrawerField>
            <DrawerField label="Restaurant / Meal">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.restaurant} onChange={(e) => setValue("restaurant", e.target.value)} placeholder="Restaurant name" />
            </DrawerField>
            <DrawerField label="Cuisine">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.cuisine} onChange={(e) => setValue("cuisine", e.target.value)} placeholder="Thai Cuisine" />
            </DrawerField>
          </>
        ) : null}

        {panelType === "Sightseeing" ? (
          <>
            <DrawerField label="Place">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.place} onChange={(e) => setValue("place", e.target.value)} placeholder="Wat Arun" />
            </DrawerField>
            <DrawerField label="Duration">
              <input className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" value={formState.duration} onChange={(e) => setValue("duration", e.target.value)} placeholder="Half Day Tour" />
            </DrawerField>
          </>
        ) : null}

        {panelType === "Information" ? (
          <DrawerField label="Note">
            <textarea className="h-28 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm" value={formState.note} onChange={(e) => setValue("note", e.target.value)} placeholder="Enter your note" />
          </DrawerField>
        ) : null}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
        <button type="button" onClick={onClose} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Cancel
        </button>
        <button type="button" onClick={onSubmit} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700">
          {isEditing ? `Update ${panelType}` : `Add ${panelType}`}
        </button>
      </div>
    </aside>
  );
};

const ItineraryStep = ({ onBack, onNext }) => {
  const [days, setDays] = useState(initialDays);
  const [selectedDayId, setSelectedDayId] = useState(1);
  const [timelineItems, setTimelineItems] = useState(seedItems);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("");
  const [formState, setFormState] = useState({});
  const [editingItemId, setEditingItemId] = useState("");
  const [openDayMenuId, setOpenDayMenuId] = useState(null);
  const [dayEditState, setDayEditState] = useState({ open: false, dayId: null, title: "" });
  const [confirmState, setConfirmState] = useState({ open: false, type: "", targetId: null, message: "" });
  const selectedDay = days.find((day) => day.id === selectedDayId) || days[0];
  const addItemMenuRef = useRef(null);

  const sortedItems = useMemo(
    () =>
      [...timelineItems]
        .filter((item) => item.dayId === selectedDayId)
        .sort((a, b) => toMinutes(a.time) - toMinutes(b.time)),
    [timelineItems, selectedDayId],
  );

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isMenuOpen &&
        addItemMenuRef.current &&
        !addItemMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }

      if (
        openDayMenuId &&
        !event.target.closest("[data-day-menu='true']")
      ) {
        setOpenDayMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isMenuOpen, openDayMenuId]);

  const closePanel = () => {
    setActivePanel("");
    setFormState({});
    setEditingItemId("");
  };

  const openPanel = (panelType) => {
    setActivePanel(panelType);
    setFormState(defaultForms[panelType] || {});
    setEditingItemId("");
    setIsMenuOpen(false);
  };

  const handleEditItem = (item) => {
    setActivePanel(item.type);
    setFormState(formFromItem(item));
    setEditingItemId(item.id);
    setIsMenuOpen(false);
  };

  const removeItem = (itemId) => {
    setTimelineItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const removeDay = (dayId) => {
    if (days.length <= 1) return;
    const remainingDays = days.filter((day) => day.id !== dayId);
    setDays(remainingDays);
    setTimelineItems((prev) => prev.filter((item) => item.dayId !== dayId));
    if (selectedDayId === dayId) setSelectedDayId(remainingDays[0].id);
    setOpenDayMenuId(null);
    setIsMenuOpen(false);
    closePanel();
  };

  const openDeleteConfirm = (type, targetId, message) => {
    setConfirmState({ open: true, type, targetId, message });
  };

  const closeDeleteConfirm = () => {
    setConfirmState({ open: false, type: "", targetId: null, message: "" });
  };

  const handleConfirmDelete = () => {
    if (confirmState.type === "item" && confirmState.targetId) removeItem(confirmState.targetId);
    if (confirmState.type === "day" && confirmState.targetId) removeDay(confirmState.targetId);
    closeDeleteConfirm();
  };

  const handleAddItem = () => {
    if (!activePanel) return;
    if (editingItemId) {
      const updatedItem = buildItemFromForm(activePanel, formState, selectedDay);
      setTimelineItems((prev) => prev.map((item) => (item.id === editingItemId ? { ...updatedItem, id: item.id } : item)));
    } else {
      const newItem = buildItemFromForm(activePanel, formState, selectedDay);
      setTimelineItems((prev) => [...prev, newItem]);
    }
    closePanel();
  };

  const handleAddDay = () => {
    const nextId = days.length ? Math.max(...days.map((day) => day.id)) + 1 : 1;
    const newDay = { id: nextId, day: `Day ${days.length + 1}`, title: "New Day Plan", icon: TreePalm };
    setDays((prev) => [...prev, newDay]);
    setSelectedDayId(nextId);
    setIsMenuOpen(false);
    setOpenDayMenuId(null);
    closePanel();
  };

  const openEditDayModal = (dayId) => {
    const dayToEdit = days.find((day) => day.id === dayId);
    if (!dayToEdit) return;
    setDayEditState({ open: true, dayId, title: dayToEdit.title });
    setOpenDayMenuId(null);
  };

  const handleEditDay = () => {
    if (!dayEditState.dayId) return;
    const trimmedTitle = dayEditState.title.trim();
    if (!trimmedTitle) return;
    setDays((prev) => prev.map((day) => (day.id === dayEditState.dayId ? { ...day, title: trimmedTitle } : day)));
    setDayEditState({ open: false, dayId: null, title: "" });
  };

  return (
    <div className="px-7 py-5">
      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <aside className="rounded-xl border border-slate-200 bg-white p-4">
          <h4 className="text-2xl font-semibold text-slate-900">Itinerary Overview</h4>
          <p className="mt-1 text-xs text-slate-500">Build your day by day itinerary</p>
          <div className="mt-4 space-y-2 max-h-[445px] overflow-auto no-scrollbar">
            {days.map((dayTab) => (
              <button
                key={dayTab.id}
                type="button"
                onClick={() => {
                  setSelectedDayId(dayTab.id);
                  setIsMenuOpen(false);
                  setOpenDayMenuId(null);
                  closePanel();
                }}
                className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition-colors ${dayTab.id === selectedDayId ? "border-violet-200 bg-violet-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
              >
                <div className="flex items-center gap-2">
                  <span className={`inline-flex h-8 w-8 items-center justify-center rounded-md ${dayTab.id === selectedDayId ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-500"}`}>
                    <dayTab.icon size={16} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{dayTab.day}</p>
                    <p className="text-xs font-medium text-slate-500 max-w-[125px] truncate overflow-hidden
                    ">{dayTab.title}</p>
                  </div>
                </div>

                <div data-day-menu="true" className="relative">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenDayMenuId((prev) => (prev === dayTab.id ? null : dayTab.id));
                    }}
                    className="rounded p-1 text-slate-400 hover:bg-slate-100"
                  >
                    <EllipsisVertical size={14} />
                  </button>
                  {openDayMenuId === dayTab.id ? (
                    <div className="absolute right-0 z-50 mt-1 w-32 rounded-lg border border-slate-200 bg-white p-1 shadow-lg">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDayModal(dayTab.id);
                        }}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-slate-700 hover:bg-violet-50"
                      >
                        <Pencil size={14} /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteConfirm("day", dayTab.id, `Delete ${dayTab.day}? All activities in this day will be removed.`);
                          setOpenDayMenuId(null);
                        }}
                        disabled={days.length <= 1}
                        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm text-rose-600 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  ) : null}
                </div>
              </button>
            ))}
          </div>

          <button type="button" onClick={handleAddDay} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2.5 text-sm font-semibold text-violet-600 hover:bg-violet-50">
            <Plus size={16} /> Add Day
          </button>
        </aside>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-3xl font-semibold text-slate-900">{selectedDay?.day} - {selectedDay?.title}</h4>
              <p className="mt-1 text-xs text-slate-500">Add activities, transfers, hotels and meals for this day</p>
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-lg border border-violet-200 px-3 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50">
              <Eye size={16} /> Preview Day
            </button>
          </div>

          <div className="mt-4 space-y-3 max-h-[445px] overflow-auto no-scrollbar">
            {sortedItems.map((item) => (
              <ItemRow
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={(itemId) => openDeleteConfirm("item", itemId, "Are you sure you want to delete this item?")}
              />
            ))}
          </div>
          <div ref={addItemMenuRef} className="relative mt-4">
            <button type="button" onClick={() => setIsMenuOpen((prev) => !prev)} className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-violet-300 bg-white px-3 py-2.5 text-sm font-semibold text-violet-600 hover:bg-violet-50">
              <Plus size={16} /> Add Item
              <ChevronDown size={16} />
            </button>
            {isMenuOpen ? <AddItemMenu onSelect={openPanel} /> : null}
          </div>
        </section>

        {activePanel ? (
          <RightDrawer panelType={activePanel} formState={formState} setFormState={setFormState} onClose={closePanel} onSubmit={handleAddItem} selectedDay={selectedDay} isEditing={Boolean(editingItemId)} />
        ) : (
          <aside className="rounded-xl border border-slate-200 bg-white p-4">
            <h4 className="text-2xl font-semibold text-slate-900">Day Summary</h4>
            <img
              src="https://images.unsplash.com/photo-1563492065-1f3c16c6f11b?auto=format&fit=crop&w=640&q=80"
              alt="Day destination"
              className="mt-3 h-36 w-full rounded-lg object-cover"
            />
            <p className="mt-3 text-lg font-semibold text-slate-900">{selectedDay?.day}</p>
            <p className="text-sm text-slate-500">{selectedDay?.title}</p>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-violet-100 text-violet-600">
                  <ListChecks size={14} />
                </span>
                <p>{sortedItems.length} Items Added</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-600">
                  <Car size={14} />
                </span>
                <p>{sortedItems.filter((item) => item.type === "Transfer").length} Transfer</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                  <BedDouble size={14} />
                </span>
                <p>{sortedItems.filter((item) => item.type === "Hotel").length} Hotel</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-amber-100 text-amber-600">
                  <TentTree size={14} />
                </span>
                <p>{sortedItems.filter((item) => item.type === "Sightseeing").length} Sightseeing</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-pink-100 text-pink-600">
                  <Soup size={14} />
                </span>
                <p>{sortedItems.filter((item) => item.type === "Meal").length} Meal</p>
              </div>
            </div>
          </aside>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-slate-200 pt-4">
        <button type="button" onClick={onBack} className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
          Back
        </button>
        <button type="button" onClick={onNext} className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
          Next Step
        </button>
      </div>

      {dayEditState.open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <h4 className="text-lg font-semibold text-slate-900">Edit Day</h4>
            <p className="mt-1 text-sm text-slate-500">Update the day title.</p>
            <input className="mt-4 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-violet-300" value={dayEditState.title} onChange={(e) => setDayEditState((prev) => ({ ...prev, title: e.target.value }))} placeholder="Enter day title" />
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setDayEditState({ open: false, dayId: null, title: "" })} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleEditDay} disabled={!dayEditState.title.trim()} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300">
                Save
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {confirmState.open ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <h4 className="text-lg font-semibold text-slate-900">Confirm Delete</h4>
            <p className="mt-1 text-sm text-slate-500">{confirmState.message}</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={closeDeleteConfirm} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
              <button type="button" onClick={handleConfirmDelete} className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ItineraryStep;