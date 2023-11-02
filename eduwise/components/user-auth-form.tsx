"use client"

import * as React from "react"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"


export function UserAuthForm({ ...props }) {
  return (
    <div className="grid gap-6">
      <form onSubmit={props.onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1 space-y-4">
            <div>
              <Label htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                onChange={props.onChange}
                defaultValue={props.email}
                disabled={props.isLoading}
              />
            </div>
            <div>
              <Label htmlFor="password">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                placeholder="password"
                type="password"
                autoCorrect="off"
                onChange={props.onChange}
                defaultValue={props.password}
                disabled={props.isLoading}
              />
            </div>
          </div>
          <Button disabled={props.isLoading}>
            {props.isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Sign In with Email
          </Button>
        </div>
      </form>
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
      <div className="grid grid-cols-2 gap-6">
        <Button
          variant="outline"
          type="button"
          onClick={() => signIn('github', { redirect: true, callbackUrl: '/' })}
          disabled={props.isLoading}>
          {props.isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.gitHub className="mr-2 h-4 w-4" />
          )}{" "}
          Github
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => signIn('google', { callbackUrl: '/' })}
          disabled={props.isLoading}>
          {props.isLoading ? (
            <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Icons.google className="mr-2 h-4 w-4" />
          )}{" "}
          Github
        </Button>
      </div>
    </div >
  )
}