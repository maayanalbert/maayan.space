export interface Project {
  id: string
  title: string
  image: string
  description: string
  collaborators: Collaborator[]
  link?: string
  category: {
    name: string
    color: string
  }
}

export interface Collaborator {
  name: string
  image: string
  link: string
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "InstaFrames",
    image: "/images/sample-image.png",
    description:
      "Soon, manually creating static interfaces will be a thing of the past. InstaFrames was an experiment into what a design workflow would look like where the AIs create live prototypes, and the designer simply refines the variants into a final, shippable design.",
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
    category: {
      name: "Design Tools",
      color: "text-[rgb(255,70,100)]",
    },
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
    category: {
      name: "Productivity",
      color: "text-green-500",
    },
  },
]
