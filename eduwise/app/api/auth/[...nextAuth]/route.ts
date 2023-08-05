import bcrypt from 'bcrypt'
import nextAuth, {AuthOptions} from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/app/lib/prismadb'
import NextAuth from 'next-auth/next'

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GitHubProvider({
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
                email: { label: 'email', type: 'text', placeholder: 'example@domain.com'},
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

                return user
            }
        })
    ],
    callbacks: {
        async jwt({ token, user, session, trigger }) {
            //debug
            console.log("jwt callback", {token, user, session})

            if(trigger === "update" && (session?.name || session?.email)) {
               token.name = session.name
               token.email = session.email
            }

            // pass in user id and email
            if(user) {
                return {
                    ...token,
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            }

            // update user in the database
            const newUser = await prisma.user.update({
                where: {
                    id: token.id
                },
                data: {
                    name: token.name,
                    email: token.email
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
                    email: token.email
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

const handler = NextAuth(authOptions)
export { handler as GET , handler as POST}