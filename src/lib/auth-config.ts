import { createKindeServerClient } from '@kinde-oss/kinde-auth-nextjs/server';

export const kindeAuth = createKindeServerClient({
  authDomain: process.env.KINDE_AUTH_DOMAIN!,
  clientId: process.env.KINDE_CLIENT_ID!,
  clientSecret: process.env.KINDE_CLIENT_SECRET!,
  redirectURL: process.env.KINDE_REDIRECT_URL!,
  logoutRedirectURL: process.env.KINDE_LOGOUT_REDIRECT_URL!,
});
