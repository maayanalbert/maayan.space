export interface Project {
  id: string
  title: string
  media: Media[]
  description: string
  collaborators: Collaborator[]
  stack: string[]
  category: {
    name: string
    color: string
  }
}

export type Media =
  | {
      type: "image"
      src: string
      alt?: string
      width?: number
      height?: number
    }
  | {
      type: "video"
      src: string
      alt?: string
      width?: number
      height?: number
    }
  | { type: "iframe"; src: string; width?: number; height?: number }

export interface Collaborator {
  name: string
  image: string
  link: string
}

export const projects: Project[] = [
  {
    id: "project-1",
    title: "InstaFrames",
    media: [
      {
        type: "iframe",
        src: "https://getdaemon.com",
      },
      {
        type: "video",
        src: "/assets/Daemon demo.mov",
        alt: "InstaFrames demo",
      },
      // {
      //   type: "image",
      //   src: "/assets/sample-image.png",
      //   alt: "InstaFrames interface",
      // },
    ],
    description:
      "Soon, manually creating static interfaces will be a thing of the past. InstaFrames was an experiment into what a design workflow would look like where the AIs create live prototypes, and the designer simply refines the variants into a final, shippable design.",
    stack: ["React", "TypeScript", "TailwindCSS", "OpenAI API"],
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
    category: {
      name: "Design Tools",
      color: "text-[rgb(255,70,100)]",
    },
  },
  {
    id: "project-2",
    title: "Mindful",
    media: [
      {
        type: "image",
        src: "/assets/sample-image.png",
        alt: "Mindful app screenshot",
      },
      {
        type: "video",
        src: "/videos/mindful-demo.mp4",
        alt: "Mindful app demo",
      },
      {
        type: "iframe",
        src: "https://www.youtube.com/embed/example",
        width: 600,
        height: 400,
      },
    ],
    description:
      "An experimental mobile app that helps users build mindfulness habits through micro-interactions throughout the day. The design focuses on subtle notifications and quick exercises that can be completed in under a minute.",
    stack: ["React Native", "Redux", "Firebase"],
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
