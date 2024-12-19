import React from "react"
import { WrenchScrewdriverIcon, XMarkIcon } from "@heroicons/react/24/outline"

const UnderConstructionBanner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div className="-mt-20 absolute w-[200%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] sm:scale-[1.5]">
        <div className="text-center">
          <h2 className="sm:text-9xl text-7xl font-black text-gray-300 sm:-ml-[650px] -ml-[100px]">
            UNDER
          </h2>
          <h2 className="sm:text-9xl text-6xl font-black text-gray-300 ml-[0px]">
            CONSTRUCTION
          </h2>
          <p className="text-xl text-gray-300 sm:ml-[150px] -ml-[50px]">
            Please check back later or contact Maayan
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnderConstructionBanner
