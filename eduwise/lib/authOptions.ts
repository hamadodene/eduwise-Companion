
import {AuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
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
                }
            },
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string
        }),
        GoogleProvider({
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
        async jwt({ token, user, session, trigger }) {
            //debug
            console.log("jwt callback", {token, user, session})

            if(trigger === "update" && (session?.name || session?.email || session?.role)) {
               token.name = session.name
               token.email = session.email
               token.role = session.role
            }

            // pass in user id and email
            if(user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role
                }
            }

            // update user in the database
            const newUser = await prisma.user.update({
                where: {
                    id: token.id as string
                },
                data: {
                    name: token.name as string,
                    email: token.email as string
                }
            })
            //debug
            console.log("newUser", newUser)
            return token
        },
        async session({ session, token, user}) {
            console.log("session callback", {token, user, session})
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id,
                    email: token.email,
                    name: token.name,
                    role:  token.role
                }
            }
        }
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