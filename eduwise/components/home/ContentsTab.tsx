import React, { useState } from "react"
import { course, documents } from "@/lib/courses"
import { Button } from "../ui/button"
import { ScanFaceIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useS3Upload } from "next-s3-upload"
import { toast } from "../ui/use-toast"
import { Icons } from "../icons"
import { useCourseContext } from "../context/CourseContext"

const ContentsTab = (props: { course: course }) => {
    const contents: documents[] = props.course.documents
    const [processingStates, setProcessingStates] = useState<{ [key: string]: boolean }>({})
    const { data: session } = useSession({
        required: true
    })
    const { uploadToS3 } = useS3Upload()
    const { editDocumentInCourse } = useCourseContext()

    // Process document consist to dowload it from moodle and upload to S3 for langstream processing
    const handleProcessButton = async (e: { preventDefault: () => void }, fileUrl: string, documentId: string, filename: string) => {
        e.preventDefault()
        const userId = session.user.id
        const body = {
            userId,
            fileUrl
        }
        try {
            setProcessingStates(prevStates => ({ ...prevStates, [documentId]: true }))
            const response = await fetch('/api/moodle/download', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.blob()
            console.log(JSON.stringify(result))
            //Save to aws
            const { url } = await uploadToS3(blobToFile(result, filename), {
                endpoint: {
                    request: {
                        url: "/api/s3-upload",
                        body: {
                            filename: filename,
                            courseId: props.course.id
                        }
                    }
                }
            })
            const res = await fetch(`/api/document/${documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url
                }),
            })
            if (res.status == 200) {
                editDocumentInCourse(props.course.id, documentId, {
                    aws_url: url,
                    store_in_aws: true
                } as documents)
                toast({
                    title: "Document processing succeffully",
                })
            } else {
                throw new Error("Error during update document url..")
            }
        } catch (error) {
            console.error('Error fetching data:', error)
            toast({
                variant: "destructive",
                title: "Failled to process document",
                description: "Please contact admin for more info.."
            })
        } finally {
            setProcessingStates(prevStates => ({ ...prevStates, [documentId]: false }))
        }
    }

    const blobToFile = (blob: Blob, fileName: string): File => {
        const file = new File([blob], fileName, { type: blob.type });

        return file;
    }

    return (
        <div className="rounded-md overflow-y-auto p-4">
            {contents.length === 0 ? (
                <p>No content for this selected course.</p>
            ) : (
                <div className="flex flex-col">
                    {contents.map((pdf, index) => (
                        <div key={index} className="flex items-center justify-between mb-2 p-2 border-b hover:cursor-pointer">
                            <div className="w-11/12">
                                <p className="font-bold">{pdf.name}</p>
                                <textarea className="resize-none text-sm text-gray-500 w-full bg-white" defaultValue={pdf.filename} disabled />
                            </div>
                            {pdf.aws_url ? (
                                <ScanFaceIcon size={24} color="green" />
                            ) : (
                                <>
                                    <Button
                                        variant="ghost"
                                        className="border"
                                        onClick={(e) => handleProcessButton(e, pdf.url, pdf.id, pdf.filename)}
                                        disabled={processingStates[pdf.id]}
                                    >
                                        {processingStates[pdf.id] ? <Icons.spinner /> : 'Process'}

                                    </Button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default ContentsTab