export const API_BASE = "/api";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        // Try to extract error message from server
        try {
            const errorBody = await response.json();
            const message = errorBody?.message || JSON.stringify(errorBody);
            throw new Error(message || `Failed to create property: ${response.status}`);
        } catch (_) {
            const text = await response.text();
            throw new Error(text || `Failed to create property: ${response.status}`);
        }
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!response.ok) {
        throw new Error(`Failed to update property: ${response.status}`);
    }
    return response.json();
}

export async function deleteProperty(id) {
    const response = await fetch(`${API_BASE}/property/${id}`, {
        method: "DELETE",
    });
    if (!response.ok) {
        throw new Error(`Failed to delete property: ${response.status}`);
    }
    return response.json();
}
