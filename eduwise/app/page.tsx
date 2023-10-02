import Content from "@/components/Content"
import { Layout } from "@/components/layouts/layout"
import NavBar from "@/components/navbar"

export default async function IndexPage() {
  return (
    <Layout>
      {/* Navbar */}
      <div className="h-1/6">
        <NavBar />
      </div>
      <div className="h-5/6 p-4 relative">
        <Content></Content>
      </div>
    </Layout>
  )
}