"use client"

import * as React from "react"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from "./ui/card" 
import { signIn } from 'next-auth/react';


export function UserAuthForm({ ...props }) {
  return (
    <Card>
      <CardHeader className="space-y-1">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Welcome to eduwise</CardTitle>
        <CardDescription>
          Enter your email below to login into your account
        </CardDescription>
      </CardHeader>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline" onClick={() => signIn('github', { callbackUrl: '/' })}>
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline" onClick={() => signIn('google', { callbackUrl: '/' })}>
            <Icons.google className="mr-2 h-4 w-4" />
            Google
          </Button>
        </div>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" name="email" placeholder="my-email@example.com" onChange={props.onChange} defaultValue={props.email} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" placeholder="password" onChange={props.onChange} defaultValue={props.password}/>
          </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={props.onSubmit}>Continue</Button>
      </CardFooter>
    </Card>
  )
}