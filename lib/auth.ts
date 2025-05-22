// Client-side authentication utilities that communicate with the backend
import { setAuthToken, clearAuthToken } from './api';

// Login function - redirects to backend auth endpoint
export function loginWithAzureAD() {
  // Redirect to backend login endpoint
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/login`
}

// Logout function
export function logout() {
  clearAuthToken();
  // Redirect to backend logout endpoint
  window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/logout`
}

// Set token from URL query parameter
export function setTokenFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  if (token) {
    setAuthToken(token);
    // Remove token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
  }
}

// Get user info and check authentication status
export async function getUserInfo() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/me`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    })

    if (response.status === 401) {
      return null;
    }

    if (!response.ok) {
      throw new Error("Failed to get user info")
    }

    return await response.json()
  } catch (error) {
    console.error("Error getting user info:", error)
    return null;
  }
}

// Check if user is authenticated - now just a wrapper around getUserInfo
export async function isAuthenticated(): Promise<boolean> {
  const userInfo = await getUserInfo();
  return userInfo !== null;
}
