export interface Project {
  id: string
  title: string
  image: string
  description: string
  collaborators?: Collaborator[]
  link?: string
}

export interface Collaborator {
  name: string
  image: string
  link: string
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "Cursor AI",
    image: "/images/sample-image.png",
    description:
      "A next-generation code editor that uses AI to help developers write better code faster. I designed the interface to make AI collaboration feel natural and integrated with existing developer workflows.",
    collaborators: [
      {
        name: "Amresh Subramaniam",
        image: "/images/amresh-pic.jpeg",
        link: "https://www.linkedin.com/in/amresh-subramaniam/",
      },
      {
        name: "Maayan Albert",
        image: "/images/maayan-pic.jpeg",
        link: "https://x.com/maayanalbert",
      },
    ],
    link: "https://cursor.sh",
  },
  {
    id: "project-2",
    title: "Mindful",
    image: "/images/sample-image.png",
    description:
      "An experimental mobile app that helps users build mindfulness habits through micro-interactions throughout the day. The design focuses on subtle notifications and quick exercises that can be completed in under a minute.",
    collaborators: [
      {
        name: "Sarah Chen",
        image: "/images/collaborators/sarah.png",
        link: "https://example.com/sarah",
      },
    ],
  },
  {
    id: "project-3",
    title: "Spatial Notes",
    image: "/images/sample-image.png",
    description:
      "A note-taking application that uses spatial memory to help users organize and recall information. Notes can be arranged in a 3D space, allowing for more intuitive connections between ideas and concepts.",
    link: "https://spatialnotes.example.com",
  },
]
