import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  FileText,
  PencilLine,
  Sparkles,
  Upload,
  X,
  MapPin,
  CalendarDays,
  Plane,
  Building2,
  Pencil,
  Trash2,
  RotateCcw,
  Save,
  UploadCloud,
} from "lucide-react";
import Select from "react-select";
import ItineraryStep from "./ItineraryStep";
import ReviewStep from "./ReviewStep";
import { fetchHotels } from "../api";
import toast from "react-hot-toast";

const creationOptions = [
  {
    title: "Manual Creation",
    description: "Create itinerary manually step by step",
    icon: PencilLine,
    iconBgClass: "bg-violet-600",
  },
  {
    title: "Build with AI",
    description: "Let AI generate itinerary for you",
    icon: Sparkles,
    iconBgClass: "bg-blue-500",
  },
  {
    title: "MD File Uploads",
    description: "Upload MD files and generate itineraries",
    icon: FileText,
    iconBgClass: "bg-emerald-500",
  },
];

const modalSteps = ["Basic Info", "Itinerary", "Review"];
const API_URL = "http://localhost:3000/api";

const nightsOptions = Array.from({ length: 20 }, (_, idx) => ({
  value: idx + 1,
  label: `${idx + 1} Night${idx + 1 > 1 ? "s" : ""}`,
}));

const aiInitialDays = [
  {
    id: 1,
    title: "Arrival in Goa",
    activities: [
      {
        id: "a-1",
        icon: Plane,
        title: "Airport pickup & hotel check-in",
        subtitle: "Dabolim Airport to North Goa Hotel",
      },
      {
        id: "a-2",
        icon: MapPin,
        title: "Calangute Beach visit",
        subtitle: "Relax and enjoy the beach",
      },
      {
        id: "a-3",
        icon: CalendarDays,
        title: "Sunset at Baga Beach",
        subtitle: "Evening by the sea",
      },
    ],
  },
  {
    id: 2,
    title: "North Goa Sightseeing",
    activities: [
      {
        id: "b-1",
        icon: Building2,
        title: "Fort Aguada",
        subtitle: "Historic fort with sea views",
      },
      {
        id: "b-2",
        icon: MapPin,
        title: "Anjuna Beach & Flea Market",
        subtitle: "Explore beach and local market",
      },
      {
        id: "b-3",
        icon: CalendarDays,
        title: "Cruise on Mandovi River",
        subtitle: "Dinner cruise with music",
      },
    ],
  },
  {
    id: 3,
    title: "South Goa & Departure",
    activities: [
      {
        id: "c-1",
        icon: Building2,
        title: "Basilica of Bom Jesus",
        subtitle: "UNESCO World Heritage Site",
      },
      {
        id: "c-2",
        icon: MapPin,
        title: "Colva Beach",
        subtitle: "Relax and unwind",
      },
      {
        id: "c-3",
        icon: Plane,
        title: "Airport Drop",
        subtitle: "Transfer to Dabolim Airport",
      },
    ],
  },
];

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: 46,
    borderRadius: 8,
    borderColor: state.isFocused ? "#a78bfa" : "#e2e8f0",
    boxShadow: "none",
    "&:hover": {
      borderColor: state.isFocused ? "#a78bfa" : "#cbd5e1",
    },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 12px" }),
  placeholder: (base) => ({ ...base, color: "#94a3b8", fontSize: 14 }),
  singleValue: (base) => ({ ...base, color: "#1e293b", fontSize: 14 }),
  menu: (base) => ({ ...base, zIndex: 9999 }),
  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
};

const CreateNewPackage = () => {
  const selectPortalTarget = typeof document !== "undefined" ? document.body : null;
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isMDModalOpen, setIsMDModalOpen] = useState(false);
  const [isEditActivityModalOpen, setIsEditActivityModalOpen] = useState(false);
  const [filename, setFilename] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isManualSaving, setIsManualSaving] = useState(false);
  const [manualPackageName, setManualPackageName] = useState("");
  const [destination, setDestination] = useState(null);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [manualPrice, setManualPrice] = useState("");
  const [locations, setLocations] = useState([]);
  const [hotelLocations, setHotelLocations] = useState([]);
  const [nights, setNights] = useState(null);
  const [days, setDays] = useState(null);
  const [manualItineraryData, setManualItineraryData] = useState({ days: [], timelineItems: [] });

  const resetField = () => {
    console.log('Clicked');
    setFilename(null);
    setDestination(null);
    setStartLocation(null);
    setEndLocation(null);
    setNights(null);
    setDays(null);
    setFilename(null);
  }

  const [aiForm, setAiForm] = useState({
    packageName: "Goa Beach Escape",
    state: "",
    city: "",
    nights: 2,
  });
  const [aiDays, setAiDays] = useState(aiInitialDays);
  const [editingActivity, setEditingActivity] = useState({
    dayId: null,
    activityId: null,
    title: "",
    subtitle: "",
  });
  const coverImagePreview = useMemo(
    () => (filename ? URL.createObjectURL(filename) : ""),
    [filename]
  );
  const [mdFile, setMdFile] = useState(null);
  const [mdFileContent, setMdFileContent] = useState("");
  const [isMdParsing, setIsMdParsing] = useState(false);
  const [isMdSaving, setIsMdSaving] = useState(false);
  const [mdParsedPackage, setMdParsedPackage] = useState(null);

  const aiStates = useMemo(
    () =>
      [...new Set(hotelLocations.map((hotel) => hotel.state).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [hotelLocations]
  );
  const aiCityOptions = useMemo(() => {
    if (!aiForm.state) return [];

    return [...new Set(
      hotelLocations
        .filter((hotel) => hotel.state === aiForm.state)
        .map((hotel) => hotel.city)
        .filter(Boolean)
    )].sort((a, b) => a.localeCompare(b));
  }, [hotelLocations, aiForm.state]);
  const selectedAiState = aiStates.includes(aiForm.state) ? aiForm.state : "";
  const selectedAiCity = aiCityOptions.includes(aiForm.city) ? aiForm.city : "";
  const destinationOptions = useMemo(
    () =>
      [...new Set(locations.map((location) => location.state).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b))
        .map((state) => ({ value: state, label: state })),
    [locations]
  );
  const cityOptions = useMemo(() => {
    if (!destination?.value) return [];

    return [...new Set(
      locations
        .filter((location) => location.state === destination.value)
        .map((location) => location.city)
        .filter(Boolean)
    )]
      .sort((a, b) => a.localeCompare(b))
      .map((city) => ({ value: city, label: city }));
  }, [locations, destination]);

  const handleOptionClick = (title) => {
    if (title === "Manual Creation") {
      setIsManualModalOpen(true);
      setCurrentStep(1);
      return;
    }

    if (title === "Build with AI") {
      setIsAIModalOpen(true);
      return;
    }

    if (title === "MD File Uploads") {
      setIsMDModalOpen(true);
    }
  };

  const closeManualModal = () => {
    setIsManualModalOpen(false);
    setCurrentStep(1);
    setManualItineraryData({ days: [], timelineItems: [] });
    setIsManualSaving(false);
  };

  const closeAIModal = () => {
    setIsAIModalOpen(false);
    setIsEditActivityModalOpen(false);
  };

  const closeMDModal = () => {
    setIsMDModalOpen(false);
    setMdFile(null);
    setMdFileContent("");
    setMdParsedPackage(null);
    setIsMdParsing(false);
    setIsMdSaving(false);
  };

  const parseMarkdownPackage = (markdownText) => {
    const text = (markdownText || "").trim();
    const lines = text.split(/\r?\n/);

    const titleFromHeading =
      lines.find((line) => /^#\s+/.test(line))?.replace(/^#\s+/, "").trim() || "";
    const titleFromKey =
      text.match(/(?:package\s*name|title)\s*:\s*(.+)/i)?.[1]?.trim() || "";
    const packageName = titleFromHeading || titleFromKey || "Untitled Package";

    const destination =
      text.match(/destination\s*:\s*(.+)/i)?.[1]?.trim() ||
      text.match(/state\s*:\s*(.+)/i)?.[1]?.trim() ||
      text.match(/city\s*:\s*(.+)/i)?.[1]?.trim() ||
      "";

    const durationMatch =
      text.match(/(\d+)\s*D\s*\/\s*(\d+)\s*N/i) ||
      text.match(/(\d+)\s*days?\s*\/\s*(\d+)\s*nights?/i);
    const parsedDays = durationMatch ? Number(durationMatch[1]) : 0;
    const parsedNights = durationMatch ? Number(durationMatch[2]) : Math.max(parsedDays - 1, 0);
    const priceMatch =
      text.match(/(?:package\s*)?price\s*:\s*(?:rs\.?|inr|₹)?\s*([\d,]+)/i) ||
      text.match(/(?:rs\.?|inr|₹)\s*([\d,]+)/i);
    const parsedPrice = priceMatch ? Number(String(priceMatch[1]).replace(/,/g, "")) : 0;

    const itinerary = [];
    let currentDay = null;

    lines.forEach((rawLine) => {
      const line = rawLine.trim();
      const dayMatch = line.match(/^#{2,3}\s*Day\s*(\d+)\s*[:\-]?\s*(.*)$/i);
      if (dayMatch) {
        if (currentDay) itinerary.push(currentDay);
        const dayNumber = Number(dayMatch[1]);
        currentDay = {
          day: dayNumber,
          title: dayMatch[2]?.trim() || `Day ${dayNumber}`,
          hotel: "",
          transfer: "",
          sightseeing: [],
          meals: [],
          activities: [],
          info: "",
        };
        return;
      }

      if (!currentDay) return;

      const bulletMatch = line.match(/^[-*]\s+(.+)$/);
      if (!bulletMatch) return;

      const item = bulletMatch[1].trim();
      if (!item) return;

      currentDay.activities.push({
        time: "",
        type: "Information",
        title: item,
        detail1: item,
        detail2: "",
        status: "Planned",
      });
    });

    if (currentDay) itinerary.push(currentDay);

    const days = itinerary.length || parsedDays || 0;
    const nights = parsedNights || (days > 0 ? Math.max(days - 1, 0) : 0);

    return {
      packageName,
      destination,
      days,
      nights,
      price: Number.isFinite(parsedPrice) ? parsedPrice : 0,
      itinerary,
    };
  };

  const handleMDFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMdFile(file);

    const text = await file.text();
    setMdFileContent(text);
  };

  const handleParseMDFile = () => {
    if (!mdFileContent.trim()) {
      toast.error("Please upload a markdown (.md) file first.");
      return;
    }

    setIsMdParsing(true);
    try {
      const parsed = parseMarkdownPackage(mdFileContent);
      if (!parsed.itinerary.length) {
        toast.error("Could not find itinerary days in this file. Use headings like '## Day 1'.");
        setMdParsedPackage(null);
        return;
      }
      setMdParsedPackage(parsed);
    } finally {
      setIsMdParsing(false);
    }
  };

  const handleConfirmMDPackage = async () => {
    if (!mdParsedPackage?.itinerary?.length) {
      toast.error("Please upload and parse a valid markdown file first.");
      return;
    }

    const payload = {
      title: mdParsedPackage.packageName || "Untitled Package",
      state: mdParsedPackage.destination || "Unknown",
      city: mdParsedPackage.destination || "Unknown",
      startCity: mdParsedPackage.destination || "Unknown",
      endCity: mdParsedPackage.destination || "Unknown",
      price: Number(mdParsedPackage.price || 0),
      duration: {
        days: Number(mdParsedPackage.days || 0),
        nights: Number(mdParsedPackage.nights || 0),
      },
      itinerary: mdParsedPackage.itinerary,
      createdVia: "md",
    };

    setIsMdSaving(true);
    try {
      const response = await fetch(`${API_URL}/packages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save package from markdown.");
      }

      toast.success("Markdown package saved successfully.");
      closeMDModal();
    } catch (error) {
      console.error("Failed to save markdown package", error);
      toast.error(error?.message || "Failed to save markdown package.");
    } finally {
      setIsMdSaving(false);
    }
  };


  const handleNightsChange = (selectedOption) => {
    setNights(selectedOption);

    if (!selectedOption) {
      setDays(null);
      return;
    }

    const calculatedDays = selectedOption.value + 1;
    setDays({
      value: calculatedDays,
      label: `${calculatedDays} Day${calculatedDays > 1 ? "s" : ""}`,
    });
  };

  const handleCoverImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFilename(file);
  };

  const handleAiFieldChange = (field, value) => {
    setAiForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeleteActivity = (dayId, activityId) => {
    setAiDays((prev) =>
      prev.map((day) => {
        if (day.id !== dayId) return day;
        return {
          ...day,
          activities: day.activities.filter((activity) => activity.id !== activityId),
        };
      })
    );
  };

  const handleEditActivityOpen = (dayId, activity) => {
    setEditingActivity({
      dayId,
      activityId: activity.id,
      title: activity.title,
      subtitle: activity.subtitle,
    });
    setIsEditActivityModalOpen(true);
  };

  const handleEditActivityClose = () => {
    setIsEditActivityModalOpen(false);
    setEditingActivity({
      dayId: null,
      activityId: null,
      title: "",
      subtitle: "",
    });
  };

  const handleEditActivityFieldChange = (field, value) => {
    setEditingActivity((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEditedActivity = () => {
    if (!editingActivity.dayId || !editingActivity.activityId) return;

    setAiDays((prev) =>
      prev.map((day) => {
        if (day.id !== editingActivity.dayId) return day;
        return {
          ...day,
          activities: day.activities.map((activity) =>
            activity.id === editingActivity.activityId
              ? {
                ...activity,
                title: editingActivity.title.trim() || activity.title,
                subtitle: editingActivity.subtitle.trim(),
              }
              : activity
          ),
        };
      })
    );

    handleEditActivityClose();
  };

  useEffect(
    () => () => {
      if (coverImagePreview) {
        URL.revokeObjectURL(coverImagePreview);
      }
    },
    [coverImagePreview]
  );

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(`${API_URL}/master-data/locations`);
        if (!response.ok) {
          throw new Error("Failed to fetch locations");
        }
        const data = await response.json();
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to fetch locations", error);
        setLocations([]);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchHotelLocations = async () => {
      try {
        const hotels = await fetchHotels();
        setHotelLocations(Array.isArray(hotels) ? hotels : []);
      } catch (error) {
        console.error("Failed to fetch hotels", error);
        setHotelLocations([]);
      }
    };

    fetchHotelLocations();
  }, []);

  useEffect(() => {
    if (!destination?.value) {
      setStartLocation(null);
      setEndLocation(null);
      return;
    }

    const isStartValid = cityOptions.some((option) => option.value === startLocation?.value);
    const isEndValid = cityOptions.some((option) => option.value === endLocation?.value);

    if (!isStartValid) setStartLocation(null);
    if (!isEndValid) setEndLocation(null);
  }, [destination, cityOptions, startLocation, endLocation]);

  useEffect(() => {
    const anyModalOpen = isManualModalOpen || isAIModalOpen || isMDModalOpen || isEditActivityModalOpen;
    if (!anyModalOpen) return undefined;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isManualModalOpen, isAIModalOpen, isMDModalOpen, isEditActivityModalOpen]);

  const aiDaysCount = Math.max(1, Number(aiForm.nights || 1) + 1);

  const buildManualItineraryPayload = (itineraryData) => {
    const dayList = itineraryData?.days || [];
    const items = itineraryData?.timelineItems || [];

    return dayList.map((day, index) => {
      const dayItems = items
        .filter((item) => item.dayId === day.id)
        .sort((a, b) => a.time.localeCompare(b.time));

      return {
        day: index + 1,
        title: day.title,
        hotel: dayItems.find((item) => item.type === "Hotel")?.detail1 || "",
        transfer: dayItems.find((item) => item.type === "Transfer")?.detail1 || "",
        sightseeing: dayItems
          .filter((item) => item.type === "Sightseeing")
          .map((item) => item.detail1),
        meals: dayItems
          .filter((item) => item.type === "Meal")
          .map((item) => item.detail1),
        activities: dayItems.map((item) => ({
          time: item.time,
          type: item.type,
          title: item.title,
          detail1: item.detail1,
          detail2: item.detail2,
          status: item.status,
        })),
        info: dayItems
          .filter((item) => item.type === "Information")
          .map((item) => item.detail2)
          .join(" | "),
      };
    });
  };

  const handleCreateManualPackage = async () => {
    if (!manualPackageName.trim()) {
      toast.error("Please enter package name.");
      setCurrentStep(1);
      return;
    }
    if (!destination?.value || !startLocation?.value || !endLocation?.value || !days?.value || !nights?.value) {
      toast.error("Please complete basic package information.");
      setCurrentStep(1);
      return;
    }
    if (!manualPrice || Number(manualPrice) <= 0) {
      toast.error("Please enter a valid package price.");
      setCurrentStep(1);
      return;
    }
    if (!manualItineraryData.days.length || !manualItineraryData.timelineItems.length) {
      toast.error("Please add itinerary details before creating package.");
      setCurrentStep(2);
      return;
    }
    if (Number(days?.value || 0) !== manualItineraryData.days.length) {
      toast.error(
        `You can save only with exactly ${days?.value || 0} itinerary days for ${nights?.value || 0} night ${days?.value || 0} days trip.`
      );
      setCurrentStep(2);
      return;
    }

    setIsManualSaving(true);
    try {
      const itinerary = buildManualItineraryPayload(manualItineraryData);
      const formPayload = new FormData();
      formPayload.append("title", manualPackageName.trim());
      formPayload.append("state", destination.value);
      formPayload.append("city", startLocation.value);
      formPayload.append("startCity", startLocation.value);
      formPayload.append("endCity", endLocation.value);
      formPayload.append("price", String(Number(manualPrice)));
      formPayload.append(
        "duration",
        JSON.stringify({
          days: Number(days.value),
          nights: Number(nights.value),
        })
      );
      formPayload.append("itinerary", JSON.stringify(itinerary));
      formPayload.append("createdVia", "manual");

      if (filename) {
        // Must match multer field name on backend
        formPayload.append("image", filename);
      }

      const response = await fetch(`${API_URL}/packages`, {
        method: "POST",
        body: formPayload,
      });

      if (!response.ok) {
        let serverMessage = "Failed to create package";
        try {
          const errorData = await response.json();
          serverMessage = errorData?.message || serverMessage;
        } catch {
          try {
            const text = await response.text();
            if (text) serverMessage = text;
          } catch {
            // ignore
          }
        }
        throw new Error(serverMessage);
      }

      toast.success("Package created successfully.");
      closeManualModal();
      setManualPackageName("");
      setDestination(null);
      setStartLocation(null);
      setEndLocation(null);
      setNights(null);
      setDays(null);
      setManualPrice("");
      setFilename(null);
    } catch (error) {
      console.error("Failed to create package", error);
      toast.error(error?.message || "Failed to create package.");
    } finally {
      setIsManualSaving(false);
    }
  };

  const handleGenerateManualMarkdown = () => {
    const packageName = (manualPackageName || "Untitled Package").trim();
    const state = destination?.value || "-";
    const startCity = startLocation?.value || "-";
    const endCity = endLocation?.value || "-";
    const durationDays = Number(days?.value || 0);
    const durationNights = Number(nights?.value || 0);
    const price = manualPrice ? Number(manualPrice) : 0;
    const itinerary = buildManualItineraryPayload(manualItineraryData);

    if (!itinerary.length) {
      toast.error("Please add itinerary details before generating .md file.");
      return;
    }

    const itineraryMarkdown = itinerary
      .map((day) => {
        const sections = [
          `## Day ${day.day}: ${day.title || `Day ${day.day}`}`,
          `- Hotel: ${day.hotel || "-"}`,
          `- Transfer: ${day.transfer || "-"}`,
          `- Meal: ${day.meals?.length ? day.meals.join(", ") : "-"}`,
          `- Sightseeing: ${day.sightseeing?.length ? day.sightseeing.join(", ") : "-"}`,
          `- Information: ${day.info || "-"}`,
        ];
        return sections.join("\n");
      })
      .join("\n\n");

    const markdownContent = [
      `# ${packageName}`,
      "",
      `- State: ${state}`,
      `- Start City: ${startCity}`,
      `- End City: ${endCity}`,
      `- Duration: ${durationDays}D/${durationNights}N`,
      `- Price: ${price > 0 ? price : "-"}`,
      "",
      "## Itinerary",
      itineraryMarkdown,
      "",
    ].join("\n");

    const fileName = `${packageName.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase() || "package"}.md`;
    const blob = new Blob([markdownContent], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <section className="h-full rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="text-2xl font-semibold text-slate-900">Create New Package</h3>
        <p className="mt-1 text-xs text-slate-500">
          Choose a method to create your travel package
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {creationOptions.map((option) => (
            <button
              key={option.title}
              type="button"
              onClick={() => handleOptionClick(option.title)}
              className="group relative flex w-full items-end justify-center rounded-xl border border-slate-200 p-6 text-left transition-colors hover:border-slate-300"
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <span
                  className={`inline-flex h-12 w-12 items-center justify-center rounded-xl text-white ${option.iconBgClass}`}
                >
                  <option.icon size={20} />
                </span>
                <div>
                  <p className="text-lg font-semibold text-slate-800">{option.title}</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">{option.description}</p>
                </div>
              </div>
              <div className="absolute right-2 top-2">
                <div className="rotate-320 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-all duration-200 group-hover:translate-x-1 group-hover:bg-violet-100 group-hover:text-violet-600">
                  <ArrowRight size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {isManualModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="max-h-[95vh] w-full max-w-7xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 px-7 py-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-2xl font-semibold text-slate-900">Manual Create Package</h3>
                  <p className="mt-1 text-base font-medium text-slate-500">
                    Create your travel package step by step
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeManualModal}
                  className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={22} />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-sm">
                {modalSteps.map((step, idx) => (
                  <div key={step} className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs font-semibold ${currentStep === idx + 1
                        ? "border-violet-600 bg-violet-600 text-white"
                        : currentStep > idx + 1
                          ? "border-violet-200 bg-violet-50 text-violet-700"
                          : "border-slate-300 bg-white text-slate-600"
                        }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={
                        currentStep === idx + 1
                          ? "font-semibold text-violet-600"
                          : currentStep > idx + 1
                            ? "font-medium text-violet-700"
                            : "text-slate-600"
                      }
                    >
                      {step}
                    </span>
                    {idx < modalSteps.length - 1 ? (
                      <span className="w-10 border-t border-dashed border-slate-300" />
                    ) : null}
                  </div>
                ))}
              </div>
            </div>

            {currentStep === 1 ? (
              <>
                <div className="px-7 py-6">
                  <h4 className="text-2xl font-semibold text-slate-900">Basic Information</h4>
                  <p className="mt-1 text-sm text-slate-500">
                    Provide the basic details for your travel package.
                  </p>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <input
                      className="rounded-lg border border-slate-200 px-4 py-3 text-sm md:col-span-2"
                      placeholder="Enter package name"
                      value={manualPackageName}
                      onChange={(e) => setManualPackageName(e.target.value)}
                    />
                    <label className="relative flex min-h-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-violet-300 bg-violet-50/30 p-2 text-center text-sm text-slate-500 md:col-span-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleCoverImageChange}
                        className="hidden"
                      />
                      {coverImagePreview ? (
                        <>
                          <img
                            src={coverImagePreview}
                            alt="Cover preview"
                            className="h-full max-h-[160px] w-full rounded-md object-cover"
                          />
                          <div className="absolute inset-0 flex items-end justify-center bg-slate-900/0 p-2 opacity-0 transition-opacity hover:bg-slate-900/20 hover:opacity-100">
                            <span className="rounded bg-white/90 px-2 py-1 text-xs font-medium text-slate-700">
                              Change Image
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={18} className="text-violet-600" />
                          <span className="font-medium text-slate-700">Upload Cover Image</span>
                          <span className="text-xs text-slate-500">PNG, JPG up to 5MB</span>
                        </div>
                      )}
                    </label>
                    <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
                      <Select
                        options={destinationOptions}
                        value={destination}
                        onChange={(selectedState) => {
                          setDestination(selectedState);
                        }}
                        isClearable
                        isSearchable
                        placeholder="Search State..."
                        menuPortalTarget={selectPortalTarget}
                        menuPosition="fixed"
                        styles={customSelectStyles}
                      />
                      <Select
                        options={cityOptions}
                        value={startLocation}
                        onChange={setStartLocation}
                        isClearable
                        isSearchable
                        placeholder="Select start City"
                        isDisabled={!destination}
                        menuPortalTarget={selectPortalTarget}
                        menuPosition="fixed"
                        styles={customSelectStyles}
                      />
                      <Select
                        options={cityOptions}
                        value={endLocation}
                        onChange={setEndLocation}
                        isClearable
                        isSearchable
                        placeholder="Select end City"
                        isDisabled={!destination}
                        menuPortalTarget={selectPortalTarget}
                        menuPosition="fixed"
                        styles={customSelectStyles}
                      />
                    </div>
                    <div className="grid gap-3 md:col-span-2 md:grid-cols-3">
                      <Select
                        options={nightsOptions}
                        value={nights}
                        onChange={handleNightsChange}
                        isClearable
                        isSearchable
                        placeholder="Select nights"
                        menuPortalTarget={selectPortalTarget}
                        menuPosition="fixed"
                        styles={customSelectStyles}
                      />
                      <Select
                        options={days ? [days] : []}
                        value={days}
                        onChange={() => { }}
                        isDisabled
                        placeholder="Days (Auto)"
                        menuPortalTarget={selectPortalTarget}
                        menuPosition="fixed"
                        styles={customSelectStyles}
                      />
                      <input
                        type="number"
                        min="0"
                        value={manualPrice}
                        onChange={(e) => setManualPrice(e.target.value)}
                        placeholder="Enter price"
                        className="rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-violet-400"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-7 py-4">
                  <button
                    type="button"
                    onClick={closeManualModal}
                    className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-violet-700"
                  >
                    Next Step
                  </button>
                </div>
              </>
            ) : null}

            {currentStep === 2 ? (
              <ItineraryStep
                onBack={() => setCurrentStep(1)}
                onNext={(itineraryData) => {
                  setManualItineraryData(itineraryData);
                  setCurrentStep(3);
                }}
                initialData={manualItineraryData}
                selectedState={destination?.value || ""}
                selectedTripDays={Number(days?.value || 0)}
                selectedTripNights={Number(nights?.value || 0)}
              />
            ) : null}

            {currentStep === 3 ? (
              <ReviewStep
                onBack={() => setCurrentStep(2)}
                onClose={closeManualModal}
                onCreate={handleCreateManualPackage}
                onGenerateMd={handleGenerateManualMarkdown}
                isSaving={isManualSaving}
                packageData={{
                  packageName: manualPackageName,
                  state: destination?.value || "",
                  startCity: startLocation?.value || "",
                  endCity: endLocation?.value || "",
                  price: Number(manualPrice) || 0,
                  days: days?.value || 0,
                  nights: nights?.value || 0,
                }}
                itineraryData={manualItineraryData}
              />
            ) : null}
          </div>
        </div>
      ) : null}

      {isMDModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4">
          <div className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="text-2xl font-semibold text-slate-900">MD File Uploads</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload markdown packages or generate a prompt template.
                </p>
              </div>
              <button
                type="button"
                onClick={closeMDModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div data-lenis-prevent className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
                <button
                  type="button"
                  className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                >
                  1. Upload .md & Confirm Package
                </button>
              </div>

              <div className="mt-5 space-y-5">
                  <label className="flex cursor-pointer items-center justify-center rounded-xl border border-dashed border-violet-300 bg-violet-50/40 px-4 py-10 text-center transition hover:bg-violet-50">
                    <input type="file" accept=".md,text/markdown" onChange={handleMDFileChange} className="hidden" />
                    <div className="flex flex-col items-center">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-violet-600">
                        <UploadCloud size={18} />
                      </span>
                      <p className="mt-3 text-sm font-semibold text-slate-800">
                        {mdFile ? mdFile.name : "Upload .md file"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">Only markdown files are supported</p>
                    </div>
                  </label>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      {mdFile ? "File selected. Parse to preview package details." : "Choose a file, then parse it."}
                    </p>
                    <button
                      type="button"
                      onClick={handleParseMDFile}
                      className="rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:bg-violet-300"
                      disabled={isMdParsing || !mdFile}
                    >
                      {isMdParsing ? "Parsing..." : "Parse File"}
                    </button>
                  </div>

                  {mdParsedPackage ? (
                    <div className="rounded-xl border border-slate-200 p-4">
                      <h4 className="text-base font-semibold text-slate-900">Parsed Package Details</h4>
                      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Package Name</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{mdParsedPackage.packageName}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Destination</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{mdParsedPackage.destination || "-"}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Days</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{mdParsedPackage.days}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Nights</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">{mdParsedPackage.nights}</p>
                        </div>
                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="text-xs text-slate-500">Price</p>
                          <p className="mt-1 text-sm font-semibold text-slate-800">
                            ₹{Number(mdParsedPackage.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      <div
                        data-lenis-prevent
                        className="mt-4 max-h-64 space-y-2 overflow-y-auto rounded-lg border border-slate-200 p-3"
                      >
                        {mdParsedPackage.itinerary.map((day) => (
                          <div key={`md-day-${day.day}`} className="rounded-md border border-slate-100 bg-slate-50 p-2.5">
                            <p className="text-xs font-semibold text-violet-700">Day {day.day}</p>
                            <p className="text-sm font-semibold text-slate-900">{day.title}</p>
                            <ul className="mt-1 space-y-1 text-xs text-slate-600">
                              {day.activities.slice(0, 4).map((activity, idx) => (
                                <li key={`md-act-${day.day}-${idx}`}>- {activity.title}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 flex justify-end">
                        <button
                          type="button"
                          onClick={handleConfirmMDPackage}
                          disabled={isMdSaving}
                          className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                        >
                          {isMdSaving ? "Saving..." : "Confirm Package"}
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
            </div>
          </div>
        </div>
      ) : null}

      {isAIModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-[1.5px]">
          <div className="flex max-h-[95vh] w-full max-w-[1240px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex shrink-0 items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <h3 className="flex items-center gap-2 text-[34px] font-semibold leading-tight text-slate-900">
                  Build with AI
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Let AI create a custom itinerary for your travel package
                </p>
              </div>
              <button
                type="button"
                onClick={closeAIModal}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 gap-5 overflow-hidden p-5 lg:grid-cols-[1.02fr_1.58fr]">
              <div className="min-h-0 overflow-y-auto rounded-xl border border-slate-200 p-5">
                <h4 className="text-2xl font-semibold text-slate-900">Package Details</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Fill in the basic details to let AI generate your itinerary
                </p>

                <div className="mt-5 space-y-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Package Name</label>
                    <input
                      value={aiForm.packageName}
                      onChange={(e) => handleAiFieldChange("packageName", e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-4 py-2.5 text-sm outline-none ring-violet-100 transition focus:border-violet-400 focus:ring-4"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">State</label>
                      <select
                        value={selectedAiState}
                        onChange={(e) => {
                          const nextState = e.target.value;
                          const fallbackCity = [...new Set(
                            hotelLocations
                              .filter((hotel) => hotel.state === nextState)
                              .map((hotel) => hotel.city)
                              .filter(Boolean)
                          )].sort((a, b) => a.localeCompare(b))[0] || "";
                          setAiForm((prev) => ({ ...prev, state: nextState, city: fallbackCity }));
                        }}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-violet-100 transition focus:border-violet-400 focus:ring-4"
                      >
                        <option value="">Select State</option>
                        {aiStates.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-slate-700">City</label>
                      <select
                        value={selectedAiCity}
                        onChange={(e) => handleAiFieldChange("city", e.target.value)}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-violet-100 transition focus:border-violet-400 focus:ring-4"
                      >
                        <option value="">Select City</option>
                        {aiCityOptions.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-slate-700">Days & Nights</label>
                    <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
                      <select
                        value={aiForm.nights}
                        onChange={(e) => handleAiFieldChange("nights", Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-violet-100 transition focus:border-violet-400 focus:ring-4"
                      >
                        {Array.from({ length: 14 }, (_, idx) => idx + 1).map((nightCount) => (
                          <option key={nightCount} value={nightCount}>
                            {nightCount} Night{nightCount > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                      <ArrowRight className="mx-auto text-slate-400" size={16} />
                      <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-semibold text-slate-700">
                        {aiDaysCount} Day{aiDaysCount > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-violet-100 bg-violet-50 px-4 py-3 text-sm text-violet-700">
                    <p className="font-semibold">
                      {aiForm.nights} Night{aiForm.nights > 1 ? "s" : ""} selected = {aiDaysCount} Day
                      {aiDaysCount > 1 ? "s" : ""} itinerary
                    </p>
                    <p className="mt-0.5 text-xs text-violet-600">
                      You can customize this itinerary after generation.
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={resetField}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    <RotateCcw size={14} />
                    Reset
                  </button>
                  <button
                    type="button"
                    className="rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                  >
                    Generate itinerary
                  </button>
                </div>
              </div>

              <div className="flex min-h-0 flex-col rounded-xl border border-slate-200 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h4 className="text-2xl font-semibold text-slate-900">AI Generated Itinerary</h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Review, edit or remove days and activities
                    </p>
                  </div>
                  <div className="rounded-md border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {aiDaysCount} Days / {aiForm.nights} Nights
                  </div>
                </div>

                <div
                  data-lenis-prevent
                  className="max-h-[300px] space-y-4 overflow-y-auto overscroll-contain pr-1"
                >
                  {aiDays.map((day) => (
                    <div key={day.id} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center gap-3 pb-3">
                        <span className="inline-flex min-w-[68px] items-center justify-center rounded-full bg-violet-600 px-2 py-1 text-[11px] font-semibold uppercase text-white">
                          Day {day.id}
                        </span>
                        <h5 className="text-base font-semibold text-slate-900">{day.title}</h5>
                      </div>

                      <div className="space-y-2">
                        {day.activities.map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start justify-between gap-3 rounded-lg border border-slate-100 px-3 py-2"
                          >
                            <div className="flex items-start gap-2.5">
                              <activity.icon size={15} className="mt-0.5 text-violet-500" />
                              <div>
                                <p className="text-sm font-medium text-slate-800">{activity.title}</p>
                                <p className="text-xs text-slate-500">{activity.subtitle}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleEditActivityOpen(day.id, activity)}
                                className="rounded-md border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-50"
                              >
                                <Pencil size={13} />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteActivity(day.id, activity.id)}
                                className="rounded-md border border-rose-100 p-1.5 text-rose-500 transition hover:bg-rose-50"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-xs text-slate-500 text-center">
                  AI suggestions are based on master data for {aiForm.city}, {aiForm.state}. You can
                  review and customize before publishing.
                </p>
                <div className="w-full flex justify-center text-center">

                  <button
                    type="button"
                    className="mt-4 flex w-fit items-center justify-center gap-1.5 rounded-lg bg-green-500  px-3 py-2 text-sm font-medium text-white transition hover:bg-green-600"
                  >
                    Save
                    <Save size={14} />
                  </button>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : null}

      {isEditActivityModalOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <h4 className="text-xl font-semibold text-slate-900">Edit Activity</h4>
                <p className="mt-1 text-sm text-slate-500">
                  Update the selected itinerary activity details.
                </p>
              </div>
              <button
                type="button"
                onClick={handleEditActivityClose}
                className="rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4 px-5 py-5">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Activity Title</label>
                <input
                  type="text"
                  value={editingActivity.title}
                  onChange={(e) => handleEditActivityFieldChange("title", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none ring-violet-100 transition focus:border-violet-400 focus:ring-4"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Activity Subtitle</label>
                <textarea
                  rows={3}
                  value={editingActivity.subtitle}
                  onChange={(e) => handleEditActivityFieldChange("subtitle", e.target.value)}
                  className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm outline-none ring-violet-100 transition focus:border-violet-400 focus:ring-4"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-5 py-4">
              <button
                type="button"
                onClick={handleEditActivityClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveEditedActivity}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CreateNewPackage;
