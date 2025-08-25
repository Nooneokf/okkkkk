// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from 'next-auth';
import type { DefaultSession, User } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import DiscordProvider from 'next-auth/providers/discord';
import { fetchFromServiceAPI } from '@/lib/api';

// --------------------
// 1️⃣ Custom Profile Type for Discord
// --------------------
interface DiscordProfile {
    id: string;
    username: string;
    discriminator: string;
    avatar: string | null;
    email: string;
    verified: boolean;
    premium_type?: number;
}

// --------------------
// 2️⃣ Module Augmentation for NextAuth Types
// --------------------
declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            plan: 'free' | 'pro';
            hasProCode?: boolean;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
        plan: 'free' | 'pro';
        hasProCode?: boolean;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        plan: 'free' | 'pro';
        hasProCode?: boolean;
    }
}

// --------------------
// 3️⃣ Helper: Process User Data (Local Only)
// --------------------
function processUserData(profile: DiscordProfile) {
    // Store user data locally in session - no external API calls needed
    console.log(`User ${profile.username} (${profile.id}) authenticated successfully`);
    return {
        id: profile.id,
        email: profile.email,
        name: profile.username,
        plan: 'free', // Discord users start with free plan
        hasProCode: false,
    };
}

// --------------------
// 4️⃣ Auth Options with Discord Provider
// --------------------
export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    cookies: {
        pkceCodeVerifier: {
            name: "next-auth.pkce.code_verifier",
            options: {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                secure: true,
            }
        },
        state: {
            name: "next-auth.state",
            options: {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                secure: true,
                maxAge: 900, // 15 minutes
            }
        },
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                secure: true,
            }
        },
        callbackUrl: {
            name: "next-auth.callback-url",
            options: {
                httpOnly: true,
                sameSite: "none", 
                path: "/",
                secure: true,
            }
        },
        csrfToken: {
            name: "next-auth.csrf-token",
            options: {
                httpOnly: true,
                sameSite: "none",
                path: "/",
                secure: true,
            }
        },
    },
    pages: {
        error: '/api/auth/signin', // Redirect to sign-in page on errors
    },
    providers: [
        DiscordProvider({
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            authorization: {
                params: {
                    scope: 'identify email',
                },
            },
            checks: ["state"],
            profile(profile: DiscordProfile): User {
                const avatarUrl = profile.avatar
                    ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
                    : `https://cdn.discordapp.com/embed/avatars/${parseInt(profile.discriminator) % 5}.png`;

                return {
                    id: profile.id,
                    name: profile.username,
                    email: profile.email,
                    image: avatarUrl,
                    plan: 'free', // Discord users start with free plan
                    hasProCode: false,
                };
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("SignIn callback triggered", { provider: account?.provider });
            if (account?.provider === 'discord' && profile) {
                try {
                    processUserData(profile as DiscordProfile);
                    return true;
                } catch (error) {
                    console.error("Sign-in processing error:", error);
                    return false;
                }
            }
            return true;
        },

        async jwt({ token, user, trigger, session }) {
            if (user) {
                token.id = user.id;
                token.plan = user.plan;
                token.hasProCode = user.hasProCode;
            }
            
            // Check if we need to update the plan based on session update
            if (trigger === 'update' && session) {
                token.plan = session.plan || token.plan;
                token.hasProCode = session.hasProCode ?? token.hasProCode;
            }
            
            return token;
        },

        async session({ session, token, trigger, newSession }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.plan = token.plan;
                session.user.hasProCode = token.hasProCode;
                
                // Check if we need to update plan based on client-side trigger
                if (trigger === 'update' && newSession) {
                    session.user.plan = newSession.plan || session.user.plan;
                    session.user.hasProCode = newSession.hasProCode ?? session.user.hasProCode;
                }
            }
            return session;
        },
    },
};

// --------------------
// 5️⃣ Export Handler
// --------------------
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };