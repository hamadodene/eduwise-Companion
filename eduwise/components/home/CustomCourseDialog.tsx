'use client'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "../ui/separator"
import { FormEvent, useState } from "react"
import { useSession } from "next-auth/react"
import { Textarea } from "../ui/textarea"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { createCourses } from "@/lib/courses"
import { toast } from "../ui/use-toast"
import { useCourseContext } from "../context/CourseContext"
import { Icons } from "../icons"

interface CustomCourseDialogProps {
  isOpen: boolean
  toogleDialog: () => void
}

interface InitialStateProps {
  fullname: string,
  shortname: string,
  summary: string
}

const initialState: InitialStateProps = {
  fullname: " ",
  shortname: " ",
  summary: " "
}

const FormSchema = z.object({
  fullname: z.string().min(1, {
    message: "Full name is required",
  }),
  shortname: z.string().min(1, {
    message: "Short name is required",
  }),
  summary: z.string().min(1, {
    message: "summary name is required",
  })
})


const CustomCourseDialog: React.FC<CustomCourseDialogProps> = ({ isOpen, toogleDialog }) => {
  const { data: session } = useSession({
    required: true
  })
  const [state, setState] = useState(initialState)
  const [isSubmit, setIsSubmit] = useState(false)
  const { addCourse, courseList } = useCourseContext()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullname: '',
      summary: '',
      shortname: ''
    }
  })

  function handleChange(event: any) {
    console.log(event.currentTarget.value)
    const { name, value } = event.currentTarget;
    setState({ ...state, [name]: value })
  }

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmit(false)
    try {
      const response = await createCourses(
        state.shortname,
        state.fullname,
        state.summary,
        session.user.id
      )
      
      if (response.id) {
        addCourse(response)
        toast({
          variant: "default",
          title: "Course created"
        })
      } else {
        console.log(JSON.stringify(response))
        toast({
          variant: "destructive",
          title: "Error occured during couse creation"
        })
      }
      toogleDialog()
      setIsSubmit(false)
    } catch (error) {
      console.log(error)
      toast({
        variant: "destructive",
        title: "Error occured during couse creation"
      })
      throw new Error("Error occured during couse creation")

    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={toogleDialog}>
      <DialogContent className="sm:max-w-[680px]">
        <DialogHeader>
          <DialogTitle>Create custom course</DialogTitle>
        </DialogHeader>
        <Separator />
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Fullname
              </Label>
              <Input
                id="fullname"
                name="fullname"
                onChange={handleChange}
                placeholder="course fullname"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Shortname
              </Label>
              <Input
                id="shortname"
                name="shortname"
                onChange={handleChange}
                placeholder="short title"
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Summary
              </Label>
              <Textarea
                name="summary"
                id="summary"
                onChange={handleChange}
                placeholder="A simple course summary"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            {
              isSubmit ? (
                <Button variant="ghost" disabled><Icons.spinner /></Button>
              ) : (
                <Button variant="ghost" className="border border-[#20c997]" type="submit">Create</Button>
              )
            }
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog >
  )
}


export default CustomCourseDialog