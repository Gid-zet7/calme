import { getKindeServerSession as sdkGetKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';

export async function getKindeServerSession() {
  return sdkGetKindeServerSession();
}

export async function getKindeUser() {
  const { getUser } = await getKindeServerSession();
  return getUser();
}

export async function isAuthenticated() {
  const { isAuthenticated } = await getKindeServerSession();
  return isAuthenticated();
}

export async function requireAuth() {
  const { isAuthenticated, getUser } = await getKindeServerSession();
  const authed = await isAuthenticated();
  if (!authed) {
    throw new Error('Authentication required');
  }
  return getUser();
}
