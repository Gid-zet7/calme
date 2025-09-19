import { createKindeServerClient } from '@kinde-oss/kinde-auth-nextjs/server';
import { NextRequest } from 'next/server';

export const kindeClient = createKindeServerClient({
  authDomain: process.env.KINDE_AUTH_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URL!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL!,
});

export async function getKindeServerSession(request?: NextRequest) {
  return kindeClient.getSession(request);
}

export async function getKindeUser(request?: NextRequest) {
  const session = await getKindeServerSession(request);
  return session?.user;
}

export async function isAuthenticated(request?: NextRequest) {
  const session = await getKindeServerSession(request);
  return !!session;
}

export async function requireAuth(request?: NextRequest) {
  const session = await getKindeServerSession(request);
  if (!session) {
    throw new Error('Authentication required');
  }
  return session;
}
