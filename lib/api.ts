// API client for making requests to the backend

// Get token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set token
export function setAuthToken(token: string) {
  localStorage.setItem('auth_token', token);
}

// Clear token
export function clearAuthToken() {
  localStorage.removeItem('auth_token');
}

// Generic fetch function with token
async function fetchWithToken(endpoint: string, options: RequestInit = {}) {
  try {
    const headers = new Headers(options.headers);
    headers.set("Content-Type", "application/json");

    // Add Authorization header if we have a token
    const token = getAuthToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    // For DELETE requests, return true if successful
    if (options.method === "DELETE") {
      return true;
    }

    // For other requests, parse and return JSON
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
}

// Fetch user data from the API
export async function fetchUserData() {
  return fetchWithToken("/api/v1/auth/me");
}

// Fetch projects from the API
export async function fetchProjects() {
  return fetchWithToken("/api/v1/projects/");
}

// Create a new project
export async function createProject(projectData: any) {
  return fetchWithToken("/api/v1/projects/", {
    method: "POST",
    body: JSON.stringify(projectData),
  });
}

// Update a project
export async function updateProject(projectId: string, projectData: any) {
  return fetchWithToken(`/api/v1/projects/${projectId}/`, {
    method: "PATCH",
    body: JSON.stringify(projectData),
  });
}

// Delete a project
export async function deleteProject(projectId: string) {
  return fetchWithToken(`/api/v1/projects/${projectId}/`, {
    method: "DELETE",
  });
}
