import React, { useState } from "react"
import UnderConstructionModal from "@/components/UnderConstructionModal"

const MentalHealthPage: React.FC = () => {
  const [showConstruction, setShowConstruction] = useState(true)

  return (
    <main className="min-h-screen p-4">
      <UnderConstructionModal
        open={showConstruction}
        onClose={() => setShowConstruction(false)}
      />
    </main>
  )
}

export default MentalHealthPage
