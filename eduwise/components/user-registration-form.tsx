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
} from "./ui/card" 

export function UserRegistrationForm({ ...props}) {

  return (
    <Card>
      <CardHeader className="space-y-1">
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-6">
          <Button variant="outline">
            <Icons.gitHub className="mr-2 h-4 w-4" />
            Github
          </Button>
          <Button variant="outline">
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
        <form onSubmit={props.onSubmit} className="text-center">
            <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" type="name" name='name' placeholder="Enter your name and surname...."  onChange={props.onChange} defaultValue={props.name} />
            </div>
            <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" name='email' placeholder="my-email@example.com" onChange={props.onChange} defaultValue={props.email}/>
            </div>
            <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" name='password' placeholder="password" onChange={props.onChange} defaultValue={props.password}/>
            </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" onClick={props.onSubmit}>Continue</Button>
      </CardFooter>
    </Card>
  )
}