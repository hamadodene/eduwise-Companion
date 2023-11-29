'use client'

import Link from "next/link"
import { Command } from "lucide-react"

import { FormEvent, useEffect, useState } from "react";
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { UserAuthForm } from "@/components/user-auth-form";

interface InitialStateProps {
  email: string,
  password: string
}

const initialState: InitialStateProps = {
  email: '',
  password: ''
}

export default function page() {
  const router = useRouter()
  const [state, setState] = useState(initialState)
  const [isLoading, setIsLoading] = useState(false)
  const { data: session } = useSession()


  useEffect(() => {
    if (session && ( new Date() < new Date(session.expires))) {
      // push to home page is there is a valid session
      router.push("/")
    }

  }, [session])


  const onSubmit = (event: FormEvent) => {
    event.preventDefault()
    console.log("email " + state.email + " pass " + state.password)
    setIsLoading(true)
    signIn('credentials', {
      ...state,
      redirect: true,
      callbackUrl: "/"
    }).then((callback) => {
      if (!callback?.ok) {
        router.refresh()
      }
      if (callback?.error) {
        console.log("eeror " + callback.error)
        throw new Error('Invalid email or password')
      }
      setIsLoading(false)
      router.push('/')
    })
  }


  function handleChange(event: any) {
    const { name, value } = event.currentTarget;
    setState({ ...state, [name]: value })
  }

  return (
    <div className="h-screen">
      <div className="h-full md:container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative flex-col bg-muted p-10 text-white dark:border-r lg:flex md:h-full">
          <div
            className="absolute inset-0 bg-cover bg-[#12b886]"
          />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <img src="/logo.png" className="bg-white rounded-full mr-2 h-6 w-6"/>
             Comunity education platform
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                A platform created for community.
              </p>
              <footer className="text-sm">Hamado Dene</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 mt-8 md:mt-0 px-4">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to Comunity Education Platform
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login into your account
              </p>
            </div>
            <UserAuthForm onSubmit={onSubmit} onChange={handleChange} isLoading={isLoading} email={state.email} password={state.password} />
            <p className="px-8 text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link href={"/register"}
                className="underline underline-offset-4 hover:text-primary"
              >
                Sign up
              </Link>
            </p>
            {/*<p className="px-8 text-center text-sm text-muted-foreground">
                By clicking continue, you agree to our{" "}
                <Link
                  href="/terms"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
                .
              </p>*/}
          </div>
        </div>
      </div>
    </div>
  )
}
