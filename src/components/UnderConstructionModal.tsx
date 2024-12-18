import React from "react"
import { WrenchScrewdriverIcon, XMarkIcon } from "@heroicons/react/24/outline"

interface UnderConstructionModalProps {
  open: boolean
  onClose: () => void
}

const UnderConstructionModal: React.FC<UnderConstructionModalProps> = ({
  open,
  onClose,
}) => {
  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md transform transition-all duration-300 opacity-0 animate-fade-in">
          <div className="p-6 text-center">
            <WrenchScrewdriverIcon className="h-10 w-10 mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold mb-2">
              Page Under Construction
            </h2>
            <p className="text-gray-600">
              This section is currently under construction. Please check back
              later or contact Maayan at maayan.albert@gmail.com for more
              information.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default UnderConstructionModal
