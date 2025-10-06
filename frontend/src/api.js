export const API_BASE = "/api";

function getAuthHeaders(includeJson) {
    const headers = {};
    try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
        if (raw) {
            const user = JSON.parse(raw);
            if (user && user.token) headers["Authorization"] = `Bearer ${user.token}`;
        }
    } catch (_) { }
    if (includeJson) headers["Content-Type"] = "application/json";
    return headers;
}

async function extractErrorMessage(response) {
    try {
        const data = await response.clone().json();
        const message = data?.message || data?.error;
        if (message) return message;
    } catch (_) { }
    try {
        const text = await response.text();
        if (text) return text;
    } catch (_) { }
    return `HTTP ${response.status}`;
}

// Fetch all properties
export async function getProperties() {
    const response = await fetch(`${API_BASE}/property`);
    if (!response.ok) {
        throw new Error(`Failed to fetch properties: ${response.status}`);
    }
    return response.json();
}

// Create a new property
export async function createProperty(payload) {
    const response = await fetch(`${API_BASE}/property`, {
        method: "POST",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const msg = await extractErrorMessage(response);
        throw new Error(msg || `Failed to create property: ${response.status}`);
    }

    return response.json();
}

export async function getPropertyById(id) {
    const response = await fetch(`${API_BASE}/property/${id}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch property: ${response.status}`);
    }
    return response.json();
}
export async function updateProperty(id, payload) {
    const response = await fetch(`${API_BASE}/property/${id}`, {
        method: "PUT",
        headers: getAuthHeaders(true),
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        const msg = await extractErrorMessage(response);
        throw new Error(msg || `Failed to update property: ${response.status}`);
    }
    return response.json();
}

export async function deleteProperty(id) {
    const response = await fetch(`${API_BASE}/property/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(false),
    });
    if (!response.ok) {
        const msg = await extractErrorMessage(response);
        throw new Error(msg || `Failed to delete property: ${response.status}`);
    }
    return response.json();
}
