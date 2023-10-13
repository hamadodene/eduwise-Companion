import prisma from "@/lib/prismadb"
import MoodleApi from "./moodleApi";

let client: MoodleApi | null = null;

export async function initializeclient(userId: string) {
  const moodleCredential = await prisma.moodleCredential.findFirst({
    where: {
      userId: userId
    }
  })

  if (!moodleCredential) {
    console.log("Moodle credentials not found")
    throw new Error('Moodle credentials not found');
  }

  if (moodleCredential.token) {
    client = new MoodleApi({
      url: moodleCredential.url,
      token: moodleCredential.token
    });
  } else if (moodleCredential.username && moodleCredential.password) {
    // We can try to authenticate client
    client = new MoodleApi({
      url: moodleCredential.url,
      username: moodleCredential.username,
      password: moodleCredential.password
    });

  } else {
    throw new Error("No credential provide for moodle..Please configure first moodle integration");
  }
}

export default client
