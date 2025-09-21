'use client';

import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  User,
  Settings
} from 'lucide-react';

export default function DashboardLink() {
  const { user, isLoading } = useKindeBrowserClient();
  const [userRole, setUserRole] = useState<string | null>(null);

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
        setUserRole('admin');
      } else if (isPsychologist) {
        setUserRole('psychologist');
      } else {
        setUserRole('user');
      }
    }
  }, [user]);

  if (isLoading || !user || !userRole) {
    return null;
  }

  const getDashboardInfo = () => {
    switch (userRole) {
      case 'admin':
        return {
          href: '/admin',
          label: 'Admin Dashboard',
          icon: LayoutDashboard,
          description: 'Manage programs, resources, and users'
        };
      case 'psychologist':
        return {
          href: '/psychologist',
          label: 'Psychologist Portal',
          icon: User,
          description: 'View appointments and manage clients'
        };
      default:
        return {
          href: '/dashboard',
          label: 'My Dashboard',
          icon: Settings,
          description: 'View your appointments and resources'
        };
    }
  };

  const dashboardInfo = getDashboardInfo();
  const Icon = dashboardInfo.icon;

  return (
    <Link href={dashboardInfo.href}>
      <Button variant="outline" className="flex items-center space-x-2">
        <Icon className="h-4 w-4" />
        <span>{dashboardInfo.label}</span>
      </Button>
    </Link>
  );
}
