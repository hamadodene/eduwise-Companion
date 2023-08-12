
import {AuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider, { GoogleProfile } from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/lib/prismadb'
import bcrypt from 'bcrypt'
import { GithubProfile } from 'next-auth/providers/github'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
            profile(profile: GithubProfile) {
                return {
                    ...profile,
                    role: profile.role ?? "user",
                    id: profile.id.toString(),
                    image: profile.avatar_url,
                    email: profile.email,
                    name: profile.name
                }
            },
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
            profile(profile: GoogleProfile) {
                return {
                    ...profile,
                    role: profile.role ?? "user",
                    id: profile.sub,
                    image: profile.picture,
                    email: profile.email,
                    name: profile.name
                }
            },
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: 'email', type: 'text'},
                password: { label: 'password', type: 'password'} 
            },
            async authorize(credentials) {
                if(!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if(!user || !user?.hashedPassword) {
                    throw new Error('Invalid credentials');
                }

                const isCorrect = await bcrypt.compare(
                    credentials.password,
                    user.hashedPassword
                )

                if(!isCorrect) {
                    throw new Error('Invalid credentials');
                }
                
                console.log("user is " + user)
                return user
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // pass in user id and email
            if(user) {
                return {
                    ...token
                }
            }
            return token
        },
        async session({ session, token, user}) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            }
        },
    },
    pages: {
        signIn: '/'
    },
    debug: process.env.NODE_ENV === 'development',
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}