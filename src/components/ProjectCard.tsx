import Image from "next/image"
import Link from "next/link"
import { Collaborator, Project, Media } from "../data/projects"
import { useEffect, useRef, useState } from "react"
import { ExternalLink } from "react-feather"

export interface ProjectCardProps extends Project {}

const MediaComponent = ({ media }: { media: Media }) => {
  const [overlayVisible, setOverlayVisible] = useState(true)
  const iframeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        iframeRef.current &&
        !iframeRef.current.contains(event.target as Node)
      ) {
        setOverlayVisible(true)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleOverlayClick = () => {
    setOverlayVisible(false)
  }

  switch (media.type) {
    case "image":
      return (
        <Image
          src={media.src}
          alt={media.alt || ""}
          width={media.width || 600}
          height={media.height || 400}
          className="object-cover rounded-sm"
        />
      )
    case "video":
      return (
        <video
          src={media.src}
          controls
          width={media.width || 600}
          height={media.height || 400}
          className="object-cover rounded-sm"
        />
      )
    case "iframe":
      return (
        <div className="p-[10px] -mt-[10px] bg-white rounded mx-auto transition-all duration-300 hover:shadow-[0_0_20px_0_rgba(0,0,0,0.4)] shadow-[0_0_20px_0_rgba(0,0,0,0.3)] relative">
          <a
            href={media.src}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute flex gap-2 -bottom-9 right-0 text-gray-500 hover:text-gray-400 transition-colors"
            aria-label="Open in new tab"
          >
            <ExternalLink size={20} />
            <span className="text-sm mt-0.5">Open in new tab</span>
          </a>
          <div
            ref={iframeRef}
            className="h-[400px] w-[600px] min-w-[600px] max-w-[600px] rounded-sm overflow-hidden relative"
          >
            {overlayVisible && (
              <div
                className="absolute inset-0 bg-black/50 flex flex-row items-end justify-end z-10 cursor-pointer"
                onClick={handleOverlayClick}
              >
                <p className="text-white text-lg font-medium p-4">
                  Click to interact
                </p>
              </div>
            )}
            <iframe
              src={media.src}
              width={media.width || 1200}
              height={media.height || 800}
              allowFullScreen
              className="border-0 scale-[0.5] origin-top-left"
            />
          </div>
        </div>
      )
    default:
      return null
  }
}

export const ProjectCard = ({
  project: { title, media, description, collaborators, category, stack },
}: {
  project: Project
}) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-end gap-6 sm:px-28 px-8">
        <h3 className="text-3xl font-bold">{title}</h3>

        <div
          className={`text-base rounded-md font-medium text-white ${category.color}`}
        >
          ({category.name})
        </div>
      </div>

      <div className="font-light mt-4 sm:px-28 px-8">
        <p className=" font-light w-full sm:text-[20px] text-[16px] sm:px-0 px-8 leading-[1.4] sm:w-[900px]">
          {description}
        </p>
        <div className="text-black mt-10 flex flex-row gap-6">
          {collaborators.length > 0 && (
            <div className="flex items-center gap-6">
              {collaborators.map((collaborator, index) => (
                <Link
                  href={collaborator.link}
                  key={index}
                  className="flex items-center hover:underline transition-all duration-300"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    src={collaborator.image}
                    alt={collaborator.name}
                    width={36}
                    height={36}
                    className="rounded-full mr-2"
                  />
                  <span className="">{collaborator.name}</span>
                </Link>
              ))}
            </div>
          )}

          {stack && stack.length > 0 && (
            <div className="flex items-center gap-3">
              {stack.map((tech, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row gap-9 overflow-x-auto pb-12 w-full hide-scrollbar">
        <div className="w-[76px] h-[400px] flex-shrink-0 bg-white"></div>
        {media.map((item, index) => (
          <div key={index} className="flex-shrink-0 mt-14">
            <MediaComponent media={item} />
          </div>
        ))}
        <div className="w-[76px] h-[400px] flex-shrink-0 bg-white"></div>
      </div>
    </div>
  )
}
