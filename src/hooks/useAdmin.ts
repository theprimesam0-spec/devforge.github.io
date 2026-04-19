import { useUser } from '@/hooks/useUser';
import { ADMIN_EMAIL } from '@/config/constants';

export function useAdmin() {
  const { user, isLoaded, isSignedIn } = useUser();

  const adminEmail = user?.primaryEmailAddress?.emailAddress;
  const isAdmin = isLoaded && isSignedIn && adminEmail === ADMIN_EMAIL;

  return { isAdmin, isLoaded, isSignedIn, user };
}
