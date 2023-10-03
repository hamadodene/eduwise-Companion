import Chat from "@/components/Chat"
import ChatFooer from "@/components/ChatFooter"
import { Layout } from "@/components/layouts/layout"
import NavBar from "@/components/navbar"
import { ScrollArea } from "@/components/ui/scroll-area"

export default async function IndexPage() {
  return (
    <Layout>
      <div className="flex flex-col h-screen">
        <div className="h-10/100">
          <NavBar />
        </div>
          <ScrollArea className="flex-grow">
            <Chat/>
          </ScrollArea>
          <ChatFooer/>
      </div>
    </Layout>
  )
}