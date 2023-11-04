import { Layout } from "@/components/layouts/layout"
import HomePage from "@/components/home/HomePage"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/authOptions"

export default async function IndexPage() {
  const session = await getServerSession(authOptions)
  if(!session) {
      redirect("/login")
  }

  return (
    <Layout>
      <HomePage />
    </Layout>
  )
}