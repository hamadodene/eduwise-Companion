# Eduwise
## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# Chat schema
- every message is part of a single room
- the rooms represents the courses. Courses can be created directly on the platform or if configured moodle they are retrieved from moogle and saved on DB (as cache). You can manually refresh the courses. There will be the possibility of automatic timed refresh

## TO DO
- settings
    - integrations moodle (get courses, get cource progress, ect..)
    - integration openai (possibility to use personal token)
    - for every integration "connection check"
- AI pront based on courses
- possibility to create course without moodle
- Revise the room table to better handle fields. For each course it must be possible to upload documents (such as pdf or texts, images, etc.). It must be possible to give a description of the course. And it must be account for the progress for each course.
The courses created on the platform will be managed directly on the platform.
Moodle course data is loaded from moodle via API. The standard info are saved on DB possibly.
