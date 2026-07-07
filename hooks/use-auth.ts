'use client';

import { useAuthContext } from "@/components/providers/auth-provider";

/**
 * Primary auth hook — exposes the full authentication context.
 * Use this in any client component that needs auth state or actions.
 */
export const useAuth = () => {
  const {
    user,
    token,
    isLoading,
    isAuthenticated,
    isModalOpen,
    modalMode,
    isProfileModalOpen,
    login,
    register,
    logout,
    openLoginModal,
    openSignupModal,
    closeAuthModal,
    openProfileModal,
    closeProfileModal,
    updateProfile,
    changePassword,
  } = useAuthContext();

  return {
    user,
    token,
    isLoading,
    isAuthenticated,
    isModalOpen,
    modalMode,
    isProfileModalOpen,
    login,
    register,
    logout,
    openLoginModal,
    openSignupModal,
    closeAuthModal,
    openProfileModal,
    closeProfileModal,
    updateProfile,
    changePassword,
  };
};

/**
 * Convenience hook for components that only need user info.
 * Returns a normalized user object with common fields.
 */
export const useUser = () => {
  const { user, isLoading, isAuthenticated } = useAuthContext();

  return {
    isSignedIn: isAuthenticated,
    isLoaded: !isLoading,
    user: user ? {
      id: user.id,
      fullName: user.name || user.email.split('@')[0],
      primaryEmailAddress: { emailAddress: user.email },
      imageUrl: user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || user.email)}`,
    } : null,
  };
};
