import { ReactNode } from "react"
import {  Menu } from "lucide-react"
import { Nav } from "@/components/nav"
import { ProfilePicture } from "@/components/profile-picture"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toogle"

export const AppLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen">
      <Header />
      <div className="md:grid md:grid-cols-[200px_1fr] h-[calc(100vh-81px)] w-full">
        <aside className="h-full border-r md:block hidden">
          <div className="flex flex-col items-center gap-4 mt-8">
            <Nav />
          </div>
        </aside>
        <div className="h-full w-full">
          <section className="h-full w-full mt-8">{children}</section>
        </div>
        <footer className="md:hidden h-12 w-12 rounded-full bg-slate-200/50 dark:bg-slate-800/50 dark:text-white shadow-lg backdrop-blur-lg fixed flex items-center  bottom-2 right-2 justify-end">
          <Sheet>
            <SheetTrigger className="w-full flex h-full justify-center items-center">
              <Menu />
            </SheetTrigger>
            <SheetContent className="flex h-full justify-end flex-col">
              <Nav />
            </SheetContent>
          </Sheet>
        </footer>
      </div>
    </div>
  )
}

const Header = () => {
  return (
    <div className="h-[80px] border-b flex justify-between items-center px-4">
      <div>
        <ProfilePicture />
      </div>
      <div>
        <ModeToggle />
      </div>
    </div>
  )
}