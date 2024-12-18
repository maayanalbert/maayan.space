import React, { useState } from "react"
import UnderConstructionModal from "@/components/UnderConstructionModal"

const ConsumerSocialPage: React.FC = () => {
  const [showConstruction, setShowConstruction] = useState(true)

  return (
    <main className="min-h-screen p-4">
      <UnderConstructionModal />
    </main>
  )
}

export default ConsumerSocialPage
