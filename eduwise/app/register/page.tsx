'use client'

import axios from 'axios'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { UserRegistrationForm } from '@/components/user-registration-form'
import Link from 'next/link'
import { Command } from "lucide-react"
import { useSession } from 'next-auth/react'

interface InitialStateProps {
    name:string,
    email:string,
    password:string
}

const initialState:InitialStateProps = {
    name:'',
    email:'',
    password:''
}



export default function page() {

    const router = useRouter()
    const [state, setState] = useState(initialState)

    const { data: session } = useSession()

    
    useEffect(() => {
      if (session && ( new Date() < new Date(session.expires))) {
        // push to home page is there is a valid session
        router.push("/")
      }
  
    }, [session])
  
    const onSubmit = (event: FormEvent) => {
       event.preventDefault()
        
       console.log("state is " + state.email)
       axios.post('/api/register', state)
       .then(() => {
            router.refresh()
       }) .then(() => {
            setTimeout(() => {
                router.push('/login')
            }, 2500);
       }).catch((err:any) => {})
       .finally(() =>{})
    }

    function handleChange(event:any) {
        const { name, value } = event.currentTarget;
        setState({...state, [name]: value})
    }



    return (
        <div className="h-screen">
          <div className="h-full md:container relative flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
            <div className="relative flex-col bg-muted p-10 text-white dark:border-r lg:flex h-60 md:h-full">
              <div
                className="absolute inset-0 bg-cover"
                style={{
                  backgroundImage:
                    "url(https://images.unsplash.com/photo-1590069261209-f8e9b8642343?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1376&q=80)",
                }}
              />
              <div className="relative z-20 flex items-center text-lg font-medium">
                <Command className="mr-2 h-6 w-6" /> Acme Inc
              </div>
              <div className="relative z-20 mt-auto">
                <blockquote className="space-y-2">
                  <p className="text-lg">
                    &ldquo;This library has saved me countless hours of work and
                    helped me deliver stunning designs to my clients faster than
                    ever before. Highly recommended!&rdquo;
                  </p>
                  <footer className="text-sm">Sofia Davis</footer>
                </blockquote>
              </div>
            </div>
            <div className="lg:p-8 mt-8 md:mt-0 px-4">
              <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
              <UserRegistrationForm onSubmit={onSubmit} onChange={handleChange} email={state.email} name={state.name} password={state.password}/>
                <p className="px-8 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href={"/login"} 
                        className="underline underline-offset-4 hover:text-primary"
                    >
                    Sign in   
                    </Link>
                </p>
                <p className="px-8 text-center text-sm text-muted-foreground">
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
                </p>
              </div>
            </div>
          </div>
        </div>
      )
}