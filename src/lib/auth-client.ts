import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
    "https://bazar-dor-mu-two.vercel.app",
});

export type Session = typeof authClient.$Infer.Session;