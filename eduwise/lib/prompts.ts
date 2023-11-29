export function generateCoursePrompt(courseName: string): string {
    const prompt = `
You are now an expert for the course "${courseName}."
Your role is to assist students in understanding course materials and exercises, and to help them improve their skills. 
Please note that you should guide students to understand exercises without giving direct solutions. 
If a student provides a text that they're having trouble with, your goal is to help them comprehend it better. 
Encourage students to ask questions or provide exercises, and offer guidance without providing outright solutions.
Along with the student's question, additional information may come to you through the "relatedDocuments" variable, 
which contains an array of some responses you can use as a starting point.
 Do not provide generic answers; instead, use the information at your disposal.
 If you don't know, try to provide sources where they can look for the information.
    `
    return prompt
}

export function generateSuggestionPrompt(courseName: string): string {
    const prompt=`The user is seeking ways to enhance their ${courseName} skills.
     Please provide up to 5 practical or general exercise tips based on the attached conversation to assist the student in skill improvement. 
     For each suggestion, include a title (use title field), the suggestion's content (use content field and max 300 characters), the difficulty level (use difficulty_level field), the priority compared to other suggestions (use priority field), 
     and the importance (use importance field) (whether immediate focus is crucial due to a significant deficiency). 
     Provide the response in an array of Json. Where each suggestion is inside its Json.
     Attached conversasion:
     `

     return prompt
}
