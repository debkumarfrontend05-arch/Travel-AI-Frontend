const API_URL = "http://localhost:3000/api";

// Helper to handle response and surface real error messages from the backend
const handleResponse = async (response, fallbackMessage) => {
  if (!response.ok) {
    let errorMessage = fallbackMessage;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || fallbackMessage;
    } catch {
      // If response is not JSON, use fallback
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

// ──────────── Hotels ────────────
export const fetchHotels = async () => {
  const response = await fetch(`${API_URL}/master-data/hotel`);
  return handleResponse(response, "Failed to fetch hotels");
};

export const addHotel = async (hotel) => {
  const response = await fetch(`${API_URL}/master-data/hotel`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel),
  });
  return handleResponse(response, "Failed to add hotel");
};

export const updateHotel = async (id, hotel) => {
  const response = await fetch(`${API_URL}/master-data/hotel/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel),
  });
  return handleResponse(response, "Failed to update hotel");
};

export const deleteHotel = async (id) => {
  const response = await fetch(`${API_URL}/master-data/hotel/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete hotel");
};

// ──────────── Transfers ────────────
export const fetchTransfers = async () => {
  const response = await fetch(`${API_URL}/master-data/transfer`);
  return handleResponse(response, "Failed to fetch transfers");
};

export const addTransfer = async (transfer) => {
  const response = await fetch(`${API_URL}/master-data/transfer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transfer),
  });
  return handleResponse(response, "Failed to add transfer");
};

export const updateTransfer = async (id, transfer) => {
  const response = await fetch(`${API_URL}/master-data/transfer/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transfer),
  });
  return handleResponse(response, "Failed to update transfer");
};

export const deleteTransfer = async (id) => {
  const response = await fetch(`${API_URL}/master-data/transfer/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete transfer");
};

// ──────────── Sightseeing ────────────
export const fetchSightseeing = async () => {
  const response = await fetch(`${API_URL}/master-data/sightseeing`);
  return handleResponse(response, "Failed to fetch sightseeing");
};

export const addSightseeing = async (activity) => {
  const response = await fetch(`${API_URL}/master-data/sightseeing`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  });
  return handleResponse(response, "Failed to add sightseeing");
};

export const updateSightseeing = async (id, activity) => {
  const response = await fetch(`${API_URL}/master-data/sightseeing/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(activity),
  });
  return handleResponse(response, "Failed to update sightseeing");
};

export const deleteSightseeing = async (id) => {
  const response = await fetch(`${API_URL}/master-data/sightseeing/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete sightseeing");
};

// ──────────── Meals ────────────
export const fetchMeals = async () => {
  const response = await fetch(`${API_URL}/master-data/meal`);
  return handleResponse(response, "Failed to fetch meals");
};

export const addMeal = async (meal) => {
  const response = await fetch(`${API_URL}/master-data/meal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  return handleResponse(response, "Failed to add meal");
};

export const updateMeal = async (id, meal) => {
  const response = await fetch(`${API_URL}/master-data/meal/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  return handleResponse(response, "Failed to update meal");
};

export const deleteMeal = async (id) => {
  const response = await fetch(`${API_URL}/master-data/meal/${id}`, {
    method: "DELETE",
  });
  return handleResponse(response, "Failed to delete meal");
};

export default API_URL;
