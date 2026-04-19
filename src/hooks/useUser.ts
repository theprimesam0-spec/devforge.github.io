import { useUser as useClerkUser, useClerk } from '@clerk/clerk-react';

/**
 * Wrapper around Clerk's useUser hook.
 * Provides a consistent interface used across DevForge components.
 */
export function useUser() {
  const { user, isLoaded, isSignedIn } = useClerkUser();
  return { user, isLoaded, isSignedIn };
}

/**
 * Hook that exposes signOutUser as a callable function.
 * Must be used inside a React component.
 */
export function useSignOut() {
  const { signOut } = useClerk();
  return async () => {
    await signOut();
  };
}

/**
 * Standalone sign-out function for use in event handlers.
 * Must be called from within a React component that renders ClerkProvider.
 */
export { useClerk as clerkInstance };
