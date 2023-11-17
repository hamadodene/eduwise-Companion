import { APIRoute } from "next-s3-upload"

export default APIRoute.configure({
  async key(req, filename) {
    let courseId = req.body.courseId
    return `${courseId}_${filename}`
  }
})