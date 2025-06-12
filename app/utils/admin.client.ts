import { User } from "firebase/auth";

// List of authorized admin emails - matches the one in ProtectedRoute.client.tsx
const AUTHORIZED_ADMINS = [
  "omrinuri@gmail.com",
  "micelio@revolucionfungi.com",
];

/**
 * Check if a user is an admin based on their email
 */
export const isUserAdmin = (user: User | null): boolean => {
  if (!user || !user.email) {
    return false;
  }
  
  return AUTHORIZED_ADMINS.includes(user.email);
};

/**
 * Get admin status from current user
 * @param user - Firebase User object or null
 * @returns boolean indicating if user is admin
 */
export const checkAdminStatus = (user: User | null): boolean => {
  return isUserAdmin(user);
};