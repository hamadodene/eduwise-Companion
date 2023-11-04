import  { POST as route } from "next-s3-upload/route"

export const POST = route.configure({
    async key(req, filename) {
        console.log("body " + JSON.stringify(req.body))
        return `${filename}`
    },
})