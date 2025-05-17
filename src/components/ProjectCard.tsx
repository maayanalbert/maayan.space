import Image from "next/image"
import Link from "next/link"
import { Collaborator, Project } from "../data/projects"

export interface ProjectCardProps extends Project {}

export const ProjectCard = ({
  project: { title, image, description, collaborators, link, category },
}: {
  project: Project
}) => {
  return (
    <div className="flex flex-col last:mb-0">
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
        {collaborators.length > 0 && (
          <div className="text-black mt-8  flex items-center">
            <div className="flex items-center gap-6">
              {collaborators.map((collaborator, index) => (
                <Link
                  href={collaborator.link}
                  key={index}
                  className="flex items-center hover:underline  transition-all duration-300"
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
          </div>
        )}
      </div>
      <div className="flex flex-row gap-8 mt-12 overflow-x-auto pb-4 w-full hide-scrollbar">
        <div className="w-20 bg-black h-[400px] flex-shrink-0 bg-white"></div>
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className=" object-cover "
        />
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className=" object-cover"
        />
        <Image
          src={image}
          alt={title}
          width={600}
          height={400}
          className=" object-cover"
        />
        <div className="w-20 bg-black h-[400px] flex-shrink-0 bg-white"></div>
      </div>
    </div>
  )
}
