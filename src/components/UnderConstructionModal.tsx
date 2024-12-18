import React from "react"
import { WrenchScrewdriverIcon, XMarkIcon } from "@heroicons/react/24/outline"

const UnderConstructionBanner: React.FC = () => {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
      <div className="-mt-20 absolute w-[200%] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-[30deg] scale-[1.5]">
        <div className="text-center">
          <h2 className="text-9xl font-black text-gray-300 -ml-[650px]">
            UNDER
          </h2>
          <h2 className="text-9xl font-black text-gray-300 ml-[200px]">
            CONSTRUCTION
          </h2>
          <p className="text-xl text-gray-300 ml-[150px]">
            Please check back later or contact Maayan
          </p>
        </div>
      </div>
    </div>
  )
}

export default UnderConstructionBanner
