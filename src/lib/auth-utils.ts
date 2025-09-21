import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function getUserRole() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    return null;
  }

  // Check if user has admin role in Kinde
  const isAdmin = user.org_codes?.includes('admin') || 
                  user.given_name?.toLowerCase().includes('admin') ||
                  user.email?.includes('admin@calme.com');

  // Check if user is a psychologist
  const isPsychologist = user.org_codes?.includes('psychologist') ||
                        user.given_name?.toLowerCase().includes('dr.') ||
                        user.email?.includes('psychologist@calme.com');

  if (isAdmin) {
    return 'admin';
  } else if (isPsychologist) {
    return 'psychologist';
  } else {
    return 'user';
  }
}

export async function requireAuth() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

export async function requireRole(requiredRole: 'admin' | 'psychologist' | 'user') {
  const user = await requireAuth();
  const userRole = await getUserRole();
  
  if (!userRole) {
    throw new Error('User role not found');
  }
  
  // Admin can access everything
  if (userRole === 'admin') {
    return user;
  }
  
  // Psychologist can access psychologist and user areas
  if (userRole === 'psychologist' && (requiredRole === 'psychologist' || requiredRole === 'user')) {
    return user;
  }
  
  // User can only access user areas
  if (userRole === 'user' && requiredRole === 'user') {
    return user;
  }
  
  throw new Error(`Access denied. Required role: ${requiredRole}, User role: ${userRole}`);
}
