import prisma from "@/lib/prismadb"
import MoodleApi from "./moodleApi";


export async function initializeclient(userId: string): Promise<MoodleApi> {
  try {
    const moodleCredential = await prisma.moodleCredential.findUnique({
      where: {
        userId: userId
      }
    })

    if (!moodleCredential) {
      console.log("Moodle credentials not found")
      throw new Error('Moodle credentials not found');
    }

    if (moodleCredential.token) {
      const client: MoodleApi = new MoodleApi({
        url: moodleCredential.url,
        token: moodleCredential.token
      })

      return client
    } else {
      throw new Error("No credential provide for moodle..Please configure first moodle integration")
    }
  } catch (error) {
    console.log(error)
    throw new Error(error)
  }
}

