'use client'

import Image from "next/image"
import Link from "next/link"

import { FormEvent, useState } from "react";
import { signIn } from 'next-auth/react'
import { useRouter } from "next/navigation";
import { UserAuthForm } from "@/components/user-auth-form";

interface InitialStateProps {
    email:string,
    password:string
}

const initialState:InitialStateProps = {
    email:'',
    password:''
}

export default function page() {
     const router = useRouter()
     const [state, setState] = useState(initialState)

     const onSubmit = (event: FormEvent) => {
        event.preventDefault()
    
        signIn('credentials', {
            ...state,
            redirect:false,
        }).then((callback) => {
            if(!callback?.ok) {
                router.refresh()
            }

            if(callback?.error) {
                console.log("eeror "+ callback.error)
                throw new Error('Invalid email or password')
            }
            router.push('/')
        })
     }


    function handleChange(event:any) {
        const { name, value } = event.currentTarget;
        setState({...state, [name]: value})
    }

   return (
    <>
        <div className="grid h-screen grid-cols-2">
                <div className="flex h-full flex-col justify-center px-6 py-12 lg:px-8 bg-indigo-500">
                    
                </div>  
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                            <div className="flex flex-col space-y-2 text-center">
                                <h1 className="text-2xl font-semibold tracking-tight">
                                    Welcome to Eduwise
                                </h1>
                            </div>
                            <UserAuthForm onSubmit={onSubmit} onChange={handleChange} email={state.email} password={state.password} />
                            <p className="px-8 text-center text-sm text-muted-foreground">
                                Don't have an account?{" "}
                                <Link href={"/register"} 
                                    className="underline underline-offset-4 hover:text-primary"
                                >
                                Sign up   
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
    </>
   )
}
