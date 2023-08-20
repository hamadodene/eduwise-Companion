import client from "@/lib/moodle/client"
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!client) {
      return NextResponse.json({ error: 'MoodleApi not initializzed' }, {status: 500});
    }

    const coursesData = await client.getAllCourses();
    return NextResponse.json(coursesData);
  } catch (error) {
    return NextResponse.json({ error: 'Error during course loading from moodle' }, {status: 500});
  }
}