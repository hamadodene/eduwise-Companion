import prisma from "@/lib/prismadb"
import MoodleApi from "./moodleApi";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";


let client: MoodleApi | null = null;

async function initializeclient() {
  const session = await getServerSession(authOptions);
  const moodleCredential = await prisma.moodleCredential.findFirst({
    where: {
      userId: session.user.id
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
  } else {
    throw new Error("No credential provide for moodle..Please configure first moodle integration");
  }

}

initializeclient().catch(error => {
  console.error('Error initializing Moodle Api:', error);
});

export default client
