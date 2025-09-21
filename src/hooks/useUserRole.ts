'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useEffect, useState } from 'react';

export function useUserRole() {
  const { user, isLoading } = useKindeBrowserClient();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Determine user role based on user data
      const isAdmin = user.org_codes?.includes('admin') || 
                      user.given_name?.toLowerCase().includes('admin') ||
                      user.email?.includes('admin@calme.com');

      const isPsychologist = user.org_codes?.includes('psychologist') ||
                            user.given_name?.toLowerCase().includes('dr.') ||
                            user.email?.includes('psychologist@calme.com');

      if (isAdmin) {
        setRole('ADMIN');
      } else if (isPsychologist) {
        setRole('PSYCHOLOGIST');
      } else {
        setRole('USER');
      }
    } else {
      setRole(null);
    }
  }, [user]);

  return {
    role,
    isLoading,
    user
  };
}